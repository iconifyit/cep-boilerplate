(function($, Client) {

    if (typeof Client === 'undefined') {
        throw new Error('Client instance was not found and is required.')
    }

    var fs   = require('fs'),
        zlib = require('zlib'),
        _    = require('lodash');

    $(function() {

        var $button = $('<button/>').appendTo('.buttons');

        $button.text('Open IconJar');
        $button.attr({
            'id'    : 'open-iconjar',
            'href'  : '#open-iconjar',
            'class' : 'topcoat-button--large--cta'
        });
        $button.css('margin-left', '20px');

        /**
         * Wrapper for zlib to gunzip a file.
         * @param source
         * @param destination
         * @param callback
         */
        var gunzip = function(source, destination, callback) {

            try {

                var test = window.cep.fs.readFile(source);
                console.log('fs.readFile', test);

                var test2 = fs.readdirSync(source);
                _.each(test2, function(item, iter) {
                    console.log(iter, item);
                });


                // prepare streams
                var src  = fs.createReadStream(source),
                    dest = fs.createWriteStream(destination);

                console.log('src',  src);
                console.log('dest', dest);

                // extract the archive
                src.pipe(zlib.createGunzip()).pipe(dest);

                // callback on extract completion
                dest.on('close', function() {
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            }
            catch (err) {
                console.error('Gunzip error', e);
            }
        }

        /**
         * Button callback handler.
         * @param e
         */
        var buttonHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            $button.blur();

            csInterface.evalScript(
                'Host.chooseIconjar("~/Downloads/cep-iconjar", "*.iconjar")',
                function(result) {

                    console.log(result);
                    console.log(typeof result);

                    try {
                        result = JSON.parse(result);

                        var inputpath = result.value.replace('~/', '/Users/scott/');

                        // var gunzip = require('gunzip-file');

                        var outputpath = inputpath.replace('.iconjar', '');

                        console.log(inputpath);
                        console.log(inputpath.replace('.iconjar', ''));

                        var test = gunzip(inputpath, outputpath, function() {
                            console.log('gunzip done!')
                        });

                        console.log(typeof test);
                        console.log('test', test);

                    }
                    catch(e) { console.error('Ungzip error', e) }
            });
        }

        $button.on('click', buttonHandler);
        $button.off('click', buttonHandler).on('click', buttonHandler);
    });
})(jQuery, Client);
