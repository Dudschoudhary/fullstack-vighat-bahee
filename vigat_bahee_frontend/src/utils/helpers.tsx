// utils/helpers.ts
import React from 'react';
import type { DataType } from '../types/addNewEntriesInterface.types';

export const detectCurrentBaheeType = (): string | null => {
  const currentPath = window.location.pathname;
  if (currentPath.includes('/vivah')) return 'vivah';
  if (currentPath.includes('/muklawa')) return 'muklawa';
  const currentPageContext = localStorage.getItem('currentBaheeContext');
  return currentPageContext || null;
};

export const generateSampleData = (): DataType[] => {
  const vivahEntries = [
    { cast: "जाट", name: "दूदाराम", fathername: "मोटाराम", address: "नई ऊंदरी, गुड़ामालानी", aavta: 250, uparnet: 250 },
    { cast: "कलबी", name: "मुकेश कुमार", fathername: "शंकराराम", address: "मानपुरा, नई ऊंदरी, गुड़ामालानी", aavta: 200, uparnet: 300 },
    { cast: "ब्राह्मण", name: "रमेश कुमार", fathername: "सुरेश", address: "जयपुर, राजस्थान", aavta: 450, uparnet: 600 },
    { cast: "राजपूत", name: "विकास सिंह", fathername: "गजराज सिंह", address: "बीकानेर, राजस्थान", aavta: 300, uparnet: 500 },
    { cast: "गुर्जर", name: "सुनील कुमार", fathername: "रामकिशन", address: "अलवर, राजस्थान", aavta: 180, uparnet: 350 }
  ];

  const muklawaEntries = [
    { cast: "जाट", name: "सुनीता", fathername: "रामकिशन", address: "हिसार, हरियाणा", aavta: 300, uparnet: 400 },
    { cast: "कलबी", name: "प्रीति", fathername: "बालकिशन", address: "भिवानी, हरियाणा", aavta: 250, uparnet: 350 }
  ];
  
  const sampleData: DataType[] = [];
  
  vivahEntries.forEach((entry, index) => 
    sampleData.push({
      key: `vivah-${index + 1}`,
      sno: (index + 1).toString(),
      ...entry,
      aavta: Number(entry.aavta) || 0,
      uparnet: Number(entry.uparnet) || 0,
      baheeType: 'vivah',
      baheeTypeName: 'विवाह की विगत',
      submittedAt: `2025-08-${String(index + 1).padStart(2, '0')}`
    })
  );

  muklawaEntries.forEach((entry, index) => 
    sampleData.push({
      key: `muklawa-${index + 1}`,
      sno: (index + 21).toString(),
      ...entry,
      aavta: Number(entry.aavta) || 0,
      uparnet: Number(entry.uparnet) || 0,
      baheeType: 'muklawa',
      baheeTypeName: 'मुकलावा की विगत',
      submittedAt: `2025-08-${String(index + 15).padStart(2, '0')}`
    })
  );

  return sampleData;
};

export const highlightSearchText = (text: string, searchText: string): React.ReactNode => {
  if (!searchText.trim() || !text) return text;
  const regex = new RegExp(`(${searchText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) => 
    regex.test(part) 
      ? <span key={index} className="bg-yellow-200 font-medium">{part}</span>
      : part
  );
};

export const calculateTotals = (data: DataType[]) => {
  const totalAavta = data.reduce((sum, record) => sum + (Number(record.aavta) || 0), 0);
  const totalUpar = data.reduce((sum, record) => sum + (Number(record.uparnet) || 0), 0);
  const grandTotal = totalAavta + totalUpar;
  
  return { totalAavta, totalUpar, grandTotal };
};

export const safeToLocaleString = (value: any): string => {
  const num = Number(value) || 0;
  return num.toLocaleString();
};
