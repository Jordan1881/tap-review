import QRCode from "qrcode";

export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 280,
    margin: 2,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}
