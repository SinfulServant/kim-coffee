var sendRequest = (method, url, data = null, repeatReqCallback = () => {}) => {
    IsLoading.value = true;

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
        options.body = JSON.stringify(data);
    }
    try {
    // Виконуємо запит
        return fetch(url, options)
            .then(async (response) => {
                IsLoading.value = false;

                const responseBody = await response.json().catch(() => ({})); // Уникаємо помилок, якщо JSON порожній
                if (!response.ok) {
                    var status = response.status;
                    var message = responseBody.message;

                    if (status === 403) {
                        ChangeState(Routes.Login);
                    } else if (status === 401) {
                        RefreshToken(repeatReqCallback);
                    }
                    throw new Error(`{ 
                    "statusCode": "${status}", 
                    "message": "${message}"
                }`);
                }
                return responseBody;
            })
            .catch((error) => {
                IsLoading.value = false;
                console.log(error)
                throw error;
            });
    } catch (error) {
        console.log('Catcher')
        IsLoading.value = false;
    }
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


var RefreshToken = function (callbackRepeatRequest = () => {}) {
    if (!IsAccess.value) {
        ChangeState(Routes.Login)
        throw new Error('Doesn`t have access token')
    }

    sendRequest('POST', refreshTokenUrl, {}).then((res) => {
        if (res) {
            IsAccess.value = !!res.accessToken;
            localStorage.setItem('accessToken', res.accessToken)
            callbackRepeatRequest()
        } else {
            ChangeState(Routes.Login)
        }
    })
}

// DATA
var GetAllCertificates = function (allCertificates) {
    sendRequest('GET', getAllCertificatesUrl, null, () => GetAllCertificates(allCertificates)).then((res) => {
        allCertificates.value = res;
    })
}

var GetCertificate = function (currentCertificate, amountInput, nameInput, callback = () => {}) {
    sendRequest('GET', getCertificateUrl + getHrefInfo().id, null, () => GetCertificate(currentCertificate, amountInput, nameInput)).then((res) => {
        currentCertificate.value = res;
        amountInput.value = res.amount;
        nameInput.value = res.name;
        callback();
    })
}

var UpdateCertificate = function (id, amountInput, nameInput) {
    sendRequest('POST', updateCertificateUrl + id, {
        amount: +amountInput.value,
        name: nameInput.value,
    }, () => UpdateCertificate(id, amountInput, nameInput)).then((res) => {
        if (res) {
            alert('Баланс сертифіката зміно')
            amountInput.value = res.amount;
            nameInput.value = res.name;
        }
    }).catch((err) => {
        nameInputValidator(err)
    })
}

var CreateCertificate = function ({ amountInput, nameInput, qrCodeUrl }) {
    var baseUrl = getHrefInfo().baseUrl

    IsLoading.value = true;

    sendRequest('POST', createCertificateUrl, {
        amount: +amountInput.value,
        name: nameInput.value,
    }, () => CreateCertificate({ amountInput, nameInput, qrCodeUrl })).then((res) => {
        IsLoading.value = false;
        if (res) {
            amountInput.value = '';
            nameInput.value = '';
            generateQrCode(`${baseUrl}/update?id=${res.id}`);
            qrCodeUrl.value = getQrCodeUrl(res.id);
        }
    }).catch((error) => {
        nameInputValidator(error)
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

// validators
var nameInputValidator = function (error = '') {

    var errorElement = document.querySelector("[nameInputError]")

    if (error.toString().includes('The name already exists. Please choose a different name.')) {
        errorElement.innerText = 'Сертифікати з таким ім\'ям вже існує';
    }

    setTimeout(() => errorElement.innerText = '', 5000)
}