"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleScrollbar = (function () {
  function SimpleScrollbar(el) {
    _classCallCheck(this, SimpleScrollbar);

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

  _createClass(SimpleScrollbar, [{
    key: "_dragDealer",
    value: function _dragDealer(el, context) {
      var lastPageY;

      el.addEventListener('mousedown', function (e) {
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

        window.requestAnimationFrame(function () {
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
  }, {
    key: "_moveBar",
    value: function _moveBar(e) {
      var _this = this;

      var totalHeight = this.el.scrollHeight,
          ownHeight = this.el.clientHeight;

      this.scrollRatio = ownHeight / totalHeight;

      window.requestAnimationFrame(function () {
        _this.bar.style.cssText = "height: " + ownHeight / totalHeight * 100 + "%; top: " + _this.el.scrollTop / totalHeight * 100 + "%; right:-" + (_this.target.clientWidth - _this.bar.clientWidth) + "px;";
      });
    }
  }], [{
    key: "initEl",
    value: function initEl(el) {
      if (el.hasOwnProperty('data-simple-scrollbar')) return;

      Object.defineProperty(el, 'data-simple-scrollbar', new SimpleScrollbar(el));
    }
  }, {
    key: "initAll",
    value: function initAll() {
      var nodes = document.querySelectorAll("*[data-ss-container]");

      for (var i = 0; i < nodes.length; i++) {
        SimpleScrollbar.initEl(nodes[i]);
      }
    }
  }]);

  return SimpleScrollbar;
})();
