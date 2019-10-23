
var Artboards = [];

try {
    Artboards = getArtboardsIterator();
}
catch(ex) {
    /* Exit Gracefully */
}

function getArtboardsIterator() {
    var Artboards = false,
        doc       = app.activeDocument;

    try {
        Artboards = new Iterator(doc.artboards);
    }
    catch(e) {
        alert("[1] " + e);
    }

    try {
        if (Artboards instanceof Object) {
            Artboards.next = function() {
                Artboards.index++;
                doc.artboards.setActiveArtboardIndex( Artboards.getIndex() );
                app.executeMenuCommand('fitall');
                return Artboards.items[Artboards.getIndex()];
            }

            Artboards.previous = function() {
                Artboards.index--;
                doc.artboards.setActiveArtboardIndex( Artboards.getIndex() );
                app.executeMenuCommand('fitall');
                return Artboards.items[Artboards.getIndex()];
            }

            Artboards.current = function() {
                doc.artboards.setActiveArtboardIndex( Artboards.getIndex() );
                app.executeMenuCommand('fitall');
                return Artboards.items[Artboards.index];
            }

            Artboards.reset = function() {
                Artboards.index = 0;
                doc.artboards.setActiveArtboardIndex( Artboards.getIndex() );
                app.executeMenuCommand('fitall');
                return Artboards.getItems();
            }

            Artboards.last = function() {
                Artboards.index = Artboards.items.length-1;
                doc.artboards.setActiveArtboardIndex( Artboards.getIndex() );
                app.executeMenuCommand('fitall');
                return Artboards.items[Artboards.getIndex()];
            }
        }
    }
    catch(e) {
        alert("[2] " + e);
    }

    return Artboards;
}