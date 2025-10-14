const Commons = require('../usecases/Commons');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

module.exports = {

    async extractPages(inputPath, pages){

        const existingPdfBytes = await fetch(inputPath).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const newPdf = await PDFDocument.create();
        const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();
        outputPath = "Document"+hours+minutes+seconds+".pdf";

        // Convertir páginas a índices (0-based)
        const pageIndices = await Commons.parsePageNumbers(pages, pdfDoc.getPageCount());

        for (const pageIndex of pageIndices) {
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
            newPdf.addPage(copiedPage);
        }

        const newPdfBytes = await newPdf.save();
        await fs.writeFile("./public/"+outputPath, newPdfBytes);
        console.log(`✅ PDF creado: ${pageIndices.length} páginas extraídas`);
        const filePath = path.join(__dirname+"/../public", outputPath);
        return {"filePath": filePath};
    },

};