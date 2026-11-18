// Builds the Veridian quotation: a blank template and a filled sample, both in documents/templates/.
// Run: npm run build                              (inside documents/quotation)
//      node build-quotation.js 12 <out.docx>      a sample with 12 items, to test page flow
//      node build-quotation.js template <out.docx> a blank copy somewhere else
//
// Calculations are Word formula fields (no macros). Ctrl+A then F9 recalculates:
//   Amount   = PRODUCT(LEFT)            qty × unit price, relative, so copied rows keep working
//   Subtotal = SUM(Items F:F)           the whole Amount column of the bookmarked items table
//   VAT      = (subtotal + delivery) × 7.5%
//   Total    = subtotal + delivery + VAT
// docx-js has no complex-field API, so fields are written as {{F|instruction|cached}} markers
// and turned into real Word fields in postProcess().
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const {
  AlignmentType, BorderStyle, Bookmark, Document, Footer, Header, HeightRule, HorizontalPositionRelativeFrom, ImageRun, LevelFormat, LineRuleType, Packer,
  PageNumber, Paragraph, ShadingType, Table, TableCell, TableLayoutType, TableRow, TabStopType, TextRun,
  TextWrappingType, VerticalAlign, VerticalPositionRelativeFrom, WidthType,
} = require('docx');

const ROOT = path.resolve(__dirname, '../..');

// Company facts. Keep in step with src/config/company.ts and src/config/site.json.
const COMPANY = {
  legalName: 'Veridian Tech Innovations Ltd',
  address: ['7, Pius Drive, Fagbinle Estate,', 'Isheri Ijegun, Lagos 100266'],
  phones: '0806 504 1081  ·  0904 325 2415',
  email: 'info@veridiantechinnovationsltd.com',
  website: 'veridiantechinnovationsltd.com',
  rc: '9367650',
  duns: '352292647',
  signName: 'Ugochukwu Omenogor',
  signRole: 'Managing Director',
};

const LOGO = fs.readFileSync(path.join(ROOT, 'public/veridian-signature.png')); // 198×226
// The MD's signature is private: it lives in ./private (gitignored). Without the file the
// signature space is left empty, to be signed by hand.
const SIGNATURE_FILE = path.join(__dirname, 'private/signature.png'); // 507×333, transparent
const SIGNATURE = fs.existsSync(SIGNATURE_FILE) ? fs.readFileSync(SIGNATURE_FILE) : null;

const NIGHT = '062B1C'; // table headings
const EMERALD = '075C33'; // the total, the only strong colour on the page apart from the logo
const GOLD = 'C9A55C'; // hairline rules
const INK = '0F1F17';
const MUTED = '5B6660';
const LINE = 'CBD5CE';
const TINT = 'EEF3EE';
const HOLDER = '8E9A93'; // grey placeholder text, typed over per quote
const FONT = 'Arial';

const PAGE = { width: 11906, height: 16838 };
const MARGIN = 1020;
const W = PAGE.width - 2 * MARGIN; // 9866 twips

const VAT_RATE = 0.075;
const MONEY = '\\# "#,##0.00"';
// Third section empty: rows with no qty/price show blank instead of 0.00.
const MONEY_BLANK_ZERO = '\\# "#,##0.00;-#,##0.00;\'\'"';

