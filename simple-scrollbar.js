(function(w, d) {
    var raf = w.requestAnimationFrame || w.setImmediate || function(c) {
        return setTimeout(c, 0);
    };

    // proxy to addClass methods - fallback for ie9
    function addClass(el, val) {
        if (typeof el.classList === "undefined") {
            var className = el.className + ' ' + val;
            el.className = className;
        } else {
            el.classList.add(val);
        }
    }

    // proxy to removeClass methods - fallback for ie9
    function removeClass(el, val) {
        if (typeof el.classList === "undefined") {
            var className = el.className;
            className = className.replace(val, '');
            el.className = className;
        } else {
            el.classList.remove(val);
        }
    }

    // Mouse drag handler
    function dragDealer(el, context) {
        var lastPageY;
        el.addEventListener('mousedown', function(e) {
            lastPageY = e.pageY;
            addClass(el, 'ss-grabbed');
            addClass(d.body, 'ss-grabbed');
            d.addEventListener('mousemove', drag);
            d.addEventListener('mouseup', stop);
            e.stopPropagation();
            e.preventDefault();
            return false;
        });

        function drag(e) {
            var delta = e.pageY - lastPageY;
            lastPageY = e.pageY;
            raf(function() {
                context.el.scrollTop += delta / context.scrollRatio;
            });
            e.stopPropagation();
            e.preventDefault();
            return false;
        }

        function stop() {
            removeClass(el, 'ss-grabbed');
            removeClass(d.body, 'ss-grabbed');
            d.removeEventListener('mousemove', drag);
            d.removeEventListener('mouseup', stop);
        }
    }

    // Constructor
    function ss(el) {
        this.target = el;
        this.bar = '<div class="ss-scroll">';
        this.wrapper = d.createElement('div');
        this.wrapper.setAttribute('class', 'ss-wrapper');
        this.el = d.createElement('div');
        this.el.setAttribute('class', 'ss-content');
        this.wrapper.appendChild(this.el);
        while (this.target.firstChild) {
            this.el.appendChild(this.target.firstChild);
        }
        this.target.appendChild(this.wrapper);
        this.target.insertAdjacentHTML('beforeend', this.bar);
        this.bar = this.target.lastChild;  var raf = w.requestAnimationFrame || w.setImmediate || function(c) { return setTimeout(c, 0); };

        dragDealer(this.bar, this);
        this.moveBar();
        this.el.addEventListener('scroll', this.moveBar.bind(this));
        this.el.addEventListener('mouseenter', this.moveBar.bind(this));
        window.addEventListener('resize', this.moveBar.bind(this));
        addClass(this.target, 'ss-container');
        return this;
    }

    ss.prototype = {
        moveBar: function(e) {
            var totalHeight = this.el.scrollHeight,
                ownHeight = this.el.clientHeight,
                _this = this;
            this.scrollRatio = ownHeight / totalHeight;
            raf(function() {
                // Hide scrollbar if no scrolling is possible
                if (_this.scrollRatio >= 1) {
                    addClass(_this.bar, 'ss-hidden');
                } else {
                    removeClass(_this.bar, 'ss-hidden');
                    _this.bar.style.cssText = 'height:' + (_this.scrollRatio * 100) + '%; top:' + ((_this.el.scrollTop / totalHeight) * 100) + '%;right:-' + (_this.target.clientWidth - _this.bar.clientWidth - 1) + 'px;';
                }
            });
        }
    }

    function initEl(el) {
        if (el.hasOwnProperty('data-simple-scrollbar')) return;
        var scroller = new SimpleScrollbar(el);
        Object.defineProperty(el, 'data-simple-scrollbar', scroller);
        return scroller;
    }

    function initAll() {
        var nodes = d.querySelectorAll('*[ss-container]');
        for (var i = 0; i < nodes.length; i++) {
            initEl(nodes[i]);
        }
    }

    d.addEventListener('DOMContentLoaded', initAll);
    ss.initEl = initEl;
    ss.initAll = initAll;
    w.SimpleScrollbar = ss;
})(window, document);