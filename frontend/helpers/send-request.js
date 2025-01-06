var sendRequest = (method, url, data = null, repeatReqCallback = () => {}) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            },
        credentials: 'include'
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Якщо є дані для відправки (наприклад, при POST чи PUT)
    if (data) {
        options.body = JSON.stringify(data);  // Перетворюємо об'єкт в JSON
    }

    // Виконуємо запит
    return fetch(url, options)
        .then(async (response) => {
            const responseBody = await response.json().catch(() => ({})); // Уникаємо помилок, якщо JSON порожній
            if (!response.ok) {
                if (response.status === 401 || responseBody.message === 'Invalid or expired refresh token') {
                    ChangeState(Routes.Login);
                } else if (response.status === 403) {
                    RefreshToken(repeatReqCallback);
                }
                throw new Error(`Error: ${response.status}`);
            }
            return responseBody; // Повертаємо тіло відповіді, якщо все ок
        })
        .catch((error) => {
            console.error(error);
            throw error; // Передаємо помилку далі
        });
}

// AUTH
var DoLogin = function (password) {
    sendRequest('POST', loginUrl, { password }).then((res) => {
        if (res) {
            IsAccess.value = res.accessToken;
            localStorage.setItem('accessToken', res.accessToken)
            ChangeState(Routes.AllCertificates)
        }
    })
}


var RefreshToken = function (callbackRepeatRequest) {
    sendRequest('POST', refreshTokenUrl, {}).then((res) => {
        if (res) {
            IsAccess.value = !!res.accessToken;
            localStorage.setItem('accessToken', res.accessToken)
            callbackRepeatRequest()
        }
    })
}

// DATA
var GetAllCertificates = function (allCertificates) {
    sendRequest('GET', getAllCertificatesUrl, null, () => GetAllCertificates(allCertificates)).then((res) => {
        allCertificates.value = res;
    })
}

var GetCertificate = function (currentCertificate, amountInput, callback) {
    sendRequest('GET', getCertificateUrl + getHrefInfo().id, null, () => GetCertificate(currentCertificate, amountInput)).then((res) => {
        currentCertificate.value = res;
        amountInput.value = res.amount;
        callback();
    })
}

var UpdateCertificate = function (id, amountInput) {
    sendRequest('POST', updateCertificateUrl + id, {
        amount: +amountInput.value,
    }, () => UpdateCertificate(id, amountInput)).then((res) => {
        if (res) {
            alert('Баланс сертифіката зміно')
            amountInput.value = res.amount;
        }
    })
}

var CreateCertificate = function ({ amountInput, isLoading }) {
    var baseUrl = getHrefInfo().baseUrl

    isLoading.value = true;
    sendRequest('POST', createCertificateUrl, {
        amount: +amountInput.value,
    }, () => CreateCertificate({ amountInput, isLoading })).then((res) => {
        isLoading.value = false;
        if (res) {
            amountInput.value = '';
            generateQrCode(`${baseUrl}/update?id=${res.id}`)
        }
    })
}

var DeleteCertificate = function (id, allCertificates) {
    var confirmation = confirm('Ви впевленні, що хочете видалити сертифікат з номером ' + id + '?')
    if (!confirmation) return;

    sendRequest('DELETE', deleteCertificateUrl + id, null, () => DeleteCertificate(id, allCertificates)).then(
        () => {
            allCertificates.value = allCertificates.value.filter((certificate) => certificate.id !== id)
        }
    )
}