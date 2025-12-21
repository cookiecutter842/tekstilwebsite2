// src/Scanner.tsx
import React from 'react';
import { useZxing } from "react-zxing";

interface ScannerProps {
  onScanSuccess: (result: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanSuccess }) => {

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
        // Hata buradaydı, 'as any' ile TypeScript'i ikna ediyoruz
        ref={ref as any}
        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
      />
    </div>
  );
};

export default Scanner;
