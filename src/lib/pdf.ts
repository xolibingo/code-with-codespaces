import jsPDF from 'jspdf';
import { Invoice, User } from '../types';

export function downloadInvoicePDF(invoice: Invoice, user: User): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background
  doc.setFillColor(234, 88, 12); // brand-600
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('BINGO COURIERS', 20, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Fast, Reliable Cross-Border Delivery', 20, 30);

  // Invoice label on right
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - 20, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoiceNumber, pageWidth - 20, 30, { align: 'right' });

  // Reset color
  doc.setTextColor(0, 0, 0);

  // Invoice details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(user.name, 20, 68);
  doc.text(user.email, 20, 76);
  if (user.phone) doc.text(user.phone, 20, 84);

  // Invoice info on right
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Date:', pageWidth - 80, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(invoice.createdAt).toLocaleDateString(), pageWidth - 20, 60, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Due Date:', pageWidth - 80, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(invoice.dueDate).toLocaleDateString(), pageWidth - 20, 70, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Status:', pageWidth - 80, 80);
  doc.setFont('helvetica', 'normal');
  const statusColors: Record<string, [number, number, number]> = {
    paid: [22, 163, 74],
    unpaid: [234, 88, 12],
    overdue: [220, 38, 38],
  };
  const [r, g, b] = statusColors[invoice.status] || [0, 0, 0];
  doc.setTextColor(r, g, b);
  doc.text(invoice.status.toUpperCase(), pageWidth - 20, 80, { align: 'right' });
  doc.setTextColor(0, 0, 0);

  // Divider
  doc.setDrawColor(234, 88, 12);
  doc.setLineWidth(0.5);
  doc.line(20, 95, pageWidth - 20, 95);

  // Table headers
  let y = 105;
  doc.setFillColor(249, 115, 22); // brand-500
  doc.rect(20, y - 7, pageWidth - 40, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Description', 25, y);
  doc.text('Qty', 120, y, { align: 'center' });
  doc.text('Unit Price', 150, y, { align: 'right' });
  doc.text('Total', pageWidth - 25, y, { align: 'right' });

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  y += 12;
  let subtotal = 0;

  invoice.items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(255, 247, 237); // brand-50
      doc.rect(20, y - 6, pageWidth - 40, 9, 'F');
    }
    doc.text(item.description, 25, y);
    doc.text(item.quantity.toString(), 120, y, { align: 'center' });
    doc.text(`R${item.unitPrice.toFixed(2)}`, 150, y, { align: 'right' });
    doc.text(`R${item.total.toFixed(2)}`, pageWidth - 25, y, { align: 'right' });
    subtotal += item.total;
    y += 10;
  });

  // Totals
  y += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 130, y, { align: 'right' });
  doc.text(`R${subtotal.toFixed(2)}`, pageWidth - 25, y, { align: 'right' });
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setFillColor(234, 88, 12);
  doc.rect(120, y - 6, pageWidth - 140, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL:', 130, y, { align: 'right' });
  doc.text(`R${invoice.amount.toFixed(2)}`, pageWidth - 25, y, { align: 'right' });
  doc.setTextColor(0, 0, 0);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setDrawColor(234, 88, 12);
  doc.line(20, footerY, pageWidth - 20, footerY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for choosing Bingo Couriers', pageWidth / 2, footerY + 8, { align: 'center' });
  doc.text('info@bingocouriers.co.za | +27 000 000 0000 | www.bingocouriers.co.za', pageWidth / 2, footerY + 16, { align: 'center' });

  doc.save(`${invoice.invoiceNumber}.pdf`);
}

export function generateQuotePDF(quote: {
  route: string;
  weight: number;
  base: number;
  clearance: number;
  total: number;
  days: string;
  discount?: number;
  clientName?: string;
}): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(234, 88, 12);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('BINGO COURIERS', 20, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Fast, Reliable Cross-Border Delivery', 20, 30);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', pageWidth - 20, 20, { align: 'right' });

  const quoteNum = `QT-${Date.now().toString().slice(-6)}`;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(quoteNum, pageWidth - 20, 30, { align: 'right' });

  doc.setTextColor(0, 0, 0);

  let y = 60;
  if (quote.clientName) {
    doc.setFont('helvetica', 'bold');
    doc.text('Prepared for:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(quote.clientName, 20, y + 8);
    y += 20;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Quote Date:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString(), 70, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Valid Until:', 20, y);
  doc.setFont('helvetica', 'normal');
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);
  doc.text(validUntil.toLocaleDateString(), 70, y);
  y += 20;

  // Route details
  doc.setFillColor(249, 115, 22);
  doc.rect(20, y - 7, pageWidth - 40, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Shipment Details', 25, y);
  doc.setTextColor(0, 0, 0);
  y += 12;

  const details = [
    ['Route', quote.route],
    ['Weight', `${quote.weight} kg`],
    ['Estimated Transit', quote.days],
  ];

  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 25, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, y);
    y += 9;
  });

  y += 10;

  // Pricing
  doc.setFillColor(249, 115, 22);
  doc.rect(20, y - 7, pageWidth - 40, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Pricing Breakdown', 25, y);
  doc.setTextColor(0, 0, 0);
  y += 12;

  const items: [string, number][] = [['Base Shipping Cost', quote.base]];
  if (quote.clearance > 0) items.push(['Clearance Documentation', quote.clearance]);
  if (quote.discount && quote.discount > 0) items.push([`Discount (${quote.discount}%)`, -(quote.base + quote.clearance) * quote.discount / 100]);

  items.forEach(([label, amount]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label + ':', 25, y);
    const color = amount < 0 ? [22, 163, 74] : [0, 0, 0];
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(`R${Math.abs(amount).toFixed(2)}`, pageWidth - 25, y, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    y += 9;
  });

  y += 5;
  doc.setFillColor(234, 88, 12);
  doc.rect(20, y - 6, pageWidth - 40, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AMOUNT:', 25, y);
  doc.text(`R${quote.total.toFixed(2)}`, pageWidth - 25, y, { align: 'right' });
  doc.setTextColor(0, 0, 0);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 40;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('This quotation is valid for 30 days from the date of issue.', 20, footerY);
  doc.text('Prices are in South African Rand (ZAR) and exclude any applicable taxes.', 20, footerY + 8);

  doc.setDrawColor(234, 88, 12);
  doc.line(20, footerY + 14, pageWidth - 20, footerY + 14);
  doc.text('Thank you for choosing Bingo Couriers', pageWidth / 2, footerY + 22, { align: 'center' });
  doc.text('info@bingocouriers.co.za | +27 000 000 0000 | www.bingocouriers.co.za', pageWidth / 2, footerY + 30, { align: 'center' });

  doc.save(`Bingo-Quote-${quoteNum}.pdf`);
}
