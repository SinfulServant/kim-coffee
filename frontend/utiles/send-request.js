var sendRequest = (method, url, data = null) => {
    const options = {
        method: method,  // GET, POST, PUT, DELETE і т.д.
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Якщо є дані для відправки (наприклад, при POST чи PUT)
    if (data) {
        options.body = JSON.stringify(data);  // Перетворюємо об'єкт в JSON
    }

    // Виконуємо запит
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                // Якщо відповідь не успішна, кидаємо помилку
                return Promise.reject('Error: ' + response.status);
            }
            return response.json();  // Парсимо JSON, якщо відповідь успішна
        })
        .catch(error => {
            console.error('Request failed', error);
            throw error;  // Обробка помилки
        });
}

var GetAllCertificates = function (allCertificates) {
    sendRequest('GET', getAllCertificatesUrl).then((res) => {
        allCertificates.value = res;
    })
}

var GetCertificate = function (currentCertificate) {
    sendRequest('GET', getCertificateUrl + id).then((res) => {
        currentCertificate.value = res;
    })
}

var DeleteCertificate = function (id, allCertificates) {
    var confirmation = confirm('Ви впевленні, що хочете видалити сертифікат з номером ' + id + '?')
    if (!confirmation) return;

    sendRequest('DELETE', deleteCertificateUrl + id, {password: 'e2b12f46-0a12-41a7-a4cc-cdd4cf27606a'}).then(
        () => {
            allCertificates.value = allCertificates.value.filter((certificate) => certificate.id !== id)
        }
    )
}