// ---------- small helpers ----------
const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NO_BORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };
const GRID = (c = LINE) => {
  const b = { style: BorderStyle.SINGLE, size: 4, color: c };
  return { top: b, bottom: b, left: b, right: b, insideHorizontal: b, insideVertical: b };
};

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size ?? 20, bold: o.bold, italics: o.italics, color: o.color ?? INK, characterSpacing: o.spacing });
// A value cell: real text in the sample, grey [placeholder] in the template.
const val = (sample, holder, o = {}) => (sample != null ? run(sample, o) : run(holder, { ...o, color: HOLDER }));
const field = (instr, cached, o = {}) => run(`{{F|${instr}|${cached}}}`, o);
const p = (children, o = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [run(children, o)],
  alignment: o.align, keepNext: o.keepNext, keepLines: true,
  spacing: { before: o.before ?? 0, after: o.after ?? 0, line: o.line ?? 260 },
  numbering: o.numbering, tabStops: o.tabStops, border: o.border, indent: o.indent,
});
const cell = (children, o = {}) => new TableCell({
  children: children.length ? children : [p('')],
  width: { size: o.w, type: WidthType.DXA }, columnSpan: o.span,
  shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
  verticalAlign: o.v ?? VerticalAlign.TOP, borders: o.borders,
  margins: { top: o.pt ?? 70, bottom: o.pb ?? 70, left: o.px ?? 110, right: o.px ?? 110 },
});
const table = (rows, widths, o = {}) => new Table({
  rows, columnWidths: widths, width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  layout: TableLayoutType.FIXED, borders: o.borders ?? NO_BORDERS, alignment: o.align,
});
const headCell = (t, w, o = {}) => cell([p([...(o.marker ? [run(o.marker)] : []), run(t, { size: o.size ?? 18, bold: true, color: 'FFFFFF', spacing: o.size ? 0 : 10 })], { align: o.align, keepNext: o.keepNext })], { w, fill: NIGHT, v: VerticalAlign.CENTER, pt: 90, pb: 90, ...o });
const fmt = (n) => (n === '' ? '' : n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

// ---------- document ----------
function build(q) {
  const S = q.sample; // null for the blank template

  // Top: logo + office on the left, QUOTATION + meta on the right.
  const metaRow = (label, value, holder, o = {}) => new TableRow({ children: [
    cell([p([run(label, { color: MUTED, size: 19 })], { align: AlignmentType.RIGHT })], { w: 1700, pt: 25, pb: 25 }),
    cell([p([o.bookmark ? new Bookmark({ id: o.bookmark, children: [val(value, holder, { bold: true, size: 19 })] }) : val(value, holder, { bold: true, size: 19 })], { align: AlignmentType.RIGHT })], { w: 2500, pt: 25, pb: 25 }),
  ] });
  const small = { size: 17, color: MUTED };
  const top = table([new TableRow({ children: [
    cell([p([new ImageRun({ type: 'png', data: LOGO, transformation: { width: 84, height: 96 } })])], { w: 1500, px: 0 }),
    cell([
      p([run(COMPANY.legalName, { bold: true, size: 21 })], { after: 40 }),
      ...COMPANY.address.map((l) => p([run(l, small)])),
      p([run('Tel: ', small), run(COMPANY.phones, { size: 17 })]),
      p([run('Email: ', small), run(COMPANY.email, { size: 17 })]),
      p([run(COMPANY.website, { size: 17, color: EMERALD, bold: true })]),
    ], { w: W - 4200 - 1500, px: 0, v: VerticalAlign.CENTER }),
    cell([
      p([run('QUOTATION', { size: 44, bold: true, color: NIGHT, spacing: 60 })], { align: AlignmentType.RIGHT, after: 80 }),
      table([
        metaRow('Quote no.', S?.quoteNo, 'VTI/Q/YYYY/NNNN', { bookmark: 'QuoteNo' }),
        metaRow('Currency', S?.currency, '[NGN (₦) / USD ($)]'),
        metaRow('Date issued', S?.date, '[Date]'),
        metaRow('Valid until', S?.validUntil, '[Date]'),
      ], [1700, 2500], { align: AlignmentType.RIGHT }),
    ], { w: 4200, px: 0 }),
  ] })], [1500, W - 4200 - 1500, 4200]);

  const rule = p('', { after: 140, border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: GOLD, space: 1 } } });

  // Customer ref + tender table.
  const cref = p([run('CUSTOMER REF: ', { bold: true }), val(S?.customerRef, '[Client’s RFQ / PO / tender no.]'), run('   ·   '), val(S?.buyer, '[Client name]')], { after: 70 });
  // Wide enough that no heading breaks mid-word (e.g. "SUBMISSION" stays whole).
  const tw = [1900, 2966, 1500, 1400, 2100];
  const label = (t) => p([run(t, { size: 15, bold: true, color: MUTED, spacing: 10 })], { after: 30 });
  const tender = table([
    new TableRow({ tableHeader: true, children: ['QUOTE TITLE', 'ATTENTION', 'SUBMISSION DATE', 'MODE OF SUBMISSION', 'SUBMISSION ADDRESS'].map((t, i) => headCell(t, tw[i], { size: 16, pt: 70, pb: 70 })) }),
    new TableRow({ height: { value: 1000, rule: HeightRule.ATLEAST }, children: [
      cell([p([val(S?.title, '[Quote title]', { bold: true })])], { w: tw[0] }),
      cell([
        p([run('THE CLIENT: ', { bold: true }), val(S?.buyer, '[Client name]')], { after: 80 }),
        ...(S ? S.attention : ['[Attn: name / position]', '[Address, City, State]', '[Email]  ·  [Phone]']).map((l) => p([val(S ? l : null, l)])),
      ], { w: tw[1] }),
      cell([p([val(S?.submissionDate, '[Date]')])], { w: tw[2] }),
      cell([p([val(S?.mode, '[Email / Portal / Hand]')])], { w: tw[3] }),
      cell([p([val(S?.submissionAddress, '[Email or address]')])], { w: tw[4] }),
    ] }),
    new TableRow({ children: [
      cell([label('DOC NO.'), p([val(S?.docNo, '[Doc no.]', { bold: true, size: 17 })])], { w: tw[0], fill: TINT }),
      cell([label('PREPARED BY'), p([val(S?.preparedBy, '[Name]', { bold: true })])], { w: tw[1], fill: TINT }),
      cell([label('APPROVED FOR SUBMISSION BY'), p([val(S?.approvedBy, '[Name]', { bold: true })])], { w: tw[2] + tw[3] + tw[4], span: 3, fill: TINT }),
    ] }),
  ], tw, { borders: GRID() });

  const offer = p([run('Kindly see our offer below.', { bold: true })], { before: 140, after: 100 });

  // Items. Columns: A S/N · B Description · C UOM · D Qty · E Unit price · F Amount.
  // UOM and QTY just wide enough that "UOM", "QTY" and "Unit" never break mid-word; the money
  // columns hold amounts up to 999,999,999.00 on one line.
  const iw = [500, 4416, 700, 600, 1700, 1950];
  const items = S ? S.items : Array.from({ length: 10 }, () => null);
  const itemRow = (it, i, all) => {
    const last = i === all.length - 1;
    const amount = it ? it.qty * it.price : '';
    const right = AlignmentType.RIGHT;
    const pad = { pt: 50, pb: 50 };
    return new TableRow({ cantSplit: true, children: [
      cell([p([], { numbering: { reference: 'sn', level: 0 }, align: AlignmentType.CENTER })], { w: iw[0], px: 60, ...pad }),
      cell([p([it ? run(it.desc) : run('[Item: brand, model, specification]', { color: HOLDER })])], { w: iw[1], ...pad }),
      cell([p([it ? run(it.uom) : run('', {})])], { w: iw[2], ...pad }),
      cell([p([it ? run(String(it.qty)) : run('')], { align: right })], { w: iw[3], ...pad }),
      cell([p([it ? run(fmt(it.price)) : run('')], { align: right })], { w: iw[4], ...pad }),
      cell([p([field(`=PRODUCT(LEFT) ${MONEY_BLANK_ZERO}`, it ? fmt(amount) : ''), ...(last ? [run('{{BME|Items}}')] : [])], { align: right })], { w: iw[5], ...pad }),
    ] });
  };
  const itemsTable = table([
    new TableRow({ tableHeader: true, cantSplit: true, children: [
      headCell('S/N', iw[0], { px: 60, align: AlignmentType.CENTER, marker: '{{BMS|Items}}', size: 17 }), headCell('DESCRIPTION', iw[1], { size: 17 }), headCell('UOM', iw[2], { size: 17 }),
      headCell('QTY', iw[3], { align: AlignmentType.RIGHT, size: 17 }), headCell('UNIT PRICE', iw[4], { align: AlignmentType.RIGHT, size: 17 }), headCell('AMOUNT', iw[5], { align: AlignmentType.RIGHT, size: 17 }),
    ] }),
    ...items.map(itemRow),
  ], iw, { borders: { ...GRID(), left: NONE, right: NONE, insideVertical: NONE } });

  // Lower block: amount in words + terms (left), totals (right). Kept on one page with the sign-off.
  const sub = S ? S.items.reduce((a, it) => a + it.qty * it.price, 0) : 0;
  const del = S ? S.delivery : 0;
  const vat = (sub + del) * VAT_RATE;
  const total = sub + del + vat;
  const K = { keepNext: true };
  const termsRows = [
    ['Lead time', S?.leadTime, '[e.g. 2–3 weeks from confirmed order]'],
    ['Validity', S?.validity, '[30 days]'],
    ['Payment terms', S?.payment, '[Payment terms]'],
    ['Delivery location', S?.deliveryLocation, '[Office / site address]'],
    ['Setup', S?.setup, '[e.g. Unboxing, imaging and handover included]'],
    ['Warranty', S?.warranty, '[Warranty terms]'],
    ['Support', S?.support, '[After-sales support, if any]'],
  ];
  // One block, so it never splits: left column (merged down) holds the amount in words and the
  // commercial terms; right holds the totals, then the sign-off. It must be a top-level table:
  // Word cannot resolve "Items F:F" from a formula inside a nested table.
  // Totals live in column D: D1 subtotal · D2 delivery (typed) · D3 VAT · D4 total.
  const lw = 5566, gap = 250, rw = W - lw - gap;
  const tl = 1800, tv = rw - tl;
  const line = { style: BorderStyle.SINGLE, size: 4, color: LINE };
  const box = { top: line, bottom: line, left: line, right: line };
  const words = table([new TableRow({ children: [cell([
    p([run('Amount in words', { size: 16, color: MUTED })], { ...K, after: 30 }),
    p([val(S?.words, '[Type the total in words, e.g. … Naira Only]', { bold: true })], K),
  ], { w: lw, pt: 80, pb: 80 })] })], [lw], { borders: GRID() });
  const tk = 1650;
  const terms = table([
    new TableRow({ cantSplit: true, children: [headCell('COMMERCIAL TERMS', lw, { span: 2, pt: 60, pb: 60, keepNext: true })] }),
    ...termsRows.map(([k, v, h]) => new TableRow({ cantSplit: true, children: [
      cell([p([run(k, { color: MUTED, size: 18 })], K)], { w: tk, pt: 35, pb: 35 }),
      cell([p([val(v, h ?? '', { size: 18 })], K)], { w: lw - tk, pt: 35, pb: 35 }),
    ] })),
  ], [tk, lw - tk], { borders: { ...NO_BORDERS, insideHorizontal: line, bottom: line } });
  const totRow = (labelText, valueRun, o = {}) => new TableRow({ cantSplit: true, children: [
    ...(o.first ? [
      new TableCell({ rowSpan: 5, width: { size: lw, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 0, right: 0 }, children: [words, p('', { ...K, after: 100 }), terms] }),
      new TableCell({ rowSpan: 5, width: { size: gap, type: WidthType.DXA }, children: [p('', K)] }),
    ] : []),
    cell([p([run(labelText, { bold: o.grand, color: o.grand ? 'FFFFFF' : INK, size: o.grand ? 22 : 20 })], K)], { w: tl, fill: o.grand ? EMERALD : undefined, v: VerticalAlign.CENTER, pt: 70, pb: 70, borders: { ...box, right: NONE } }),
    cell([p([valueRun].flat(), { ...K, align: AlignmentType.RIGHT })], { w: tv, fill: o.grand ? EMERALD : undefined, v: VerticalAlign.CENTER, pt: 70, pb: 70, borders: { ...box, left: NONE } }),
  ] });
  // Under the totals: the sign-off. The signature floats over the signature line the way ink
  // does, so it can be large (5.5 cm, the line's width) without pushing the layout down as much.
  const SIG_W_CM = 5.5;
  const SIG_H_CM = SIG_W_CM * 333 / 507;
  const EMU_CM = 360000;
  const signature = SIGNATURE && new ImageRun({
    type: 'png', data: SIGNATURE,
    transformation: { width: Math.round(SIG_W_CM * 37.8), height: Math.round(SIG_H_CM * 37.8) },
    floating: {
      horizontalPosition: { relative: HorizontalPositionRelativeFrom.COLUMN, offset: 0 },
      verticalPosition: { relative: VerticalPositionRelativeFrom.PARAGRAPH, offset: Math.round(0.45 * EMU_CM) },
      wrap: { type: TextWrappingType.NONE }, allowOverlap: true, layoutInCell: true,
    },
  });
  const signRow = new TableRow({ cantSplit: true, children: [cell([
    p([run('All amounts in the quote currency shown above.', { size: 16, color: MUTED })], { ...K, after: 160, align: AlignmentType.RIGHT }),
    p([run('Yours faithfully,'), ...(signature ? [signature] : [])], K),
    // Space for the signature; the line sits about 85% of the way down it.
    p('', { ...K, after: Math.round(SIG_H_CM * 0.85 * 567) }),
    p('', { ...K, border: { top: { style: BorderStyle.SINGLE, size: 6, color: INK, space: 4 } }, indent: { right: rw - Math.round(SIG_W_CM * 567) } }),
    p([run(COMPANY.signName, { bold: true })], K),
    p([run(COMPANY.signRole)], K),
    p([run(`For: ${COMPANY.legalName}`, { size: 17 })], K),
  ], { w: rw, span: 2, px: 0, pt: 60, pb: 0 })] });
  const totals = table([
    totRow('Subtotal', [run('{{KEEP}}'), field(`=SUM(Items F:F) ${MONEY}`, fmt(sub), { bold: true })], { first: true }),
    totRow('Delivery & setup', S ? run(fmt(del), { bold: true }) : run('0.00', { bold: true, color: HOLDER })),
    totRow('VAT (7.5%)', field(`=(D1+D2)*${VAT_RATE} ${MONEY}`, fmt(vat), { bold: true })),
    totRow('TOTAL', field(`=D1+D2+D3 ${MONEY}`, fmt(total), { bold: true, color: 'FFFFFF', size: 24 }), { grand: true }),
    signRow,
  ], [lw, gap, tl, tv]);

  const footer = new Footer({ children: [new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: W }],
    border: { top: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 6 } },
    children: [
      new TextRun({ text: `${COMPANY.legalName}  ·  RC ${COMPANY.rc}  ·  D-U-N-S ${COMPANY.duns}  ·  ${COMPANY.website}`, font: FONT, size: 15, color: MUTED }),
      new TextRun({ children: ['\tPage ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], font: FONT, size: 15, color: MUTED }),
    ],
  })] });
  // Page 2+ header: small logo and the quote number (REF to the bookmark, so it is typed once).
  const laterHeader = new Header({ children: [new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: W }],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 6 } },
    children: [
      new ImageRun({ type: 'png', data: LOGO, transformation: { width: 35, height: 40 } }),
      new TextRun({ text: '\tQuotation ', font: FONT, size: 16, color: MUTED }),
      field('REF QuoteNo', S?.quoteNo ?? 'VTI/Q/YYYY/NNNN', { size: 16, color: MUTED, bold: true }),
    ],
  })] });

  return new Document({
    creator: COMPANY.legalName,
    title: 'Veridian Quotation',
    styles: { default: { document: { run: { font: FONT, size: 20, color: INK } } } },
    numbering: { config: [{ reference: 'sn', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1', alignment: AlignmentType.CENTER, style: { paragraph: { indent: { left: 0, hanging: 0 } } } }] }] },
    sections: [{
      properties: { titlePage: true, page: { size: PAGE, margin: { top: 720, bottom: 800, left: MARGIN, right: MARGIN, header: 400, footer: 400 } } },
      headers: { first: new Header({ children: [new Paragraph('')] }), default: laterHeader },
      footers: { first: footer, default: footer },
      children: [top, rule, cref, tender, offer, itemsTable, p('', { after: 100, keepNext: true }), totals,
        // Word needs a paragraph after a final table; keep it tiny so it never spills onto a blank page.
        new Paragraph({ spacing: { before: 0, after: 0, line: 20, lineRule: LineRuleType.EXACT }, children: [new TextRun({ text: '', size: 2 })] })],
    }],
  });
}

// Turn {{F|instr|cached}} runs into Word fields, and the {{BMS}}/{{BME}} runs into a table bookmark.
async function postProcess(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  for (const name of Object.keys(zip.files).filter((n) => /^word\/(document|header\d*|footer\d*)\.xml$/.test(n))) {
    let xml = await zip.file(name).async('string');
    xml = xml.replace(/<w:r>(<w:rPr>(?:(?!<\/w:rPr>).)*<\/w:rPr>)?<w:t(?: [^>]*)?>\{\{F\|(.*?)\|(.*?)\}\}<\/w:t><\/w:r>/g, (_, rPr = '', instr, cached) =>
      `<w:r>${rPr}<w:fldChar w:fldCharType="begin"/></w:r><w:r>${rPr}<w:instrText xml:space="preserve"> ${instr} </w:instrText></w:r>`
      + `<w:r>${rPr}<w:fldChar w:fldCharType="separate"/></w:r><w:r>${rPr}<w:t xml:space="preserve">${cached}</w:t></w:r><w:r>${rPr}<w:fldChar w:fldCharType="end"/></w:r>`);
    // Table bookmark the way Word writes one: start inside the first cell, end just before </w:tbl>.
    xml = xml.replace(/<w:r>(?:<w:rPr>(?:(?!<\/w:rPr>).)*<\/w:rPr>)?<w:t(?: [^>]*)?>\{\{BMS\|(\w+)\}\}<\/w:t><\/w:r>/g, (_, n) => `<w:bookmarkStart w:id="900" w:name="${n}"/>`);
    xml = xml.replace(/<w:r>(?:<w:rPr>(?:(?!<\/w:rPr>).)*<\/w:rPr>)?<w:t(?: [^>]*)?>\{\{BME\|\w+\}\}<\/w:t><\/w:r>((?:(?!<\/w:tbl>).)*)<\/w:tbl>/g, (_, rest) => `${rest}<w:bookmarkEnd w:id="900"/></w:tbl>`);
    // Every paragraph of the bottom block (the last table, nested cells included) keeps with the
    // next, so Word moves the whole block to the next page instead of splitting it.
    const keep = xml.indexOf('{{KEEP}}');
    if (keep !== -1) {
      const start = xml.lastIndexOf('<w:tbl>', keep);
      const end = xml.lastIndexOf('</w:tbl>') + '</w:tbl>'.length;
      const block = xml.slice(start, end)
        .replace(/<w:r>(?:<w:rPr>(?:(?!<\/w:rPr>).)*<\/w:rPr>)?<w:t(?: [^>]*)?>\{\{KEEP\}\}<\/w:t><\/w:r>/, '')
        .replace(/<w:pPr>((?:(?!<\/w:pPr>).)*)<\/w:pPr>/g, (m, inner) => (inner.includes('<w:keepNext/>') ? m : `<w:pPr><w:keepNext/>${inner}</w:pPr>`))
        .replace(/<w:p>(?!<w:pPr>)/g, '<w:p><w:pPr><w:keepNext/></w:pPr>')
        // The hidden cells under a vertical merge are written as <w:p/>.
        .replace(/<w:p\/>/g, '<w:p><w:pPr><w:keepNext/></w:pPr></w:p>')
        // A cell ending in a nested table gets an empty paragraph added by Word on open, without
        // keepNext; that one paragraph is enough to let the block split. Write it ourselves.
        .replace(/<\/w:tbl><\/w:tc>/g, '</w:tbl><w:p><w:pPr><w:keepNext/><w:spacing w:before="0" w:after="0" w:line="20" w:lineRule="exact"/></w:pPr></w:p></w:tc>');
      xml = xml.slice(0, start) + block + xml.slice(end);
    }
    if (/\{\{(F|BM|KEEP)/.test(xml)) throw new Error(`Unconverted marker left in ${name}`);
    zip.file(name, xml);
  }
  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

// Sample data only: invented items and prices to show the layout. Never send the sample to a client.
const SAMPLE_ITEMS = [
  { desc: 'Business laptop, 14", Core i5, 16 GB RAM, 512 GB SSD, Windows 11 Pro', uom: 'Unit', qty: 40, price: 850000 },
  { desc: 'Developer laptop, 15.6", Core i7, 32 GB RAM, 1 TB SSD', uom: 'Unit', qty: 10, price: 1650000 },
  { desc: 'Monitor, 24", Full HD, IPS, HDMI + DisplayPort', uom: 'Unit', qty: 50, price: 165000 },
  { desc: 'Network switch, 24-port Gigabit, managed, PoE+', uom: 'Unit', qty: 2, price: 480000 },
  { desc: 'Workstation setup: imaging, accounts, asset tagging and handover', uom: 'Unit', qty: 50, price: 12000 },
];
function sample(n) {
  const items = Array.from({ length: n }, (_, i) => SAMPLE_ITEMS[i % SAMPLE_ITEMS.length]);
  return {
    quoteNo: 'VTI/Q/2026/0001', currency: 'NGN (₦)', date: '17 November 2026', validUntil: '17 December 2026',
    customerRef: 'SCL/RFQ/2026/042', buyer: 'Sample Client Limited', title: 'Supply and Setup of Staff Laptops and Workstations',
    attention: ['Attn: Head of Procurement', 'Plot 00, Sample Road, Ikeja, Lagos', 'bids@sampleclient.ng', '+234 800 000 0000'],
    submissionDate: '17 November 2026', mode: 'Email', submissionAddress: 'bids@sampleclient.ng',
    docNo: 'VTI/DOC/2026/0001', preparedBy: COMPANY.signName, approvedBy: COMPANY.signName,
    items, delivery: 250000,
    words: n === 5 ? 'Sixty-Five Million, One Hundred and Two Thousand Naira Only' : `[Sample with ${n} items: amount in words not filled]`,
    leadTime: '[Sample] 2–3 weeks from confirmed order', validity: '30 days (until 17 December 2026)', payment: '[Sample] 70% advance, 30% on delivery',
    deliveryLocation: 'Sample Client head office, Ikeja, Lagos', setup: '[Sample] Imaging, accounts and asset tagging included',
    warranty: '[Sample] 12 months', support: '[Sample] 30 days of on-site support',
  };
}

async function write(file, q) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, await postProcess(await Packer.toBuffer(build(q))));
  console.log('Wrote', file);
}

(async () => {
  const [n, out] = process.argv.slice(2);
  if (n === 'template') return write(path.resolve(out), { sample: null });
  if (n) return write(path.resolve(out), { sample: sample(Number(n)) });
  await write(path.join(ROOT, 'documents/templates/Veridian-Quotation-Template.docx'), { sample: null });
  await write(path.join(ROOT, 'documents/templates/Veridian-Quotation-Sample.docx'), { sample: sample(5) });
})().catch((e) => { console.error(e); process.exit(1); });
