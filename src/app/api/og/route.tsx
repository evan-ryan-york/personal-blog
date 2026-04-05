import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Ryan York";
  const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          backgroundColor: "#f7f5f0",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "4px",
              backgroundColor: "#c44d2b",
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "#0a0a0a",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: "16px",
                  color: "#6b6560",
                  borderRadius: "20px",
                  border: "1px solid #efe9df",
                  padding: "6px 16px",
                }}
              >
                {tag.trim()}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#6b6560",
              fontWeight: 600,
            }}
          >
            ryanyork.io
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
