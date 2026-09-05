import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface PDFExportProgress {
  current: number;
  total: number;
  pageTitle?: string;
}

const PAGE_TITLES: Record<string, string> = {
  'export-covering-letter-page': 'Office Covering Letter (Page 1 of 6)',
  'export-adjustment-bill-page': 'Adjustment Bill DAO Form (Page 2 of 6)',
  'export-tr22-obverse-page': 'Form T.R.22 Obverse (Page 3 of 6)',
  'export-schedule-part1-page': 'Monthly Schedule Part 1 Cols 1-18 (Page 4 of 6)',
  'export-schedule-part2-page': 'Monthly Schedule Part 2 Cols 19-28 (Page 5 of 6)',
  'export-tr22-reverse-page': 'Form T.R.22 Reverse & Certifications (Page 6 of 6)',
  'preview-covering-page': 'Office Covering Letter (Page 1 of 6)',
  'preview-adjustment-page': 'Adjustment Bill DAO Form (Page 2 of 6)',
  'preview-tr22-obverse-page': 'Form T.R.22 Obverse (Page 3 of 6)',
  'preview-schedule-part1-page': 'Monthly Schedule Part 1 Cols 1-18 (Page 4 of 6)',
  'preview-schedule-part2-page': 'Monthly Schedule Part 2 Cols 19-28 (Page 5 of 6)',
  'preview-tr22-reverse-page': 'Form T.R.22 Reverse & Certifications (Page 6 of 6)',
  'pension-dossier-page-1': 'Pension & 35% Commutation Calculation Sheet (Page 1 of 4)',
  'pension-dossier-page-2': 'Form 1: Application for Pension / Commutation (Page 2 of 4)',
  'pension-dossier-page-3': 'District Education Officer - Pension Sanction Order (Page 3 of 4)',
  'pension-dossier-page-4': 'Bill for Encashment of L.P.R. (365 Days) (Page 4 of 4)',
};

/**
 * Deep-copies browser computed styles (concrete RGB colors, pixel borders, fonts, alignments)
 * from the live rendered DOM element directly onto the cloned element tree.
 * Completely bypasses any external stylesheet parsing issues (e.g. Tailwind v4 variables,
 * OkLCH color spaces, and CSS shorthand properties).
 */
