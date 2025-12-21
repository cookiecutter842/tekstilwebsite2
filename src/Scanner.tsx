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
    // Canlı kamera okumama sorununu çözen kritik ayarlar:
    constraints: {
      facingMode: "environment",
      width: { min: 1280, ideal: 1920 }, 
      height: { min: 720, ideal: 1080 },
      advanced: [{ focusMode: "continuous" } as any]
    },
  });

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <video 
        ref={ref} 
        style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
      />
      {/* Barkodun tam ortalanması için görsel bir kılavuz (isteğe bağlı) */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid rgba(255,255,255,0.5)',
        width: '70%', height: '30%', pointerEvents: 'none'
      }} />
    </div>
  );
};

export default Scanner;
