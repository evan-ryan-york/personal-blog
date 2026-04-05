import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
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

    await resend.contacts.create({ email });

    if (fromEmail) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: email,
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
