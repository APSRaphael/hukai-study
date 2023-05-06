const pdf2docx = require('pdf-to-docx');
const fs = require('fs');

async function convertPdfToDocx(pdfPath, docxPath) {
  try {
    const data = await pdf2docx(pdfPath);
    fs.writeFileSync(docxPath, data);
    console.log('PDF converted to Word successfully');
  } catch (err) {
    console.error(err);
  }
}

convertPdfToDocx('path/to/input.pdf', 'path/to/output.docx');
