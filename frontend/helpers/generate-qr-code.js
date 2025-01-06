const generateQrCode = (id) => {
    var baseUrl = getHrefInfo().baseUrl;
    // Через таймаут, щоб елемент з QR кодом встиг з'явитися
    setTimeout(() => {
        const url = `${baseUrl}/certificate?id=${id}`
        console.log('QR url: ', url);

        const canvas = document.getElementById('qrcode');
        QRCode.toCanvas(canvas, url, (error) => {
            if (error) console.error('QR Code Error:', error);
            else console.log('QR Code Generated!');
        });
    })
};