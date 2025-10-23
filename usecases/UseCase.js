const Commons = require('../usecases/Commons');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

module.exports = {

    async extractPages(inputPath, pages)
    {
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
        // await fs.writeFile("./public/"+outputPath, newPdfBytes);
        // console.log(`✅ PDF creado: ${pageIndices.length} páginas extraídas`);
        // const filePath = path.join(__dirname+"/../public", outputPath);
        return newPdfBytes;//{"filePath": filePath};
    },

    async mergePages(basePdfPath, insertion, afterPage)
    {
        const existingPdfBytes = await fetch(basePdfPath).then(res => res.arrayBuffer());
        const basePdf = await PDFDocument.load(existingPdfBytes);
        const extraFile = insertion?.buffer;
        const fileAdd = await PDFDocument.load(extraFile);
        const newPdf = await PDFDocument.create();

        let currentPage = 0;
        const totalPages = basePdf.getPageCount();

        while (currentPage < afterPage && currentPage < totalPages) {
            const [page] = await newPdf.copyPages(basePdf, [currentPage]);
            newPdf.addPage(page);
            currentPage++;
        }

        const extraPages = await newPdf.copyPages(
            fileAdd, 
            Array.from({ length: fileAdd.getPageCount() }, (_, i) => i)
        );
        extraPages.forEach(page => newPdf.addPage(page));

        // Copiar páginas restantes
        while (currentPage < totalPages) {
            const [page] = await newPdf.copyPages(basePdf, [currentPage]);
            newPdf.addPage(page);
            currentPage++;
        }

        const newPdfBytes = await newPdf.save();
        return newPdfBytes;
    },

    async removePages(inputPath, pages)
    {
        const existingPdfBytes = await fetch(inputPath).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const newPdf = await PDFDocument.create();
        const totalPages = pdfDoc.getPageCount();
        let currentPage = 0;

        // Convertir páginas a índices (0-based)
        const pageIndices = await Commons.parsePageNumbers(pages, pdfDoc.getPageCount());

        while (currentPage < totalPages)
        {
            // Não é uma página selecionada?
            if(!pageIndices.includes(currentPage))
            {
                const [page] = await newPdf.copyPages(pdfDoc, [currentPage]);
                newPdf.addPage(page);
            }

            currentPage++;
        }

        const newPdfBytes = await newPdf.save();

        return newPdfBytes;
    },
};