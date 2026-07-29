import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { markdownToHtml } from "./markdownBridge";

export type ExportContractPdfOptions = {
  title: string;
  content: string;
  jobId?: string | null;
  fileName?: string;
};

const BRAND = "#003ec7";
const ACCENT = "#d69e2e";
const INK = "#152033";
const MUTED = "#5c6b82";
const PAPER = "#fbfaf7";
const RULE = "#d8e0ef";

function sanitizeFileName(name: string) {
  return (
    name
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
      .replace(/\s+/g, "_")
      .slice(0, 80) || "LegalMind_Contract"
  );
}

function formatArabicDate(date = new Date()) {
  return date.toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`تعذّر تحميل الصورة: ${src}`));
    img.src = src;
  });
}

async function imageToPngDataUrl(
  img: HTMLImageElement,
  size = 512,
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("تعذّر تجهيز العلامة المائية");
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);
  return canvas.toDataURL("image/png");
}

function buildDocumentHtml(options: {
  title: string;
  bodyHtml: string;
  jobId?: string | null;
  issuedAt: string;
  logoUrl: string;
}) {
  const ref = options.jobId
    ? `LM-${options.jobId.slice(0, 8).toUpperCase()}`
    : `LM-${Date.now().toString(36).toUpperCase()}`;

  return `
  <div id="lm-pdf-root" dir="rtl" lang="ar" style="
    width: 794px;
    background: ${PAPER};
    color: ${INK};
    font-family: var(--font-ibm-plex-arabic), 'IBM Plex Sans Arabic', Tahoma, Arial, sans-serif;
    position: relative;
    overflow: hidden;
  ">
    <div style="
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image:
        radial-gradient(circle at 12% 8%, rgba(0,62,199,0.045), transparent 42%),
        radial-gradient(circle at 88% 92%, rgba(214,158,46,0.04), transparent 40%);
    "></div>

    <div style="position: relative; z-index: 1; padding: 42px 48px 36px;">
      <header style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding-bottom: 18px;
        border-bottom: 2px solid ${BRAND};
      ">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="
            width: 54px;
            height: 54px;
            border-radius: 14px;
            background: linear-gradient(145deg, #0b1326, #12244a);
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow: 0 8px 20px rgba(0,62,199,0.18);
          ">
            <img src="${options.logoUrl}" width="34" height="34" alt="LegalMind" style="display:block;" />
          </div>
          <div>
            <div style="font-size: 20px; font-weight: 700; color: ${BRAND}; line-height: 1.2;">LegalMind</div>
            <div style="font-size: 11px; color: ${MUTED}; margin-top: 2px; letter-spacing: 0.04em;">
              منصة الصياغة والتحليل القانوني الذكي
            </div>
          </div>
        </div>
        <div style="text-align: left; font-size: 11px; color: ${MUTED}; line-height: 1.7;">
          <div style="
            display:inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            background: rgba(0,62,199,0.08);
            color: ${BRAND};
            font-weight: 700;
            margin-bottom: 6px;
          ">عقد احترافي</div>
          <div>${escapeHtml(options.issuedAt)}</div>
          <div style="font-family: ui-monospace, monospace; letter-spacing: 0.04em;">${ref}</div>
        </div>
      </header>

      <div style="
        height: 3px;
        margin-top: 3px;
        background: linear-gradient(90deg, ${ACCENT}, transparent 70%);
        border-radius: 999px;
      "></div>

      <section style="margin-top: 34px; text-align: center;">
        <div style="
          display:inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: ${ACCENT};
          margin-bottom: 10px;
          text-transform: uppercase;
        ">CONTRACT DRAFT</div>
        <h1 style="
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: ${INK};
          line-height: 1.45;
        ">${escapeHtml(options.title)}</h1>
        <p style="
          margin: 12px auto 0;
          max-width: 520px;
          font-size: 12px;
          color: ${MUTED};
          line-height: 1.7;
        ">
          وثيقة مُصدَّرة من محرر LegalMind وتتضمن آخر التعديلات المحفوظة في المسودة الحالية.
        </p>
      </section>

      <div style="
        margin: 28px 0 22px;
        display:flex;
        align-items:center;
        gap: 12px;
        color: ${MUTED};
        font-size: 11px;
      ">
        <span style="flex:1; height:1px; background:${RULE};"></span>
        <span>نص العقد</span>
        <span style="flex:1; height:1px; background:${RULE};"></span>
      </div>

      <article class="lm-pdf-body" style="
        font-size: 13.5px;
        line-height: 2;
        color: ${INK};
        text-align: justify;
      ">
        ${options.bodyHtml}
      </article>

      <footer style="
        margin-top: 42px;
        padding-top: 16px;
        border-top: 1px solid ${RULE};
        display:flex;
        justify-content: space-between;
        gap: 16px;
        font-size: 10px;
        color: ${MUTED};
        line-height: 1.7;
      ">
        <div>
          <div style="font-weight:700; color:${BRAND};">LegalMind AI</div>
          <div>مسودة للاستخدام المهني · يُنصح بالمراجعة القانونية النهائية قبل التوقيع</div>
        </div>
        <div style="text-align:left;">
          <div style="color:${ACCENT}; font-weight:700;">سري / للاستخدام المصرّح</div>
          <div>Generated with LegalMind Contract Studio</div>
        </div>
      </footer>
    </div>
  </div>
  `;
}

