function generarReporteFecha() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let ventas = JSON.parse(localStorage.getItem('ventas')) || [];

    if (ventas.length === 0) {
        alert("No hay ventas para generar el reporte.");
        return;
    }

    doc.setFontSize(14);
    doc.text("Reporte de Ventas por Fecha", 70, 10);

    const columns = ["ID Venta", "ID Producto", "Cantidad", "Precio Unit.", "Total", "Fecha", "ID Usuario"];
    const rows = ventas.map(venta => [
        venta.id_venta,
        venta.id_producto,
        venta.cantidad,
        `S/. ${venta.precio}`,
        `S/. ${venta.total}`,
        venta.fecha,
        venta.id_usuario
    ]);

    doc.autoTable({ head: [columns], body: rows, startY: 20 });
    doc.save('reporte_ventas_fecha.pdf');
}

function generarReporte() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tablaBody = document.getElementById('tablaVentasBody');
    const rows = [];

    for (let row of tablaBody.rows) {
        const datos = [];
        for (let cell of row.cells) {
            datos.push(cell.innerText);
        }
        rows.push(datos);
    }

    const columns = ["ID Venta", "ID Producto", "Cantidad", "Precio", "Total", "Fecha", "ID Usuario"];

    doc.setFontSize(14);
    doc.text("Reporte General de Ventas", 70, 10);
    doc.autoTable({ head: [columns], body: rows, startY: 20 });
    doc.save("reporte_general_ventas.pdf");
}

function generarReporteGanancia() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const tablaBody = document.getElementById('tablaVentasBody');
    let gananciaTotal = 0;

    for (let row of tablaBody.rows) {
        const totalCell = row.cells[4]; // "Total" está en la columna 5 (índice 4)
        if (totalCell) {
            const texto = totalCell.innerText.replace('S/.', '').trim();
            const valor = parseFloat(texto);
            if (!isNaN(valor)) gananciaTotal += valor;
        }
    }

    doc.setFontSize(16);
    doc.text("Reporte de Ganancia Total", 60, 30);
    doc.setFontSize(12);
    doc.text(`Ganancia Total: S/. ${gananciaTotal.toFixed(2)}`, 70, 50);

    doc.save("reporte_ganancia.pdf");
}