function inlineComputedStyles(srcNode: Element, destNode: Element) {
  if (srcNode.nodeType !== Node.ELEMENT_NODE || destNode.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const srcEl = srcNode as HTMLElement;
  const destEl = destNode as HTMLElement;
  const computed = window.getComputedStyle(srcEl);

  // Core visual styling
  destEl.style.color = computed.color;
  destEl.style.backgroundColor = computed.backgroundColor;
  destEl.style.fontFamily = computed.fontFamily || 'Arial, Helvetica, sans-serif';
  destEl.style.fontSize = computed.fontSize;
  destEl.style.fontWeight = computed.fontWeight;
  destEl.style.fontStyle = computed.fontStyle;
  destEl.style.textAlign = computed.textAlign;
  destEl.style.textTransform = computed.textTransform;
  destEl.style.letterSpacing = computed.letterSpacing;
  destEl.style.lineHeight = computed.lineHeight;

  // Concrete Borders - do NOT set borders on table row/section elements as html2canvas
  // renders TR borders as full-width bounding box stripes that cut through table cells.
  const isTableRowOrGroup = ['TR', 'THEAD', 'TBODY', 'TFOOT'].includes(destEl.tagName);
  if (isTableRowOrGroup) {
    destEl.style.borderTopStyle = 'none';
    destEl.style.borderRightStyle = 'none';
    destEl.style.borderBottomStyle = 'none';
    destEl.style.borderLeftStyle = 'none';
  } else {
    const topW = parseFloat(computed.borderTopWidth || '0');
    if (topW > 0) {
      destEl.style.borderTopWidth = computed.borderTopWidth;
      destEl.style.borderTopStyle = computed.borderTopStyle;
      destEl.style.borderTopColor = computed.borderTopColor;
    } else {
      destEl.style.borderTopStyle = 'none';
    }

    const rightW = parseFloat(computed.borderRightWidth || '0');
    if (rightW > 0) {
      destEl.style.borderRightWidth = computed.borderRightWidth;
      destEl.style.borderRightStyle = computed.borderRightStyle;
      destEl.style.borderRightColor = computed.borderRightColor;
    } else {
      destEl.style.borderRightStyle = 'none';
    }

    const bottomW = parseFloat(computed.borderBottomWidth || '0');
    if (bottomW > 0) {
      destEl.style.borderBottomWidth = computed.borderBottomWidth;
      destEl.style.borderBottomStyle = computed.borderBottomStyle;
      destEl.style.borderBottomColor = computed.borderBottomColor;
    } else {
      destEl.style.borderBottomStyle = 'none';
    }

    const leftW = parseFloat(computed.borderLeftWidth || '0');
    if (leftW > 0) {
      destEl.style.borderLeftWidth = computed.borderLeftWidth;
      destEl.style.borderLeftStyle = computed.borderLeftStyle;
      destEl.style.borderLeftColor = computed.borderLeftColor;
    } else {
      destEl.style.borderLeftStyle = 'none';
    }
  }

  // Spacing & Box Model
  destEl.style.paddingTop = computed.paddingTop;
  destEl.style.paddingRight = computed.paddingRight;
  destEl.style.paddingBottom = computed.paddingBottom;
  destEl.style.paddingLeft = computed.paddingLeft;

  destEl.style.marginTop = computed.marginTop;
  destEl.style.marginRight = computed.marginRight;
  destEl.style.marginBottom = computed.marginBottom;
  destEl.style.marginLeft = computed.marginLeft;

  destEl.style.boxSizing = 'border-box';

  // Positioning
  if (computed.position === 'relative' || computed.position === 'absolute' || computed.position === 'fixed') {
    destEl.style.position = computed.position;
    if (computed.top && computed.top !== 'auto') destEl.style.top = computed.top;
    if (computed.right && computed.right !== 'auto') destEl.style.right = computed.right;
    if (computed.bottom && computed.bottom !== 'auto') destEl.style.bottom = computed.bottom;
    if (computed.left && computed.left !== 'auto') destEl.style.left = computed.left;
  }

  // Dimensions: DO NOT inline computed pixel widths onto general block containers, paragraphs, or headings!
  // Inlining resolved viewport/screen pixel widths (e.g., 520px from desktop columns or 360px from mobile)
  // forcibly locks block elements to narrow widths, causing the exported A4 document to appear severely
  // off-center with one side too close and the other side too far!
  if (destEl.tagName === 'IMG' || destEl.tagName === 'CANVAS' || destEl.tagName === 'SVG') {
    if (computed.width && computed.width !== 'auto') destEl.style.width = computed.width;
    if (computed.height && computed.height !== 'auto') destEl.style.height = computed.height;
  } else if (destEl.tagName === 'TABLE') {
    destEl.style.width = '100%';
  } else if (destEl.tagName === 'TD' || destEl.tagName === 'TH') {
    // Preserve percentage width if present, else let table layout calculate naturally
    if (srcEl.getAttribute('width')) {
      destEl.style.width = srcEl.getAttribute('width')!;
    }
  } else {
    // Normal block elements (div, p, header, section, etc.)
    // Only inherit width if explicitly set in inline styles (e.g. w-64 signature block or percentage),
    // NEVER from window.getComputedStyle() which returns responsive pixel values!
    if (srcEl.style.width && srcEl.style.width !== 'auto') {
      destEl.style.width = srcEl.style.width;
    } else if (srcEl.className && srcEl.className.includes('w-64')) {
      destEl.style.width = '16rem';
    } else if (srcEl.className && srcEl.className.includes('w-1/2')) {
      destEl.style.width = '50%';
    } else if (srcEl.className && srcEl.className.includes('w-1/3')) {
      destEl.style.width = '33.333%';
    } else if (srcEl.className && srcEl.className.includes('w-full')) {
      destEl.style.width = '100%';
    }
  }

  if (computed.height && computed.height !== 'auto' && (destEl.tagName === 'IMG' || destEl.tagName === 'CANVAS' || destEl.tagName === 'SVG')) {
    destEl.style.height = computed.height;
  }
  if (computed.minHeight && computed.minHeight !== '0px' && destEl.tagName !== 'DIV') {
    destEl.style.minHeight = computed.minHeight;
  }

  // Table collapse
  if (destEl.tagName === 'TABLE') {
    destEl.style.borderCollapse = 'collapse';
    destEl.style.borderSpacing = '0';
    destEl.style.width = '100%';
  }

  // Flex & Grid layout stability
  if (computed.display === 'flex' || computed.display === 'inline-flex') {
    destEl.style.display = 'flex';
    destEl.style.flexDirection = computed.flexDirection;
    destEl.style.justifyContent = computed.justifyContent;
    destEl.style.alignItems = computed.alignItems;
    destEl.style.flexGrow = computed.flexGrow;
    destEl.style.flexShrink = computed.flexShrink;
    destEl.style.gap = computed.gap;
  } else if (computed.display === 'grid') {
    destEl.style.display = 'grid';
    destEl.style.gridTemplateColumns = computed.gridTemplateColumns;
    destEl.style.gap = computed.gap;
  }

  // SVG Specifics
  if (destEl instanceof SVGElement) {
    if (computed.fill && computed.fill !== 'none') {
      destEl.setAttribute('fill', computed.fill);
    }
    if (computed.stroke && computed.stroke !== 'none') {
      destEl.setAttribute('stroke', computed.stroke);
      destEl.setAttribute('stroke-width', computed.strokeWidth || '1');
    }
  }

  // Recurse children
  const srcChildren = srcEl.children;
  const destChildren = destEl.children;
  const len = Math.min(srcChildren.length, destChildren.length);
  for (let i = 0; i < len; i++) {
    inlineComputedStyles(srcChildren[i], destChildren[i]);
  }
}

/**
 * Generates an official 6-page A4 PDF from targeted DOM element IDs.
 * Uses html2canvas-pro with deep computed style inlining and explicit iframe CSS injection,
 * ensuring high-fidelity typography, borders, table grids, and dark badges.
 */
export async function generateFullArrearsPDF(
  pageElementIds: string[],
  fileName: string = 'Sindh_Salary_Arrears_Bill.pdf',
  onProgress?: (progress: PDFExportProgress) => void
): Promise<boolean> {
  const totalPages = pageElementIds.length;

  // 1. Ensure all custom web fonts are fully loaded before capturing
  if (typeof document !== 'undefined' && 'fonts' in document && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (fontErr) {
      console.warn('Font loading check notice:', fontErr);
    }
  }

  // Initialize jsPDF with standard A4 portrait dimensions
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // Create isolated DOM staging container attached to body
  const stagingContainer = document.createElement('div');
  stagingContainer.id = 'pdf-export-staging-sandbox';
  stagingContainer.style.position = 'fixed';
  stagingContainer.style.top = '0';
  stagingContainer.style.left = '0';
  stagingContainer.style.width = '794px';
  stagingContainer.style.zIndex = '99990';
  stagingContainer.style.backgroundColor = '#ffffff';
  stagingContainer.style.pointerEvents = 'none';
  stagingContainer.style.boxSizing = 'border-box';
  stagingContainer.style.margin = '0';
  stagingContainer.style.padding = '0';
  stagingContainer.style.overflow = 'visible';
  document.body.appendChild(stagingContainer);

  let pagesRendered = 0;

  try {
    for (let i = 0; i < totalPages; i++) {
      const elementId = pageElementIds[i];
      const pageTitle = PAGE_TITLES[elementId] || `Page ${i + 1} of ${totalPages}`;

      if (onProgress) {
        onProgress({ current: i + 1, total: totalPages, pageTitle });
      }

      // Find original element in the DOM (support both export- and preview- prefixes)
      const sourceElement =
        document.getElementById(elementId) ||
        document.getElementById(elementId.replace('export-', 'preview-'));

      if (!sourceElement) {
        console.warn(`Element with ID "${elementId}" not found, skipping.`);
        continue;
      }

      // Deep clone the page into our isolated staging container
      const clone = sourceElement.cloneNode(true) as HTMLElement;
      clone.id = `cloned-${elementId}`;
      clone.style.margin = '0';
      clone.style.boxShadow = 'none';
      clone.style.border = 'none';
      clone.style.borderTop = 'none';
      clone.style.borderRight = 'none';
      clone.style.borderBottom = 'none';
      clone.style.borderLeft = 'none';
      clone.style.display = 'block';
      clone.style.visibility = 'visible';
      clone.style.opacity = '1';
      clone.style.width = '794px';
      clone.style.minHeight = '1123px';
      clone.style.backgroundColor = '#ffffff';
      clone.style.transform = 'none';

      // Inline computed styles from live source element to clone
      inlineComputedStyles(sourceElement, clone);

      // Explicitly wipe out any outer border on the cloned page root
      clone.style.border = 'none';
      clone.style.borderTopStyle = 'none';
      clone.style.borderRightStyle = 'none';
      clone.style.borderBottomStyle = 'none';
      clone.style.borderLeftStyle = 'none';
      clone.style.boxShadow = 'none';

      // Clear previous clone and mount current clone
      stagingContainer.innerHTML = '';
      stagingContainer.appendChild(clone);

      // Allow DOM repaint
      await new Promise((resolve) => setTimeout(resolve, 100));

      const pageHeight = Math.max(clone.scrollHeight, clone.offsetHeight, 1123);

      // Render isolated page clone using html2canvas-pro with explicit iframe styling
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: pageHeight,
        windowWidth: 794,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          // Inject clean, safe layout styles inside html2canvas's internal clone
          const styleTag = clonedDoc.createElement('style');
          styleTag.textContent = `
            * { box-sizing: border-box !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body, div, p, span, th, td { font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important; }
            table { border-collapse: collapse !important; border-spacing: 0 !important; }
            .bg-black { background-color: #000000 !important; color: #ffffff !important; }
            .text-white { color: #ffffff !important; }
            .bg-neutral-200 { background-color: #e5e7eb !important; }
            .bg-neutral-100 { background-color: #f3f4f6 !important; }
            .bg-neutral-50 { background-color: #fafafa !important; }
            .grid-cols-12 { display: flex !important; flex-direction: row !important; width: 100% !important; }
            .grid-cols-3 { display: flex !important; flex-direction: row !important; width: 100% !important; }
            .grid-cols-3 > * { width: 33.333333% !important; flex-shrink: 0 !important; }
            .col-span-1 { width: 8.333333% !important; flex-shrink: 0 !important; }
            .col-span-2 { width: 16.666667% !important; flex-shrink: 0 !important; }
            .col-span-3 { width: 25% !important; flex-shrink: 0 !important; }
            .col-span-4 { width: 33.333333% !important; flex-shrink: 0 !important; }
            .col-span-5 { width: 41.666667% !important; flex-shrink: 0 !important; }
            .col-span-6 { width: 50% !important; flex-shrink: 0 !important; }
            .col-span-7 { width: 58.333333% !important; flex-shrink: 0 !important; }
            .col-span-8 { width: 66.666667% !important; flex-shrink: 0 !important; }
            .col-span-9 { width: 75% !important; flex-shrink: 0 !important; }
            .col-span-10 { width: 83.333333% !important; flex-shrink: 0 !important; }
            .col-span-11 { width: 91.666667% !important; flex-shrink: 0 !important; }
            .col-span-12 { width: 100% !important; flex-shrink: 0 !important; }
            .underline { text-decoration: underline !important; }
            .justify-between { justify-content: space-between !important; }
            .justify-end { justify-content: flex-end !important; }
            .items-center { align-items: center !important; }
            .flex { display: flex !important; }
            .text-center { text-align: center !important; }
            .text-right { text-align: right !important; }
            .text-left { text-align: left !important; }
          `;
          clonedDoc.head.appendChild(styleTag);
        },
        ignoreElements: (element: Element) => {
          if (element.id === `cloned-${elementId}` || clone.contains(element)) {
            return false;
          }
          return element.classList?.contains('no-print');
        },
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        console.warn(`Failed to generate canvas for page ${elementId}`);
        continue;
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      if (pagesRendered > 0) {
        pdf.addPage('a4', 'portrait');
      }

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      // Full A4 page placement - the component internal padding provides exact 15-20mm page margins
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pagesRendered++;
    }

    if (pagesRendered === 0) {
      throw new Error('No document pages could be captured for PDF export.');
    }

    // Trigger download with cross-device support
    try {
      pdf.save(fileName);
    } catch (saveError) {
      console.warn('Native pdf.save failed, triggering fallback blob download:', saveError);
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 2000);
    }

    return true;
  } finally {
    // Always clean up staging sandbox from the DOM
    if (stagingContainer.parentNode) {
      stagingContainer.parentNode.removeChild(stagingContainer);
    }
  }
}

