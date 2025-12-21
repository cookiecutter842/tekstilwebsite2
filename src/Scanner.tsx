// src/Scanner.tsx
import React from 'react';
import { useZxing } from "react-zxing";

interface ScannerProps {
  onScanSuccess: (result: string) => void;
}

// BİLEŞEN BAŞLANGICI
const Scanner: React.FC<ScannerProps> = ({ onScanSuccess }) => {
  
  // Hook mutlaka burada, yani fonksiyonun İÇİNDE çağrılmalıdır:
  const { ref } = useZxing({
    onDecodeResult(result) {
      onScanSuccess(result.getText());
    },
    constraints: {
      video: {
        facingMode: "environment",
        width: { min: 1280, ideal: 1920 },
        height: { min: 720, ideal: 1080 },
        // @ts-ignore
        advanced: [{ focusMode: "continuous" }]
      }
    },
  });

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <video 
        ref={ref} 
        style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
      />
    </div>
  );
};

export default Scanner; // BİLEŞEN BİTİŞİ
