$.fn.mozzarella = function(options) {
    options = $.extend(
        {itemWidth: 300, margin: 30, itemClass: 'item', cssPrefix: '', id: ''},
        options
    );

    var container = this;

    function onResize() {
        var width = container.innerWidth(), // (w.innerWidth || e.clientWidth || g.clientWidth) - scrollbarWidth,
            noCols = 1;

        console.log('itemWidth', options.itemWidth);

        for (var _noCols = 1; _noCols < 100; _noCols++) {
            if (_noCols * options.itemWidth + (_noCols + 1) * options.margin <= width) {
                noCols = _noCols;
            } else {
                break;
            }
        }

        var workingItemWidth = Math.floor((width - ((noCols - 1) * options.margin)) / noCols);

        $('#x-' + options.id).remove();

        var ss = document.createElement('style');

        ss.id = 'x-' + options.id;

        var ssHtml = '';

        ssHtml += options.cssPrefix + ' .' + options.itemClass + ' { display: inline-block; float: left; width: ' + workingItemWidth + 'px; margin: ' + options.margin + 'px 0 0 ' + options.margin + 'px; } ';
        ssHtml += options.cssPrefix + ' .' + options.itemClass + ':nth-child(' + noCols + 'n+1) { margin-left: 0; } ';

        if (noCols > 1) {
            ssHtml += options.cssPrefix + ' .' + options.itemClass + ':nth-child(' + noCols + 'n) { margin: ' + options.margin + 'px 0 0 0; float: right; } ';
        }

        for (var i=1; i<= noCols; i++) {
            if (i > 1) {
                ssHtml += ', ';
            }

            ssHtml += options.cssPrefix + ' .' + options.itemClass + ':nth-child(' + i + ')';
        }

        ssHtml += '{ margin-top: 0 } ';

        console.log(ssHtml);

        ss.innerHTML = ssHtml;

        document.body.appendChild(ss);

        if (typeof options.onResize == 'function') {
            options.onResize();
        }

        if (width != container.innerWidth()) {
            setTimeout(function(){
                onResize();
            }, 10);
        }
    };

    $(window).resize(onResize);

    onResize();

    $(options.cssPrefix + ' .' + options.itemClass).show();
};
