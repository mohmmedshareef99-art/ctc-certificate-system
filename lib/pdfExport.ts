/**
 * PDF Generator Utility for Continental Training Center S.A. Certificates
 * Exports direct 1-page A4 Landscape PDF using html2canvas & jsPDF with element cloning.
 */

export async function downloadCertificatePDF(elementId: string, filename: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const element =
    document.getElementById(elementId) ||
    document.querySelector(`.${elementId}`) ||
    document.querySelector(`#${elementId}`);

  if (!element) {
    console.error(`[PDF Export Error] Target element "${elementId}" not found.`);
    alert(`Error: Target element "${elementId}" not found.`);
    return;
  }

  // Clean filename removing invalid filesystem characters
  const sanitizedFilename = (filename || 'Certificate').replace(/[/\\?%*:|"<>]/g, '_').trim();
  const pdfFilename = sanitizedFilename.toLowerCase().endsWith('.pdf') ? sanitizedFilename : `${sanitizedFilename}.pdf`;

  // Create temporary container at top:0, left:0, zIndex: 99999 so html2canvas calculates exact 0,0 bounds
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'fixed';
  tempContainer.style.top = '0';
  tempContainer.style.left = '0';
  tempContainer.style.width = '1000px';
  tempContainer.style.height = '707px';
  tempContainer.style.zIndex = '99999';
  tempContainer.style.backgroundColor = '#ffffff';
  tempContainer.style.overflow = 'hidden';

  // Deep clone the certificate DOM tree
  const clone = element.cloneNode(true) as HTMLElement;

  // Reset CSS transforms, scale, margins, absolute offsets, and bounds on cloned node
  clone.style.transform = 'none';
  clone.style.webkitTransform = 'none';
  clone.style.position = 'relative';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '1000px';
  clone.style.height = '707px';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';

  tempContainer.appendChild(clone);
  document.body.appendChild(tempContainer);

  try {
    // Dynamic client-side imports for Next.js App Router compatibility
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default || html2canvasModule;

    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule;

    // Small delay to ensure DOM layout settles
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Render canvas with explicit high DPI options
    const canvas = await html2canvas(clone, {
      scale: 2, // High DPI clarity
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 1000,
      height: 707,
      windowWidth: 1000,
      windowHeight: 707,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Create strict A4 Landscape PDF (297mm x 210mm)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
    pdf.save(pdfFilename);
  } catch (error) {
    console.error('[PDF Export Error] Failed to generate PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
  }
}
