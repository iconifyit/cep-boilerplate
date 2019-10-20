module.exports = null;

if (window && window.__adobe_cep__) {
    module.exports = (() => {
        window.FlyoutMenu = require(__dirname + '/FlyoutMenu.js');
        console.log('window.FlyoutMenu', window.FlyoutMenu );
        return window.FlyoutMenu;
    })();
}
