var baseBackendUrl =
    // 'https://kim-coffee-e633e5068a92.herokuapp.com'
    'http://localhost:3000'

var getAllCertificatesUrl = `${baseBackendUrl}/certificate/all`;
var getCertificateUrl = `${baseBackendUrl}/certificate/`
var createCertificateUrl = `${baseBackendUrl}/certificate/create`
var updateCertificateUrl = `${baseBackendUrl}/certificate/update/`
var deleteCertificateUrl = `${baseBackendUrl}/certificate/delete/`

// TODO якийсь дивний метод
var certificateUrl = (id) => {
    var currentBaseUrl = window.location.href.split('/');
    currentBaseUrl.pop()
    currentBaseUrl.join('/')
    console.log(currentBaseUrl + id)
}
