import { NextRequest, NextResponse } from "next/server";

const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^169\.254\./,
  /^192\.168\./,
  /^\[?::1\]?$/,
];

function isPrivateIpv4(hostname: string): boolean {
  if (!/^172\.\d+\.\d+\.\d+$/.test(hostname)) return false;
  const secondOctet = Number(hostname.split(".")[1]);
  return secondOctet >= 16 && secondOctet <= 31;
}

function isAllowedImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    if (!["http:", "https:"].includes(url.protocol)) return false;
    if (hostname.endsWith(".local")) return false;
    if (BLOCKED_HOST_PATTERNS.some((pattern) => pattern.test(hostname))) {
      return false;
    }

    return !isPrivateIpv4(hostname);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src");

  if (!src || !isAllowedImageUrl(src)) {
    return new NextResponse("Invalid image URL", { status: 400 });
  }

  try {
    const upstream = await fetch(src, {
      headers: {
        accept: "image/avif,image/webp,image/*,*/*;q=0.8",
      },
      next: { revalidate: 60 * 30 },
    });

    if (!upstream.ok) {
      return new NextResponse("Image unavailable", { status: 404 });
    }

    const contentType = upstream.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return new NextResponse("Unsupported image", { status: 415 });
    }

    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      headers: {
        "cache-control": "public, max-age=1800, stale-while-revalidate=86400",
        "content-type": contentType,
      },
    });
  } catch (error) {
    console.error("[image-proxy]", {
      src,
      error,
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return new NextResponse("Image unavailable", { status: 502 });
  }
}
