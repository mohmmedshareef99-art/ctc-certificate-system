import QRCode from 'qrcode';

/**
 * Generates a high-contrast DataURL string for a QR code pointing to the verification URL.
 */
export async function generateQRCodeDataURL(hash: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl.replace(/\/$/, '')}/verify/${hash}`;

  try {
    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#002B49', // High contrast CTC dark navy
        light: '#FFFFFF'
      },
      width: 300
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR Code DataURL:', err);
    throw err;
  }
}

/**
 * Generates a high-contrast SVG string for a QR code pointing to the verification URL.
 */
export async function generateQRCodeSVG(hash: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl.replace(/\/$/, '')}/verify/${hash}`;

  try {
    const svgString = await QRCode.toString(url, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#002B49',
        light: '#FFFFFF'
      }
    });
    return svgString;
  } catch (err) {
    console.error('Error generating QR Code SVG:', err);
    throw err;
  }
}

/**
 * Generates and triggers browser download of the QR code PNG image for a candidate certificate.
 */
export async function downloadQRCodePNG(hash: string, certNumber?: string): Promise<void> {
  try {
    const dataUrl = await generateQRCodeDataURL(hash);
    if (typeof window === 'undefined') return;

    const fileName = certNumber
      ? `CTC_QRCode_${certNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`
      : `CTC_QRCode_${hash.substring(0, 8)}.png`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to download QR code image:', err);
    throw err;
  }
}

