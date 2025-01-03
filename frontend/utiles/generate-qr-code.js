const generateQrCode = (url) => {
    // Через таймаут, щоб елемент з QR кодом встиг з'явитися
    setTimeout(() => {
        const canvas = document.getElementById('qrcode');
        QRCode.toCanvas(canvas, url, (error) => {
            if (error) console.error('QR Code Error:', error);
            else console.log('QR Code Generated!');
        });
    })
};