module.exports = null;

if (window && window.__adobe_cep__) {
    module.exports = (() => {
        window.CSInterface = require(__dirname + '/CSInterface.js');
        console.log('window.CSInterface', window.CSInterface );
        return window.CSInterface;
    })();
}
