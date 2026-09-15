import { type NextRequest, NextResponse } from "next/server";
import { PINIT } from "@/lib/products";

/**
 * The smart link behind the QR code.
 *
 * One URL for every device: it reads the requesting user agent and forwards to
 * the App Store, Play Store, or — for anyone on a desktop, who cannot install
 * from a store page anyway — the product site.
 *
 * 302 rather than 301: a permanent redirect would be cached by the browser, and
 * the whole point is that the same URL resolves differently per device. A cached
 * 301 from a desktop visit would send that person's phone to the wrong place.
 */
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const agent = request.headers.get("user-agent") ?? "";

  // iPadOS reports itself as Macintosh, so the touch hint is what separates a
  // modern iPad from a desktop Mac.
  const isIOS =
    /iPhone|iPad|iPod/i.test(agent) ||
    (/Macintosh/i.test(agent) && /Mobile|Touch/i.test(agent));
  const isAndroid = /Android/i.test(agent);

  const destination = isIOS
    ? PINIT.appStore
    : isAndroid
      ? PINIT.playStore
      : PINIT.website;

  return NextResponse.redirect(destination, 302);
}
