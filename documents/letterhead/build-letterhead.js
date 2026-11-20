// Builds the Veridian letterhead in two versions, both in documents/templates/:
//   Veridian-Letterhead.docx         blank body, for any document
//   Veridian-Letter-Template.docx    laid out as a letter: ref, date, recipient, subject,
//                                    salutation and a signed sign-off
// Run: npm run build   (inside documents/letterhead)
//
// The letterhead lives in the page header and footer, so the body is free text: page 1
// carries the full header, later pages a slim one. Same look as the quotation
// (documents/quotation/build-quotation.js).
//
// The fill-in fields in the letter are Word placeholders (content controls): grey until
// clicked, and what you type replaces them in normal black text.
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const {
  AlignmentType, BorderStyle, Document, Footer, Header, HorizontalPositionRelativeFrom, ImageRun, Packer,
  PageNumber, Paragraph, Table, TableCell, TableLayoutType, TableRow, TabStopType, TextRun,
  TextWrappingType, VerticalAlign, VerticalPositionRelativeFrom, WidthType,
} = require('docx');

const ROOT = path.resolve(__dirname, '../..');

// Company facts. Keep in step with src/config/company.ts and the quotation.
const COMPANY = {
  legalName: 'Veridian Tech Innovations Ltd',
  address: ['7, Pius Drive, Fagbinle Estate,', 'Isheri Ijegun, Lagos 100266'],
  phones: '0806 504 1081  ·  0904 325 2415',
  email: 'info@veridiantechinnovationsltd.com',
  website: 'veridiantechinnovationsltd.com',
  rc: '9367650',
  duns: '352292647',
  productSite: 'www.easypass.ng', // www is canonical; the bare domain only redirects
  signName: 'Ugochukwu Omenogor',
  signRole: 'Managing Director',
};

const LOGO = fs.readFileSync(path.join(ROOT, 'public/veridian-signature.png')); // 198×226
// The MD's signature is private (gitignored), shared with the quotation. Without it the
// sign-off is left blank for a pen.
const SIGNATURE_FILE = path.join(ROOT, 'documents/quotation/private/signature.png'); // 507×333
const SIGNATURE = fs.existsSync(SIGNATURE_FILE) ? fs.readFileSync(SIGNATURE_FILE) : null;

const NIGHT = '062B1C';
const EMERALD = '075C33';
const INK = '0F1F17';
const MUTED = '5B6660';
const LINE = 'CBD5CE';
const HOLDER = '8E9A93';
const FONT = 'Arial';
const BODY_SIZE = 22; // 11 pt

const PAGE = { width: 11906, height: 16838 };
const MARGIN = 1134; // 2 cm
const W = PAGE.width - 2 * MARGIN;

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NO_BORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size ?? BODY_SIZE, bold: o.bold, color: o.color ?? INK, characterSpacing: o.spacing, underline: o.underline ? {} : undefined });
// A fill-in field: written as a marker, turned into a Word placeholder in postProcess().
const holder = (text, o = {}) => run(`{{PH|${text}}}`, o);
const p = (children, o = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [run(children, o)],
  alignment: o.align, keepNext: o.keepNext, tabStops: o.tabStops, border: o.border,
  spacing: { before: o.before ?? 0, after: o.after ?? 0, line: o.line ?? 276 },
});

