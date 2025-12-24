import React, { useState } from 'react';
import Scanner from './Scanner'; // Yeni oluşturduğumuz yüksek çözünürlüklü scanner

// Apps Script Linkin (Buraya en son aldığın güncel Deploy URL'sini yapıştır!)
const GOOGLE_SCRIPT_URL = "https://script.google.com/home/projects/16h0HKPn0aM-kG_EgX0lqnm4IOnf5oyBK6MJSsZeHmA5pZ9eaTAKRIoiz/edit";

const BarcodeScanner: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Barkod okunduğunda çalışan fonksiyon
  const handleScanSuccess = async (decodedText: string) => {
    // Eğer şu an bir işlem yapılıyorsa veya aynı barkod zaten okunduysa durdur
    if (isProcessing || decodedText === scanResult) return;

    setScanResult(decodedText);
    setIsProcessing(true);
    setStatusMessage("Veri gönderiliyor...");

    try {
      // Google Apps Script'e veriyi gönderiyoruz
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // CORS hatası almamak için
        headers: {
          "Content-Type": "application/json",
        },
        // --- KRİTİK DÜZELTME: action eklendi ---
body: JSON.stringify({ 
  barcode: decodedText, 
  action: "scanBarcode" // Bu parametre Apps Script'teki stok düşme işlemini tetikler
}),

      setStatusMessage("Başarıyla kaydedildi: " + decodedText);
      
      // 3 saniye sonra yeni barkod okumaya hazır hale getir
      setTimeout(() => {
        setIsProcessing(false);
        setScanResult(null);
        setStatusMessage("Yeni barkod için hazır.");
      }, 3000);

    } catch (error) {
      console.error("Hata:", error);
      setStatusMessage("Gönderim hatası oluştu!");
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#333' }}>Stok Barkod Sistemi</h2>

      {/* Kamera Alanı */}
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        border: '4px solid #333', 
        borderRadius: '15px', 
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
      }}>
        <Scanner onScanSuccess={handleScanSuccess} />
        
        {/* Görsel Odak Noktası */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          height: '100px',
          border: '2px solid rgba(0, 255, 0, 0.6)',
          borderRadius: '10px',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Durum ve Sonuç Bilgisi */}
      <div style={{ marginTop: '20px', textAlign: 'center', width: '100%', maxWidth: '450px' }}>
        <div style={{
          padding: '15px',
          borderRadius: '8px',
          backgroundColor: isProcessing ? '#fff3cd' : '#d4edda',
          color: isProcessing ? '#856404' : '#155724',
          border: '1px solid',
          borderColor: isProcessing ? '#ffeeba' : '#c3e6cb',
          fontWeight: 'bold'
        }}>
          {statusMessage || "Barkodu çerçeveye ortalayın"}
        </div>

        {scanResult && (
          <div style={{ marginTop: '10px', fontSize: '18px' }}>
            Son Okunan: <strong>{scanResult}</strong>
          </div>
        )}
      </div>

      <button 
        onClick={() => { setScanResult(null); setStatusMessage(""); }}
        style={{
          marginTop: '20px',
          padding: '10px 25px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Yeniden Tara
      </button>
    </div>
  );
};

export default BarcodeScanner;
