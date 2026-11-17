# Veridian quotation

`npm install`, then `npm run build` (in this folder) writes two Word files to `documents/templates/`:

- `Veridian-Quotation-Template.docx`: blank, 10 item rows, grey `[placeholders]` to type over.
- `Veridian-Quotation-Sample.docx`: filled with invented sample data, to show the layout. Never send it to a client.

## Making a quote

1. Open the template and **Save As** into `documents/quotes/`, e.g. `VTI-Q-2026-0001 - Client.docx`.
2. Type over the grey placeholders. Delete the item rows you do not need.
3. To add an item, copy an existing item row and paste it (Tab in the last cell adds a row without the formula).
4. Press **Ctrl+A, then F9** to recalculate amounts, subtotal, VAT (7.5%) and total.
5. Type the amount in words and check it against the total.
6. Save as PDF to send.

Quote numbers: `VTI/Q/YYYY/NNNN`. About 5 items fit on one page; more items move the totals and sign-off, whole, to page 2.

## Changing the layout

Change `build-quotation.js` and rebuild; never edit only the template, or the next build overwrites it. Close the files in Word first. Company facts at the top of the script mirror `src/config/company.ts`.

## Private files

This repository is public. The signature (`private/signature.png`), the generated templates and every real quote are gitignored and stay on the owner's PC. Without the signature file the sign-off is left blank for a pen.