/**
 * Export any single document or calculator result element directly as a high-resolution, strictly 1-page PDF.
 */
export async function exportSingleDocumentToPDF(
  elementOrId: string | HTMLElement,
  fileName: string = 'Sindh_Govt_Document.pdf',
  onProgress?: (isGenerating: boolean) => void,
  options?: { forceSinglePage?: boolean; scale?: number }
): Promise<boolean> {
  if (onProgress) onProgress(true);

  if (typeof document !== 'undefined' && 'fonts' in document && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  const sourceElement =
    typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId;

  if (!sourceElement) {
    if (onProgress) onProgress(false);
    throw new Error('Target document element not found for PDF export.');
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const stagingContainer = document.createElement('div');
  stagingContainer.id = 'single-pdf-export-staging';
  stagingContainer.style.position = 'fixed';
  stagingContainer.style.top = '0';
  stagingContainer.style.left = '-9999px';
  stagingContainer.style.width = '794px';
  stagingContainer.style.zIndex = '-9999';
  stagingContainer.style.backgroundColor = '#ffffff';
  stagingContainer.style.pointerEvents = 'none';
  stagingContainer.style.boxSizing = 'border-box';
  stagingContainer.style.margin = '0';
  stagingContainer.style.padding = '0';
  stagingContainer.style.overflow = 'visible';
  document.body.appendChild(stagingContainer);

  try {
    const clone = sourceElement.cloneNode(true) as HTMLElement;
    clone.id = 'cloned-single-export-doc';
    clone.style.margin = '0 auto';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';
    clone.style.display = 'block';
    clone.style.visibility = 'visible';
    clone.style.opacity = '1';
    clone.style.width = '794px';
    clone.style.maxWidth = '794px';
    clone.style.minWidth = '794px';
    clone.style.minHeight = 'auto';
    clone.style.backgroundColor = '#ffffff';
    clone.style.transform = 'none';
    clone.style.boxSizing = 'border-box';

    // Apply computed styles from source, then reinforce desktop dimensions
    inlineComputedStyles(sourceElement, clone);

    // Explicitly enforce clean full-width desktop layout on the clone root
    clone.style.width = '794px';
    clone.style.maxWidth = '794px';
    clone.style.minWidth = '794px';
    clone.style.padding = '36px 44px';
    clone.style.border = 'none';
    clone.style.boxShadow = 'none';
    clone.style.backgroundColor = '#ffffff';

    stagingContainer.innerHTML = '';
    stagingContainer.appendChild(clone);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const pageHeight = Math.max(clone.scrollHeight, clone.offsetHeight, 1000);

    const canvas = await html2canvas(clone, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      height: pageHeight,
      windowWidth: 794,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        const styleTag = clonedDoc.createElement('style');
        styleTag.textContent = `
          * { box-sizing: border-box !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          #single-pdf-export-staging { width: 794px !important; margin: 0 auto !important; }
          #cloned-single-export-doc {
            width: 794px !important;
            max-width: 794px !important;
            min-width: 794px !important;
            margin: 0 auto !important;
            padding: 36px 44px !important;
            box-sizing: border-box !important;
            font-family: "Times New Roman", Times, serif !important;
            color: #000000 !important;
            background-color: #ffffff !important;
          }
          #cloned-single-export-doc > div {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          table { width: 100% !important; border-collapse: collapse !important; border-spacing: 0 !important; font-family: Arial, Helvetica, sans-serif !important; }
          th, td { font-family: Arial, Helvetica, sans-serif !important; }
          .flex { display: flex !important; }
          .justify-between { justify-content: space-between !important; }
          .justify-end { justify-content: flex-end !important; }
          .items-center { align-items: center !important; }
          .text-center { text-align: center !important; }
          .text-right { text-align: right !important; }
          .text-left { text-align: left !important; }
          .text-justify { text-align: justify !important; }
          .font-mono { font-family: "Courier New", Courier, monospace !important; }
          .w-full { width: 100% !important; }
        `;
        clonedDoc.head.appendChild(styleTag);
      },
      ignoreElements: (el) => el.classList?.contains('no-print'),
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const imgProps = pdf.getImageProperties(imgData);
    const naturalHeightInPdf = (imgProps.height * pdfWidth) / imgProps.width;

    const forceSinglePage = options?.forceSinglePage !== false; // default true

    if (forceSinglePage || naturalHeightInPdf <= pdfHeight) {
      // Exactly 1 single page: scale proportionally if height exceeds A4 height
      let printWidth = pdfWidth;
      let printHeight = naturalHeightInPdf;

      if (printHeight > pdfHeight) {
        printHeight = pdfHeight;
        printWidth = (imgProps.width * pdfHeight) / imgProps.height;
      }

      const posX = Math.max(0, (pdfWidth - printWidth) / 2);
      const posY = Math.max(0, (pdfHeight - printHeight) / 2);

      pdf.addImage(imgData, 'JPEG', posX, posY, printWidth, printHeight, undefined, 'FAST');
    } else {
      // Multi-page slicing only when explicitly requested
      let heightLeft = naturalHeightInPdf;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, naturalHeightInPdf, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - naturalHeightInPdf;
        pdf.addPage('a4', 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, naturalHeightInPdf, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
    }

    try {
      pdf.save(fileName);
    } catch {
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 2000);
    }

    return true;
  } finally {
    if (stagingContainer.parentNode) {
      stagingContainer.parentNode.removeChild(stagingContainer);
    }
    if (onProgress) onProgress(false);
  }
}

export interface PensionPDFExportOptions {
  employeeName?: string;
  pageElementIds?: string[];
  onProgress?: (progress: PDFExportProgress | false) => void;
}

/**
 * Renders all 4 official Sindh Pension Papers proformas into a high-resolution,
 * multi-page vector PDF (A4 format) ready for District Accounts Office submission.
 */
export async function generateFullPensionPDF(options: PensionPDFExportOptions = {}): Promise<boolean> {
  const {
    employeeName = 'Employee',
    pageElementIds = [
      'pension-dossier-page-1',
      'pension-dossier-page-2',
      'pension-dossier-page-3',
      'pension-dossier-page-4',
    ],
    onProgress,
  } = options;

  const sanitizedName = employeeName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `Sindh_Pension_Papers_Complete_Dossier_${sanitizedName}.pdf`;

  // Create isolated off-screen staging container
  const stagingContainer = document.createElement('div');
  stagingContainer.id = 'pension-pdf-export-staging';
  stagingContainer.style.position = 'fixed';
  stagingContainer.style.left = '-9999px';
  stagingContainer.style.top = '0';
  stagingContainer.style.width = '794px';
  stagingContainer.style.backgroundColor = '#ffffff';
  stagingContainer.style.zIndex = '-9999';
  stagingContainer.style.opacity = '1';
  stagingContainer.style.pointerEvents = 'none';
  document.body.appendChild(stagingContainer);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  try {
    let pagesRendered = 0;

    for (let index = 0; index < pageElementIds.length; index++) {
      const elementId = pageElementIds[index];
      const pageTitle = PAGE_TITLES[elementId] || `Pension Proforma (Page ${index + 1} of ${pageElementIds.length})`;

      if (onProgress) {
        onProgress({
          current: index + 1,
          total: pageElementIds.length,
          pageTitle,
        });
      }

      const sourceElement = document.getElementById(elementId);
      if (!sourceElement) {
        console.warn(`Source element #${elementId} not found for pension PDF export.`);
        continue;
      }

      const clone = sourceElement.cloneNode(true) as HTMLElement;
      clone.id = `cloned-${elementId}`;
      clone.style.width = '794px';
      clone.style.minHeight = '1123px';
      clone.style.margin = '0 auto';
      clone.style.backgroundColor = '#ffffff';

      inlineComputedStyles(sourceElement, clone);

      clone.style.border = 'none';
      clone.style.boxShadow = 'none';

      stagingContainer.innerHTML = '';
      stagingContainer.appendChild(clone);

      await new Promise((resolve) => setTimeout(resolve, 80));

      const pageHeight = Math.max(clone.scrollHeight, clone.offsetHeight, 1123);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: pageHeight,
        windowWidth: 794,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const styleTag = clonedDoc.createElement('style');
          styleTag.textContent = `
            * { box-sizing: border-box !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body, div, p, span, th, td { font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important; }
            table { border-collapse: collapse !important; border-spacing: 0 !important; }
            .bg-slate-100 { background-color: #f1f5f9 !important; }
            .bg-slate-50 { background-color: #f8fafc !important; }
            .bg-purple-50 { background-color: #faf5ff !important; }
            .bg-emerald-50 { background-color: #ecfdf5 !important; }
            .grid-cols-2 { display: flex !important; flex-direction: row !important; flex-wrap: wrap !important; width: 100% !important; }
            .grid-cols-2 > * { width: 50% !important; flex-shrink: 0 !important; }
            .grid-cols-3 { display: flex !important; flex-direction: row !important; width: 100% !important; }
            .grid-cols-3 > * { width: 33.333333% !important; flex-shrink: 0 !important; }
            .justify-between { justify-content: space-between !important; }
            .justify-end { justify-content: flex-end !important; }
            .items-center { align-items: center !important; }
            .flex { display: flex !important; }
            .text-center { text-align: center !important; }
            .text-right { text-align: right !important; }
            .text-left { text-align: left !important; }
          `;
          clonedDoc.head.appendChild(styleTag);
        },
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        console.warn(`Failed to generate canvas for pension page ${elementId}`);
        continue;
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      if (pagesRendered > 0) {
        pdf.addPage('a4', 'portrait');
      }

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pagesRendered++;
    }

    if (pagesRendered === 0) {
      throw new Error('No pension document pages could be captured for PDF export.');
    }

    try {
      pdf.save(fileName);
    } catch {
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 2000);
    }

    return true;
  } finally {
    if (stagingContainer.parentNode) {
      stagingContainer.parentNode.removeChild(stagingContainer);
    }
    if (onProgress) onProgress(false);
  }
}

