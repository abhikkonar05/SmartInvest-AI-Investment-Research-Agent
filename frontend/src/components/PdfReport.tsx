'use client';

import React, { useState } from 'react';
import { FileDown } from 'lucide-react';

interface PdfReportProps {
  elementId: string;
  companyName: string;
}

export function PdfReport({ elementId, companyName }: PdfReportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Dynamic imports to avoid SSR issues
      const html2canvas = (await import('html2canvas-pro')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID #${elementId} not found`);
      }

      // Hide elements not needed in the PDF export (like export button or history tabs)
      const excludeElements = document.querySelectorAll('.no-pdf-export');
      excludeElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });

      // Execute canvas capture
      const canvas = await html2canvas(element, {
        scale: 2, // Super resolution
        useCORS: true,
        backgroundColor: '#090d16',
        logging: false,
      });

      // Restore hidden elements
      excludeElements.forEach((el) => {
        (el as HTMLElement).style.display = '';
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Scale height to match A4 proportions
      const ratio = pdfWidth / imgWidth;
      const finalImgHeight = imgHeight * ratio;

      let heightLeft = finalImgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, finalImgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Add extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - finalImgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, finalImgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      const dateStr = new Date().toISOString().split('T')[0];
      pdf.save(`SmartInvest_Report_${companyName.replace(/\s+/g, '_')}_${dateStr}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="no-pdf-export inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:opacity-75 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
    >
      <FileDown className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
      {isExporting ? 'Generating Report PDF...' : 'Export PDF Report'}
    </button>
  );
}