function injectPdfStyles(root: HTMLElement) {
  const style = document.createElement("style");
  style.textContent = `
    #lm-pdf-root .lm-pdf-body h1 {
      font-size: 22px;
      font-weight: 700;
      margin: 1.1em 0 0.45em;
      color: ${BRAND};
      line-height: 1.4;
    }
    #lm-pdf-root .lm-pdf-body h2 {
      font-size: 17px;
      font-weight: 700;
      margin: 1em 0 0.4em;
      color: ${BRAND};
      line-height: 1.45;
      padding-bottom: 4px;
      border-bottom: 1px solid ${RULE};
    }
    #lm-pdf-root .lm-pdf-body h3 {
      font-size: 15px;
      font-weight: 700;
      margin: 0.9em 0 0.35em;
      color: ${INK};
    }
    #lm-pdf-root .lm-pdf-body p {
      margin: 0.55em 0;
    }
    #lm-pdf-root .lm-pdf-body ul {
      list-style: disc;
      padding-inline-start: 1.4rem;
      margin: 0.55em 0;
    }
    #lm-pdf-root .lm-pdf-body ol {
      list-style: decimal;
      padding-inline-start: 1.4rem;
      margin: 0.55em 0;
    }
    #lm-pdf-root .lm-pdf-body li {
      margin: 0.2em 0;
    }
    #lm-pdf-root .lm-pdf-body blockquote {
      margin: 0.9em 0;
      padding: 0.7rem 0.95rem;
      border-inline-start: 3px solid ${ACCENT};
      background: rgba(0,62,199,0.04);
      border-radius: 0 10px 10px 0;
      color: ${MUTED};
    }
    #lm-pdf-root .lm-pdf-body hr {
      border: 0;
      border-top: 1px solid ${RULE};
      margin: 1.2em 0;
    }
    #lm-pdf-root .lm-pdf-body a {
      color: ${BRAND};
      text-decoration: underline;
    }
    #lm-pdf-root .lm-pdf-body mark {
      background: rgba(214,158,46,0.28);
      border-radius: 3px;
      padding: 0 0.15em;
    }
    #lm-pdf-root .lm-pdf-body strong { font-weight: 700; }
    #lm-pdf-root .lm-pdf-body em { font-style: italic; }
    #lm-pdf-root .lm-pdf-body u { text-decoration: underline; }
    #lm-pdf-root .lm-pdf-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
      font-size: 12px;
    }
    #lm-pdf-root .lm-pdf-body th,
    #lm-pdf-root .lm-pdf-body td {
      border: 1px solid ${RULE};
      padding: 8px 10px;
      vertical-align: top;
    }
    #lm-pdf-root .lm-pdf-body th {
      background: rgba(0,62,199,0.07);
      font-weight: 700;
      color: ${BRAND};
    }
  `;
  root.appendChild(style);
}

