import { unstable_cache } from "next/cache";
import QRCode from "qrcode";

async function buildQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 280,
    margin: 2,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}

export async function generateQrDataUrl(url: string): Promise<string> {
  return unstable_cache(buildQrDataUrl, ["qr-data-url", url], {
    revalidate: 60 * 60 * 24,
  })(url);
}
