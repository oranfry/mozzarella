$.fn.mozzarella = function(options) {
    $('html').css('overflow-y', 'scroll');

    options = $.extend(
        {itemDimensions: {width: 300}, margin: 30, itemClass: 'item', cssPrefix: '', id: ''},
        options
    );

    var container = this,
        resizeTimer = null;

    function onResize() {
        container.css('width', '');

        var width = container.innerWidth(),
            noCols = 1,
            itemWidth = null;

        if (typeof options.itemDimensions == 'function') {
            itemDimensions = options.itemDimensions(width);
        } else {
            itemDimensions = options.itemDimensions;
        }

        for (var _noCols = 1; _noCols < 100; _noCols++) {
            if (_noCols * itemDimensions.width + (_noCols + 1) * options.margin <= width) {
                noCols = _noCols;
            } else {
                break;
            }
        }

        var workingItemWidth = Math.floor((width - ((noCols - 1) * options.margin)) / noCols),
            extraMargin = width - workingItemWidth * noCols - (noCols - 1) * options.margin;

        $('#x-' + options.id).remove();

        var ss = document.createElement('style');

        ss.id = 'x-' + options.id;

        var ssHtml = '';

        // set column width
        ssHtml += options.cssPrefix + ' .' + options.itemClass + ' { display: inline-block; float: left; width: ' + workingItemWidth + 'px; margin: ' + options.margin + 'px 0 0 ' + options.margin + 'px; } ';

        // maybe set row height
        if (itemDimensions.height) {
            ssHtml += options.cssPrefix + ' .' + options.itemClass + ' { height: ' + itemDimensions.height + 'px; }';
        }

        // remove left margin from first column
        ssHtml += options.cssPrefix + ' .' + options.itemClass + ':nth-child(' + noCols + 'n+1) { margin-left: 0; } ';

        // remove top margin for first row
        for (var i=1; i <= noCols; i++) {
            if (i > 1) {
                ssHtml += ', ';
            }

            ssHtml += options.cssPrefix + ' .' + options.itemClass + ':nth-child(' + i + ')';
        }

        ssHtml += '{ margin-top: 0 } ';

        // allocate extra pixels across columns to they dont go into last margin
        for (var i=1; i <= extraMargin; i++) {
            if (i > 1) {
                ssHtml += ', ';
            }

            ssHtml += options.cssPrefix + ' .' + options.itemClass + ':nth-child(' + noCols + 'n+' + i + ')';
        }

        ssHtml += '{width: ' + (workingItemWidth + 1) + 'px; } ';

        ss.innerHTML = ssHtml;

        document.body.appendChild(ss);

        if (options.filler) {
            container.find('.filler').remove();

            var overflow = container.find('.' + options.itemClass).length % noCols;

            if (overflow) {
                var noFillers = noCols - overflow;

                for (var i = 0; i < noFillers; i++) {
                    container.append(
                        $(typeof options.filler == 'string' && options.filler || '<div>')
                            .addClass(options.itemClass + ' filler')
                    );
                }
            }
        }

        if (typeof options.onResize == 'function') {
            options.onResize(noCols, workingItemWidth);
        }


        if (width != container.innerWidth()) {
            setTimeout(function(){
                onResize();
            }, 10);
        } else {
            container.css('width', width + 'px');
        }
    };

    $(window).resize(function() {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(onResize, 50);
    });

    setTimeout(onResize, 50);

    $(options.cssPrefix + ' .' + options.itemClass).show();
};