// ---------- header and footer ----------
// Page 1: a large logo on the left and the company name, big and bold, on the right,
// then the contact details spread across the full width, then a thick emerald rule.
function firstHeader() {
  const cell = (children, w, o = {}) => new TableCell({
    children, width: { size: w, type: WidthType.DXA }, verticalAlign: o.v ?? VerticalAlign.CENTER,
    borders: o.borders, margins: { top: o.pt ?? 0, bottom: o.pb ?? 0, left: o.pl ?? 0, right: o.pr ?? 0 },
  });
  const table = (rows, widths) => new Table({
    rows, columnWidths: widths, width: { size: W, type: WidthType.DXA }, layout: TableLayoutType.FIXED, borders: NO_BORDERS,
  });

  // Row 1: logo (about 3.2 cm tall, as supplied) and the name block.
  const logoW = 2200;
  const top = table([new TableRow({ children: [
    cell([p([new ImageRun({ type: 'png', data: LOGO, transformation: { width: 106, height: 121 } })])], logoW),
    cell([
      p([run(COMPANY.legalName.toUpperCase(), { bold: true, size: 40, color: NIGHT, spacing: 10 })], { align: AlignmentType.RIGHT, line: 240, after: 80 }),
      p([run(`RC ${COMPANY.rc}   ·   D-U-N-S ${COMPANY.duns}`, { bold: true, size: 20, color: EMERALD, spacing: 10 })], { align: AlignmentType.RIGHT, line: 240 }),
    ], W - logoW),
  ] })], [logoW, W - logoW]);

  // Row 2: three columns across the page, each a bold label over its details.
  const label = (t) => p([run(t, { bold: true, size: 16, color: EMERALD, spacing: 20 })], { line: 240, after: 40 });
  const line = (t, o = {}) => p([run(t, { size: 20, bold: o.bold, color: o.color ?? INK })], { line: 250 });
  const divider = { style: BorderStyle.SINGLE, size: 4, color: LINE };
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  // The email and website column is the widest, so neither address wraps.
  const colW = [3200, 2050, W - 3200 - 2050];
  const col = (children, i) => cell(children, colW[i], {
    v: VerticalAlign.TOP, pt: 140, pb: 160, pl: i === 0 ? 0 : 200, pr: 120,
    borders: { top: divider, bottom: none, right: none, left: i === 0 ? none : divider },
  });
  const contacts = table([new TableRow({ children: [
    col([label('ADDRESS'), ...COMPANY.address.map((l) => line(l))], 0),
    col([label('PHONE'), ...COMPANY.phones.split('  ·  ').map((n) => line(n, { bold: true }))], 1),
    col([label('EMAIL AND WEB'), line(COMPANY.email, { bold: true }), line(COMPANY.website, { bold: true, color: EMERALD })], 2),
  ] })], colW);

  return new Header({ children: [
    top,
    contacts,
    p('', { border: { bottom: { style: BorderStyle.SINGLE, size: 24, color: EMERALD, space: 1 } }, line: 120 }),
    // Clear space between the rule and the first line of the letter.
    p('', { line: 360 }),
  ] });
}

const laterHeader = () => new Header({ children: [new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: W }],
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: EMERALD, space: 6 } },
  children: [
    new ImageRun({ type: 'png', data: LOGO, transformation: { width: 44, height: 50 } }),
    new TextRun({ text: `\t${COMPANY.legalName.toUpperCase()}`, font: FONT, size: 18, bold: true, color: NIGHT }),
  ],
})] });

// Two lines: the company's registration details, then our own product. "Makers of
// EasyPass" is the same wording the website uses (hero, footer, About).
const footer = () => new Footer({ children: [
  new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: W }],
    border: { top: { style: BorderStyle.SINGLE, size: 12, color: EMERALD, space: 6 } },
    spacing: { after: 30 },
    children: [
      new TextRun({ text: `${COMPANY.legalName}  ·  RC ${COMPANY.rc}  ·  D-U-N-S ${COMPANY.duns}  ·  ${COMPANY.website}`, font: FONT, size: 15, color: MUTED }),
      new TextRun({ children: ['\tPage ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], font: FONT, size: 15, color: MUTED }),
    ],
  }),
  new Paragraph({
    children: [
      new TextRun({ text: 'Makers of ', font: FONT, size: 15, color: MUTED }),
      new TextRun({ text: 'EasyPass', font: FONT, size: 15, bold: true, color: EMERALD }),
      new TextRun({ text: `, visitor management for residential estates  ·  ${COMPANY.productSite}`, font: FONT, size: 15, color: MUTED }),
    ],
  }),
] });

