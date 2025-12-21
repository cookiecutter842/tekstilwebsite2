import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

// --- APPS SCRIPT LİNKİNİ UNUTMA ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx................/exec"; 

const BarcodeScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Okuyucunun tanıması gereken formatları belirliyoruz
    const formatsToSupport = [
      Html5QrcodeSupportedFormats.EAN_13, // Türkiye'deki standart ürünler (869...)
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.CODE_128, // Kargo/Lojistik barkodları
      Html5QrcodeSupportedFormats.CODE_39,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.QR_CODE,
    ];

    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        // Barkodlar yatay olduğu için kutuyu dikdörtgen yaptık
        qrbox: { width: 250, height: 150 }, 
        rememberLastUsedCamera: true,
        formatsToSupport: formatsToSupport, // Formatları buraya ekledik
        aspectRatio: 1.0, 
      },
      false
    );

    const onScanSuccess = (decodedText: string) => {
      if (isProcessing) return;
      scanner.clear(); 
      setScanResult(decodedText);
      handleStockUpdate(decodedText);
    };

    const onScanFailure = (error: any) => {
      // console.warn(error); 
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(error => console.error("Temizleme hatası", error));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // --- STOK GÜNCELLEME ---
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
      setStatusMessage(`✅ İşlem İletildi! Barkod: ${barcode}`);
      setTimeout(() => window.location.reload(), 3000);
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
          <button onClick={() => window.location.reload()} style={{marginTop:'15px', padding:'10px', cursor:'pointer'}}>Yeni Tara</button>
        </div>
      ) : (
        <div>
          <div id="reader" style={{ width: '100%', minHeight: '300px' }}></div>
          <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
            Kamerayı barkoda yaklaştırıp sabit tutun.<br/>
            (Çizgili ve Kare kodları okur)
          </p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
