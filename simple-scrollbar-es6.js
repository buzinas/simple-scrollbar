class SimpleScrollbar {
  constructor(el) {
    this.target = el;
    this.bar = '<div class="ss-scroll">';

    this.wrapper = document.createElement("div");
    this.wrapper.setAttribute("class", "ss-wrapper");

    this.el = document.createElement("div");
    this.el.setAttribute("class", "ss-content");

    this.wrapper.appendChild(this.el);

    while (this.target.firstChild) {
      this.el.appendChild(this.target.firstChild);
    }
    this.target.appendChild(this.wrapper);

    this.target.insertAdjacentHTML("beforeend", this.bar);
    this.bar = this.target.lastChild;

    this._dragDealer(this.bar, this);
    this._moveBar();

    this.el.addEventListener('scroll', this._moveBar.bind(this));
    this.el.addEventListener('mouseenter', this._moveBar.bind(this));

    this.target.classList.add("ss-container");
  }

  _dragDealer(el, context) {
    var lastPageY;

    el.addEventListener('mousedown', function(e) {
      lastPageY = e.pageY;
      el.classList.add('ss-grabbed');
      document.body.classList.add('ss-grabbed');

      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stop);

      return false;
    });

    function drag(e) {
      var delta = e.pageY - lastPageY;
      lastPageY = e.pageY;

      window.requestAnimationFrame(function(){
        context.el.scrollTop += delta / context.scrollRatio;
      });
    }

    function stop() {
      el.classList.remove('ss-grabbed');
      document.body.classList.remove('ss-grabbed');
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stop);
    }
  }

  _moveBar(e) {
    var totalHeight = this.el.scrollHeight,
        ownHeight = this.el.clientHeight;

    this.scrollRatio = ownHeight / totalHeight;

    window.requestAnimationFrame(() => {
      this.bar.style.cssText = `height: ${ownHeight / totalHeight * 100}%; top: ${this.el.scrollTop / totalHeight * 100}%; right:-${this.target.clientWidth - this.bar.clientWidth}px;`;
    });
  }

  static initEl(el) {
    if (el.hasOwnProperty('data-simple-scrollbar'))
      return;

    Object.defineProperty(el, 'data-simple-scrollbar',
      new SimpleScrollbar(el));
  }

  static initAll() {
    var nodes = document.querySelectorAll("*[data-ss-container]");

    for (var i = 0; i < nodes.length; i++) {
      SimpleScrollbar.initEl(nodes[i]);
    }
  }
}
