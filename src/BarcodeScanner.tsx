import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

// --- BURAYA KENDİ APPS SCRIPT LİNKİNİ YAPIŞTIR ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/library/d/16h0HKPn0aM-kG_EgX0lqnm4IOnf5oyBK6MJSsZeHmA5pZ9eaTAKRIoiz/4"; 

const BarcodeScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Tarayıcı ayarları
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true
      },
      false
    );

    // Başarılı okuma fonksiyonu
    const onScanSuccess = (decodedText: string) => {
      // Eğer şu an zaten işlem yapılıyorsa tekrar okuma
      if (isProcessing) return;

      scanner.clear(); // Kamerayı durdur
      setScanResult(decodedText);
      handleStockUpdate(decodedText);
    };

    // Hata fonksiyonu (Sessiz kalabilir)
    const onScanFailure = (error: any) => {
      // console.warn(error);
    };

    // Tarayıcıyı başlat
    scanner.render(onScanSuccess, onScanFailure);

    // Temizlik (Component kapanırsa kamerayı kapat)
    return () => {
      scanner.clear().catch(error => console.error("Kamera kapatılamadı", error));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sadece sayfa ilk açıldığında çalışır

  // --- STOK GÜNCELLEME İŞLEMİ ---
  const handleStockUpdate = (barcode: string) => {
    setIsProcessing(true);
    setStatusMessage("⏳ Veritabanında aranıyor ve stok düşülüyor...");

    // Google Apps Script'e istek at
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Google güvenlik politikası gereği
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "scanBarcode",
        barcode: barcode
      })
    })
    .then(() => {
      // no-cors modunda cevap okunamaz ama işlem başarılı varsayılır
      setStatusMessage(`✅ BAŞARILI! Barkod: ${barcode} için stok düşüldü.`);
      
      // 3 saniye sonra ekranı yenile (stoğu güncel görmek için)
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    })
    .catch(err => {
      console.error(err);
      setStatusMessage("❌ HATA: Sunucuyla iletişim kurulamadı.");
      setIsProcessing(false);
    });
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      
      {/* Sonuç Alanı */}
      {scanResult ? (
        <div style={{ 
          padding: '20px', 
          backgroundColor: statusMessage.includes("HATA") ? '#f8d7da' : '#d4edda',
          color: statusMessage.includes("HATA") ? '#721c24' : '#155724',
          borderRadius: '8px',
          marginTop: '10px'
        }}>
          <h3>{statusMessage}</h3>
          <p>Barkod: <strong>{scanResult}</strong></p>
          
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Yeni Tarama Yap
          </button>
        </div>
      ) : (
        // Kamera Alanı
        <div>
          <div id="reader" style={{ width: '100%', minHeight: '300px' }}></div>
          <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
            Kamera açılmıyorsa tarayıcı izinlerini kontrol edin.
          </p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
