# Veridian letterhead

`npm install`, then `npm run build` (in this folder) writes two Word files to `documents/templates/`:

- `Veridian-Letterhead.docx`: the letterhead with a blank page, for any document.
- `Veridian-Letter-Template.docx`: laid out as a letter. Our ref, date, recipient, "Dear …", subject, body, and "Yours faithfully" signed by the MD.

The full header is on page 1; longer documents get a slim header (logo and name) from page 2. The footer, with RC, D-U-N-S and the page number, is on every page.

## Writing a letter

1. Open `Veridian-Letter-Template.docx` and **Save As** a new file first.
2. Click a grey `[field]` and type: the field is replaced, in normal black text.
3. Reference numbers: `VTI/L/YYYY/NNNN`.
4. Save as PDF to send.

## Changing the layout

Change `build-letterhead.js` and rebuild (close the files in Word first). Company facts at the top of the script mirror `src/config/company.ts` and the quotation. The signature is shared with the quotation (`documents/quotation/private/signature.png`, gitignored); without it the sign-off is left blank for a pen.
