var Routes = {
    'AllCertificates': 'all-certificates',
    'Certificate': 'certificate',
    'Create': 'create',
    'Update': 'update',
    'Login': 'login',
}

var getHrefInfo = function () {
    var hrefArray = window.location.href.split('/');
    var lastPart = isMyPath(hrefArray.at(-1)) ? hrefArray.pop() : '';
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
        id,
        isRouteEmpty: route === '',
    };
};

var isMyPath = (path) => {
    return path.split('?')[0] === Routes.Certificate
        || path === Routes.Login
        || path === Routes.AllCertificates
        || path === Routes.Create
        || path.split('?')[0] === Routes.Update;
}