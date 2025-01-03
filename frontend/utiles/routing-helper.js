var State = {
    'AllCertificates': 'all-certificates',
    'Certificate': 'certificate',
    'Create': 'create',
    'Update': 'update',
}

var getHrefInfo = function () {
    var hrefArray = window.location.href.split('/');
    var lastPart = hrefArray.pop();
    var baseUrl = hrefArray.join('/')

    // Розділяємо шлях і параметри
    var [route, query] = lastPart.split('?');
    var id = null;

    // Якщо є параметри, шукаємо `id`
    if (query) {
        var params = new URLSearchParams(query);
        id = params.get('id'); // Отримуємо значення параметра "id"
    }

    return {
        baseUrl,
        route,
        id
    };
};
