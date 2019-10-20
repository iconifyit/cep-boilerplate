module.exports = null;

if (window && window.__adobe_cep__) {
    module.exports = (() => {
        window.$ = require(__dirname + '/jquery.3.3.1.min.js');
        console.log('window.$', window.$);
        return window.$;
    })();
}
