import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const address = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(address)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey) {
      console.warn("Resend API key not configured.");
      return NextResponse.json(
        { error: "Subscriptions are not configured yet." },
        { status: 503 }
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const contact = await resend.contacts.create({ email: address });

    // Keep our own copy of the list regardless of how Resend went, so a Resend
    // outage never loses an address. Never fatal: the signup still counts.
    await saveSubscriber(address, contact.data?.id ?? null);

    if (contact.error) {
      console.error("Resend contact creation failed:", contact.error);
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }

    if (fromEmail) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: address,
          subject: "Thanks for subscribing!",
          html: `<p>Hey there!</p>
<p>Thanks for subscribing to my blog. I'll send you an email when I publish something new.</p>
<p>In the meantime, you can check out my latest posts at <a href="https://ryanyork.io">ryanyork.io</a>.</p>
<p>— Ryan</p>`,
          text: `Hey there!\n\nThanks for subscribing to my blog. I'll send you an email when I publish something new.\n\nIn the meantime, you can check out my latest posts at https://ryanyork.io.\n\n— Ryan`,
        });
      } catch (emailError) {
        console.error("Welcome email failed:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

async function saveSubscriber(email: string, resendContactId: string | null) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    console.warn(`Supabase private key not configured — not storing ${email}.`);
    return;
  }

  try {
    const { error } = await supabase
      .from("subscribers")
      .upsert(
        { email, source: "site", resend_contact_id: resendContactId },
        { onConflict: "email", ignoreDuplicates: true }
      );

    if (error) {
      console.error("Failed to store subscriber:", error);
    }
  } catch (storeError) {
    // Losing our copy must never cost the visitor their subscription.
    console.error("Failed to store subscriber:", storeError);
  }
}
