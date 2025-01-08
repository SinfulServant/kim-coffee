const generateQrCode = (id) => {
    var baseUrl = getHrefInfo().baseUrl;
    // Через таймаут, щоб елемент з QR кодом встиг з'явитися
    setTimeout(() => {
        const url = `${baseUrl}/certificate?id=${id}`

        const canvas = document.getElementById('qrcode');
        QRCode.toCanvas(canvas, url, { color: { light: '#fdfce3' }  }, (error) => {
            if (error) console.error('QR Code Error:', error);
        });
    })
};