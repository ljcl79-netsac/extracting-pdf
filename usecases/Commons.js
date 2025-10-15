

async function parsePageNumbers(pages, totalPages) {
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

module.exports = { parsePageNumbers };