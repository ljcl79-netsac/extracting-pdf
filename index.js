const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

class PDFMagician {
    /**
     * Extrae páginas específicas de un PDF
     * @param {string} inputPath - Ruta del PDF original
     * @param {string} outputPath - Ruta del PDF resultante
     * @param {Array} pages - Array de páginas o rangos: [2, 5, '10-13', 20]
     */
    async extractPages(inputPath, outputPath, pages) {
        const pdfBytes = await fs.readFile(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const newPdf = await PDFDocument.create();

        // Convertir páginas a índices (0-based)
        const pageIndices = this.parsePageNumbers(pages, pdfDoc.getPageCount());

        for (const pageIndex of pageIndices) {
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
            newPdf.addPage(copiedPage);
        }

        const newPdfBytes = await newPdf.save();
        await fs.writeFile(outputPath, newPdfBytes);
        console.log(`✅ PDF creado: ${pageIndices.length} páginas extraídas`);
    }

    /**
     * Mezcla múltiples PDFs insertando uno dentro de otro
     * @param {string} basePdfPath - PDF base
     * @param {Array} insertions - [{pdfPath: 'file.pdf', afterPage: 37}]
     * @param {string} outputPath - PDF resultante
     */
    async mergePDFs(basePdfPath, insertions, outputPath) {
        const basePdfBytes = await fs.readFile(basePdfPath);
        const basePdf = await PDFDocument.load(basePdfBytes);
        const newPdf = await PDFDocument.create();

        let currentPage = 0;
        const totalPages = basePdf.getPageCount();

        // Ordenar inserciones por página
        insertions.sort((a, b) => a.afterPage - b.afterPage);

        for (const insertion of insertions) {
            // Copiar páginas hasta el punto de inserción
            while (currentPage < insertion.afterPage && currentPage < totalPages) {
                const [page] = await newPdf.copyPages(basePdf, [currentPage]);
                newPdf.addPage(page);
                currentPage++;
            }

            // Insertar el PDF externo
            const insertPdfBytes = await fs.readFile(insertion.pdfPath);
            const insertPdf = await PDFDocument.load(insertPdfBytes);
            const insertPages = await newPdf.copyPages(
                insertPdf,
                Array.from({ length: insertPdf.getPageCount() }, (_, i) => i)
            );
            insertPages.forEach(page => newPdf.addPage(page));
            console.log(`📄 Insertadas ${insertPages.length} páginas después de la página ${insertion.afterPage}`);
        }

        // Copiar páginas restantes
        while (currentPage < totalPages) {
            const [page] = await newPdf.copyPages(basePdf, [currentPage]);
            newPdf.addPage(page);
            currentPage++;
        }

        const newPdfBytes = await newPdf.save();
        await fs.writeFile(outputPath, newPdfBytes);
        console.log(`✅ PDF mezclado creado: ${newPdf.getPageCount()} páginas totales`);
    }

    /**
     * Parsea números de página: [2, 5, '10-13'] -> [1, 4, 9, 10, 11, 12]
     */
    parsePageNumbers(pages, totalPages) {
        const indices = new Set();

        for (const page of pages) {
            if (typeof page === 'string' && page.includes('-')) {
                const [start, end] = page.split('-').map(Number);
                for (let i = start; i <= end; i++) {
                    if (i > 0 && i <= totalPages) {
                        indices.add(i - 1); // Convertir a 0-based
                    }
                }
            } else {
                const pageNum = Number(page);
                if (pageNum > 0 && pageNum <= totalPages) {
                    indices.add(pageNum - 1);
                }
            }
        }

        return Array.from(indices).sort((a, b) => a - b);
    }
}

// 🎯 EJEMPLOS DE USO
async function ejemplos() {
    const magician = new PDFMagician();

    // Ejemplo 1: Extraer páginas específicas
    /*
    await magician.extractPages(
        '1752815959070.pdf',
        'extracto.pdf',
        [2, 5, '10-13', 20] // Páginas 2, 5, 10-13, 20
    );

    // Ejemplo 2: Mezclar PDFs
    await magician.mergePDFs(
        'documento-40pag.pdf',
        [
            { pdfPath: 'insertar.pdf', afterPage: 37 }
        ],
        'documento-mezclado.pdf'
    );
    */
    // Ejemplo 3: Múltiples inserciones
    await magician.mergePDFs(
        '1752815959070.pdf',
        [
            { pdfPath: 'extracto.pdf', afterPage: 2 }
        ],
        'resultado.pdf'
    );

}

ejemplos();

module.exports = PDFMagician;