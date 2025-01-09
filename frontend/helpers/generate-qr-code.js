var generateQrCode = (id) => {
    // Через таймаут, щоб елемент з QR кодом встиг з'явитися
    setTimeout(() => {
        var url = getQrCodeUrl(id);
        var canvas = document.getElementById('qrcode');
        QRCode.toCanvas(canvas, url, { color: { light: '#fdfce3' }  }, (error) => {
            if (error) console.error('QR Code Error:', error);
        });
    })
};

var getQrCodeUrl = function (id) {
    var baseUrl = getHrefInfo().baseUrl;
    return `${baseUrl}/certificate?id=${id}`;
}