  function generarReporteFecha() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      let ventas = JSON.parse(localStorage.getItem('ventas')) || [];

      doc.text("Reporte de Ventas por Fecha", 14, 10);

      const columns = ["ID Venta", "Producto", "Cantidad", "Precio Unit.", "Subtotal", "Fecha", "Usuario"];
      const rows = ventas.map(venta => [
          venta.id_venta,
          venta.nombre_producto,
          venta.cantidad,
          `S/. ${venta.precio}`,
          `S/. ${venta.total}`,
          venta.fecha,
          venta.nombre_usuario
      ]);

      doc.autoTable({ head: [columns], body: rows, startY: 20 });
      doc.save('reporte_ventas_fecha.pdf');
  }  