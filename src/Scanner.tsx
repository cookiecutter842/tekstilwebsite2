// src/Scanner.tsx içindeki constraints kısmını bununla değiştirin:

const { ref } = useZxing({
  onDecodeResult(result) {
    onScanSuccess(result.getText());
  },
  // Hata veren kısım burasıydı, yapıyı 'video' altına aldık:
  constraints: {
    video: {
      facingMode: "environment",
      width: { min: 1280, ideal: 1920 },
      height: { min: 720, ideal: 1080 },
      // @ts-ignore: TypeScript'in advanced/focusMode hatasını görmezden gelmesi için
      advanced: [{ focusMode: "continuous" }]
    }
  },
});
