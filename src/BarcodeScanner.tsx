import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

// Apps Script Linkin (Burayı kontrol etmeyi unutma!)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx................/exec"; 

const BarcodeScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Desteklenen formatlar
    const formatsToSupport = [
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.CODE_128,
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.QR_CODE,
    ];

    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 300, height: 150 }, 
        aspectRatio: 1.0,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        },
        // --- GÜNCELLENMİŞ KAMERA AYARLARI ---
        videoConstraints: {
          // 'exact' yerine string kullanımı daha güvenlidir, hata vermez
          facingMode: "environment", 
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          // focusMode satırını TypeScript kızdığı için kaldırdık. 
          // Modern telefonlar zaten otomatik odaklama yapar.
        },
        formatsToSupport: formatsToSupport,
      },
      false
    );

    const onScanSuccess = (decodedText: string) => {
      if (isProcessing) return;
      
      // Hatalı/kısa okumaları elemek için basit bir filtre
      if (decodedText.length > 3) {
          scanner.clear(); 
          setScanResult(decodedText);
          handleStockUpdate(decodedText);
      }
    };

    const onScanFailure = (error: any) => {
      // Hataları sessizce geç
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(e => console.error("Kamera kapatma hatası", e));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleStockUpdate = (barcode: string) => {
    setIsProcessing(true);
    setStatusMessage("⏳ Veritabanında aranıyor...");

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "scanBarcode", barcode: barcode })
    })
    .then(() => {
      setStatusMessage(`✅ İşlem Başarılı! Barkod: ${barcode}`);
      setTimeout(() => window.location.reload(), 2500);
    })
    .catch(err => {
      console.error(err);
      setStatusMessage("❌ Bağlantı Hatası");
      setIsProcessing(false);
    });
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {scanResult ? (
        <div style={{ padding: '20px', background: '#d4edda', color: '#155724', borderRadius: '8px' }}>
          <h3>{statusMessage}</h3>
          <p>Okunan: <strong>{scanResult}</strong></p>
          <button onClick={() => window.location.reload()} style={{marginTop:'15px', padding:'10px'}}>Yeni Tara</button>
        </div>
      ) : (
        <div>
          <div id="reader" style={{ width: '100%', minHeight: '300px' }}></div>
          <p style={{fontSize: '14px', color: '#333', marginTop: '10px', fontWeight: 'bold'}}>
            İPUÇLARI:
          </p>
          <ul style={{textAlign: 'left', fontSize: '13px', color: '#555', display: 'inline-block'}}>
            <li>📏 Kamerayı barkoda <strong>çok yaklaştırma</strong> (15-20cm uzak tut).</li>
            <li>💡 Işık yeterli olsun.</li>
            <li>📱 Telefonu yan çevirmeyi dene.</li>
          </ul>
        </div>
      )
      }
    </div>
  );
};

export default BarcodeScanner;