// ---------- body ----------
function letterBody() {
  const SIG_W_CM = 5;
  const SIG_H_CM = SIG_W_CM * 333 / 507;
  const signature = SIGNATURE && new ImageRun({
    type: 'png', data: SIGNATURE,
    transformation: { width: Math.round(SIG_W_CM * 37.8), height: Math.round(SIG_H_CM * 37.8) },
    floating: {
      horizontalPosition: { relative: HorizontalPositionRelativeFrom.COLUMN, offset: 0 },
      verticalPosition: { relative: VerticalPositionRelativeFrom.PARAGRAPH, offset: Math.round(0.6 * 360000) },
      wrap: { type: TextWrappingType.NONE }, allowOverlap: true,
    },
  });
  const K = { keepNext: true };
  return [
    p([run('Our ref: ', { color: MUTED }), holder('VTI/L/YYYY/NNNN'), run('\tDate: ', { color: MUTED }), holder('Date')], { tabStops: [{ type: TabStopType.RIGHT, position: W }], after: 360 }),
    p([holder('Recipient name')]),
    p([holder('Position')]),
    p([holder('Company')]),
    p([holder('Address')]),
    p([holder('City, State')], { after: 360 }),
    p([run('Dear '), holder('Sir / Madam / Name'), run(',')], { after: 240 }),
    p([holder('SUBJECT OF THE LETTER', { bold: true, underline: true })], { after: 240 }),
    p([holder('Start typing your letter here.')], { after: 240 }),
    p([run('Yours faithfully,'), ...(signature ? [signature] : [])], K),
    // Room for the signature (or a pen), then the name under it.
    p('', { ...K, after: Math.round((SIG_H_CM + 0.1) * 567) }),
    p([run(COMPANY.signName, { bold: true })], K),
    p([run(COMPANY.signRole)], K),
    p([run(`For: ${COMPANY.legalName}`, { size: 20 })]),
  ];
}

function build({ letter }) {
  return new Document({
    creator: COMPANY.legalName,
    title: letter ? 'Veridian Letter' : 'Veridian Letterhead',
    styles: { default: { document: { run: { font: FONT, size: BODY_SIZE, color: INK }, paragraph: { spacing: { line: 276, after: 160 } } } } },
    sections: [{
      properties: { titlePage: true, page: { size: PAGE, margin: { top: 1100, bottom: 1080, left: MARGIN, right: MARGIN, header: 500, footer: 450 } } },
      headers: { first: firstHeader(), default: laterHeader() },
      footers: { first: footer(), default: footer() },
      children: letter ? letterBody() : [new Paragraph({ children: [run('')] })],
    }],
  });
}

// Turn {{PH|text}} runs into plain-text content controls showing a grey placeholder.
// The control's own run properties (ink, not grey) are what typed text gets.
async function postProcess(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  let xml = await zip.file('word/document.xml').async('string');
  let id = 1000;
  xml = xml.replace(/<w:r>(<w:rPr>((?:(?!<\/w:rPr>).)*)<\/w:rPr>)?<w:t(?: [^>]*)?>\{\{PH\|(.*?)\}\}<\/w:t><\/w:r>/g, (_, _rPr, inner = '', text) => {
    const typed = inner.replace(/<w:color [^>]*\/>/, `<w:color w:val="${INK}"/>`);
    const shown = inner.replace(/<w:color [^>]*\/>/, `<w:color w:val="${HOLDER}"/>`);
    id += 1;
    return `<w:sdt><w:sdtPr><w:rPr>${typed}</w:rPr><w:alias w:val="${text}"/><w:id w:val="${id}"/><w:showingPlcHdr/><w:text/></w:sdtPr>`
      + `<w:sdtContent><w:r><w:rPr>${shown}</w:rPr><w:t xml:space="preserve">[${text}]</w:t></w:r></w:sdtContent></w:sdt>`;
  });
  if (xml.includes('{{PH')) throw new Error('Unconverted placeholder marker left in document.xml');
  zip.file('word/document.xml', xml);
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

async function write(file, opts) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, await postProcess(await Packer.toBuffer(build(opts))));
  console.log('Wrote', file);
}

(async () => {
  // Optional output folder, e.g. to preview while the templates are open in Word.
  const outDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'documents/templates');
  await write(path.join(outDir, 'Veridian-Letterhead.docx'), { letter: false });
  await write(path.join(outDir, 'Veridian-Letter-Template.docx'), { letter: true });
})().catch((e) => { console.error(e); process.exit(1); });