function addPageChrome(
  pdf: jsPDF,
  pageNumber: number,
  totalPages: number,
  watermarkDataUrl: string,
) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Soft watermark — centered, large, very light
  const wmSize = 78;
  const wmX = (pageWidth - wmSize) / 2;
  const wmY = (pageHeight - wmSize) / 2 - 8;

  pdf.saveGraphicsState();
  pdf.setGState(pdf.GState({ opacity: 0.06 }));
  pdf.addImage(
    watermarkDataUrl,
    "PNG",
    wmX,
    wmY,
    wmSize,
    wmSize,
    undefined,
    "FAST",
  );
  pdf.restoreGraphicsState();

  // Top brand hairline
  pdf.setDrawColor(0, 62, 199);
  pdf.setLineWidth(0.35);
  pdf.line(14, 10, pageWidth - 14, 10);
  pdf.setDrawColor(214, 158, 46);
  pdf.setLineWidth(0.7);
  pdf.line(14, 11.2, 48, 11.2);

  // Footer
  pdf.setDrawColor(216, 224, 239);
  pdf.setLineWidth(0.25);
  pdf.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

  pdf.setTextColor(92, 107, 130);
  pdf.setFontSize(8);
  pdf.text("LegalMind · Contract Studio", 14, pageHeight - 7, {
    align: "left",
  });
  pdf.text(`${pageNumber} / ${totalPages}`, pageWidth / 2, pageHeight - 7, {
    align: "center",
  });
  pdf.text("Confidential", pageWidth - 14, pageHeight - 7, { align: "right" });
}

export async function exportContractPdf(
  options: ExportContractPdfOptions,
): Promise<void> {
  const title = options.title.trim() || "مسودة عقد";
  const raw = options.content?.trim();
  if (!raw) {
    throw new Error("لا يوجد محتوى لتصديره");
  }

  const bodyHtml = markdownToHtml(raw);
  const issuedAt = formatArabicDate();
  const logoUrl = `${window.location.origin}/favicon.svg`;

  await document.fonts.ready;
  const logoImg = await loadImage(logoUrl);
  const watermarkDataUrl = await imageToPngDataUrl(logoImg, 512);

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText =
    "position:fixed; left:-10000px; top:0; width:794px; pointer-events:none; z-index:-1;";
  host.innerHTML = buildDocumentHtml({
    title,
    bodyHtml,
    jobId: options.jobId,
    issuedAt,
    logoUrl,
  });
  document.body.appendChild(host);

  const root = host.querySelector("#lm-pdf-root") as HTMLElement | null;
  if (!root) {
    host.remove();
    throw new Error("تعذّر تجهيز مستند التصدير");
  }
  injectPdfStyles(host);

  try {
    // Allow images/fonts to settle
    await new Promise((r) => setTimeout(r, 80));

    const canvas = await html2canvas(root, {
      scale: 2.2,
      useCORS: true,
      backgroundColor: PAPER,
      logging: false,
      windowWidth: 794,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginX = 0;
    const marginTop = 14;
    const marginBottom = 16;
    const usableHeight = pageHeight - marginTop - marginBottom;

    const imgWidth = pageWidth - marginX * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const totalPages = Math.max(1, Math.ceil(imgHeight / usableHeight));
    const pageCanvas = document.createElement("canvas");
    const pageCtx = pageCanvas.getContext("2d");
    if (!pageCtx) throw new Error("تعذّر تقسيم صفحات PDF");

    const pxPerMm = canvas.width / imgWidth;
    const sliceHeightPx = usableHeight * pxPerMm;

    for (let page = 0; page < totalPages; page += 1) {
      if (page > 0) pdf.addPage();

      const sourceY = page * sliceHeightPx;
      const sourceHeight = Math.min(sliceHeightPx, canvas.height - sourceY);

      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.max(1, Math.floor(sourceHeight));
      pageCtx.fillStyle = PAPER;
      pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      pageCtx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sourceHeight,
        0,
        0,
        canvas.width,
        sourceHeight,
      );

      const pageData = pageCanvas.toDataURL("image/jpeg", 0.96);
      const drawHeight = sourceHeight / pxPerMm;
      pdf.addImage(
        pageData,
        "JPEG",
        marginX,
        marginTop,
        imgWidth,
        drawHeight,
        undefined,
        "FAST",
      );
      addPageChrome(pdf, page + 1, totalPages, watermarkDataUrl);
    }

    const fileName = `${sanitizeFileName(options.fileName || title)}.pdf`;
    pdf.save(fileName);
  } finally {
    host.remove();
  }
}
