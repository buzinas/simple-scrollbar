;(function(win) {
  var doc = win.document,
      docElm = doc.documentElement,
      raf = win.requestAnimationFrame;

  function initEl(el) {
    if (el.hasOwnProperty('data-simple-scrollbar'))
      return;

    Object.defineProperty(el, 'data-simple-scrollbar',
      new SimpleScrollbar(el));
  }

  // Mouse drag handler
  function dragDealer(el, context) {
    var lastPageY;

    el.addEventListener('mousedown', function(e) {
      lastPageY = e.pageY;
      el.classList.add('ss-grabbed');
      doc.body.classList.add('ss-grabbed');

      doc.addEventListener('mousemove', drag);
      doc.addEventListener('mouseup', stop);

      return false;
    });

    function drag(e) {
      var delta = e.pageY - lastPageY;
      lastPageY = e.pageY;

      raf(function(){
        context.el.scrollTop += delta / context.scrollRatio;
      });
    }

    function stop() {
      el.classList.remove('ss-grabbed');
      doc.body.classList.remove('ss-grabbed');
      doc.removeEventListener('mousemove', drag);
      doc.removeEventListener('mouseup', stop);
    }
  }

  // Constructor
  function SimpleScrollbar(el) {
    this.target = el;
    this.bar = '<div class="ss-scroll">';

    this.wrapper = doc.createElement("div");
    this.wrapper.setAttribute("class", "ss-wrapper");

    this.el = doc.createElement("div");
    this.el.setAttribute("class", "ss-content");

    this.wrapper.appendChild(this.el);

    while (this.target.firstChild) {
      this.el.appendChild(this.target.firstChild);
    }
    this.target.appendChild(this.wrapper);

    this.target.insertAdjacentHTML("beforeend", this.bar);
    this.bar = this.target.lastChild;

    dragDealer(this.bar, this);
    this.moveBar();

    this.el.addEventListener('scroll', this.moveBar.bind(this));
    this.el.addEventListener('mouseenter', this.moveBar.bind(this));

    this.target.classList.add("ss-container");
  }

  SimpleScrollbar.prototype = {
    moveBar: function(e) {
      var totalHeight = this.el.scrollHeight,
      ownHeight   = this.el.clientHeight,
      _this        = this;

      this.scrollRatio = ownHeight / totalHeight;

      raf(function() {
        _this.bar.style.cssText = 'height:' + (ownHeight / totalHeight) * 100 + '%; top:' + (_this.el.scrollTop / totalHeight ) * 100 + '%;right:-' + (_this.target.clientWidth - _this.bar.clientWidth) + 'px;';
      });
    }
  }

  SimpleScrollbar.initEl = initEl;
  SimpleScrollbar.initAll = function() {
    var nodes = doc.querySelectorAll("*[data-ss-container]");

    for (var i = 0; i < nodes.length; i++) {
      initEl(nodes[i]);
    }
  };

  win.SimpleScrollbar = SimpleScrollbar;
})(window);
