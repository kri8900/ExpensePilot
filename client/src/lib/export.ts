import { Transaction, Category } from "@shared/schema";
import jsPDF from "jspdf";

export const exportToCSV = (transactions: Transaction[], categories: Category[]) => {
  const csvHeader = "Date,Description,Category,Type,Amount\n";
  const csvRows = transactions.map(t => {
    const category = categories.find(c => c.id === t.categoryId);
    return `${new Date(t.date).toISOString().split('T')[0]},${t.description},${category?.name || 'Unknown'},${t.type},${t.amount}`;
  }).join('\n');
  
  const csvContent = csvHeader + csvRows;
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'transactions.csv';
  link.click();
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = (transactions: Transaction[], categories: Category[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Financial Report', 20, 20);
  
  doc.setFontSize(12);
  let yPosition = 40;
  
  doc.text('Date', 20, yPosition);
  doc.text('Description', 60, yPosition);
  doc.text('Category', 120, yPosition);
  doc.text('Amount', 160, yPosition);
  
  yPosition += 10;
  
  transactions.forEach((transaction) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    const category = categories.find(c => c.id === transaction.categoryId);
    const date = new Date(transaction.date).toLocaleDateString();
    const amount = `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount}`;
    
    doc.text(date, 20, yPosition);
    doc.text(transaction.description.substring(0, 20), 60, yPosition);
    doc.text(category?.name || 'Unknown', 120, yPosition);
    doc.text(amount, 160, yPosition);
    
    yPosition += 8;
  });
  
  doc.save('financial-report.pdf');
};
