(function (w, d) {
  var raf = w.requestAnimationFrame || w.setImmediate || function (c) { return setTimeout(c, 0); };
  function getScrollRatio(contentHeight, viewportHeight) {
    return contentHeight === 0 ? 1 : viewportHeight / contentHeight;
  }

  function getHandleHeight(contentHeight, viewportHeight) {
    return Math.max(getScrollRatio(contentHeight, viewportHeight), .10) * viewportHeight;
  }

  function getHandleRatio(contentHeight, viewportHeight) {
    return Math.max(getScrollRatio(contentHeight, viewportHeight), .10);
  }

  function getHandleTop(contentHeight, viewportHeight, scrollTop) {
    return Math.floor((scrollTop / contentHeight) * (viewportHeight - (1 - getScrollRatio(contentHeight, viewportHeight) / getHandleRatio(contentHeight, viewportHeight)) * getHandleHeight(contentHeight, viewportHeight)))
  }

  function initEl(el) {
    if (el.hasOwnProperty('data-simple-scrollbar')) return;
    Object.defineProperty(el, 'data-simple-scrollbar', new SimpleScrollbar(el));
  }

  // Mouse drag handler
  function dragDealer(el, context) {
    var lastPageY;

    el.addEventListener('mousedown', function (e) {
      lastPageY = e.pageY;
      el.classList.add('ss-grabbed');
      d.body.classList.add('ss-grabbed');

      d.addEventListener('mousemove', drag);
      d.addEventListener('mouseup', stop);

      return false;
    });

    function drag(e) {
      var delta = e.pageY - lastPageY;
      lastPageY = e.pageY;

      raf(function () {
        var contentHeight = context.el.scrollHeight;
        if (contentHeight === 0) return;
        var viewportHeight = context.el.clientHeight;
        var scrollRatio = getScrollRatio(contentHeight, viewportHeight);
        var handleRatio = getHandleRatio(contentHeight, viewportHeight);
        var handleHeight = getHandleHeight(contentHeight, viewportHeight);
        var handleHeightDelta = handleHeight - scrollRatio * viewportHeight;
        context.el.scrollTop += delta / scrollRatio * ((handleHeightDelta + viewportHeight) / viewportHeight);
      });
    }

    function stop() {
      el.classList.remove('ss-grabbed');
      d.body.classList.remove('ss-grabbed');
      d.removeEventListener('mousemove', drag);
      d.removeEventListener('mouseup', stop);
    }
  }

  function elementIsHidden(e) {
    return e.offsetWidth === 0 && e.offsetHeight === 0;
  }

  function getHiddenAncestorOrItself(element) {
    var parent = element.parentNode
    return parent === null || !elementIsHidden(parent) ?
      element :
      getHiddenAncestorOrItself(parent);
  }
 
  function debounce(delay, func) {
    var due;
    return function () {
      const start = (new Date()).valueOf();
      function tryCall() {
        const now = (new Date()).valueOf();
        if (now >= due) {
          func();
        } else {
          setTimeout(tryCall, due - now);
        }
      }
      if (due !== undefined && start < due) {
      } else {
        setTimeout(tryCall, delay);
      }
      due = start + delay;
    };
  }
  // Constructor
  function ss(el) {
    this.target = el;

    this.direction = window.getComputedStyle(this.target).direction;

    this.bar = '<div class="ss-scroll">';

    this.wrapper = d.createElement('div');
    this.wrapper.setAttribute('class', 'ss-wrapper');

    this.el = d.createElement('div');
    this.el.setAttribute('class', 'ss-content');

    if (this.direction === 'rtl') {
      this.el.classList.add('rtl');
    }

    this.wrapper.appendChild(this.el);

    while (this.target.firstChild) {
      this.el.appendChild(this.target.firstChild);
    }
    this.target.appendChild(this.wrapper);

    this.target.insertAdjacentHTML('beforeend', this.bar);
    this.bar = this.target.lastChild;

    dragDealer(this.bar, this);
    this.moveBar();
    var moveBar = this.moveBar.bind(this);
    const moveBarDebounced = debounce(200, moveBar);

    this.el.addEventListener('scroll', moveBar);
    this.el.addEventListener('mouseenter', moveBar);

    this.target.classList.add('ss-container');

    var css = window.getComputedStyle(el);
    if (css['height'] === '0px' && css['max-height'] !== '0px') {
      el.style.height = css['max-height'];
    }
    if (elementIsHidden(el)) {
      var visibilityObserver = new MutationObserver(function (visibilityMutations) {
        moveBar();
        visibilityObserver.disconnect();
      });
      var config = { attributes: true, attributeFilter: ["class", "style"], childList: false, characterData: false, subtree: false };
      visibilityObserver.observe(getHiddenAncestorOrItself(el), config);
    }
    var mutationObserver = new MutationObserver(function (mutations) {
      moveBarDebounced();
    });
    var observerOptions = { attributes: true, childList: true, characterData: false, subtree: true, attributeFilter: ["class", "style"] };
    mutationObserver.observe(this.el, observerOptions);
  }

  ss.prototype = {
    moveBar: function (e) {
      var contentHeight = this.el.scrollHeight,
        viewportHeight = this.el.clientHeight,
        _this = this;

      var scrollRatio = getScrollRatio(contentHeight, viewportHeight);

      var isRtl = _this.direction === 'rtl';
      var right = isRtl ?
        (_this.target.clientWidth - _this.bar.clientWidth + 18) :
        (_this.target.clientWidth - _this.bar.clientWidth) * -1;

      raf(function () {
        // Hide scrollbar if no scrolling is possible
        if (scrollRatio >= 1) {
          _this.bar.classList.add('ss-hidden')
        } else {
          _this.bar.classList.remove('ss-hidden')
          var handleHeight = getHandleHeight(contentHeight, viewportHeight);
          var handleTop = getHandleTop(contentHeight, viewportHeight, _this.el.scrollTop);
          _this.bar.style.cssText = 'height:' + handleHeight + 'px; top:' + handleTop + 'px;right:' + right + 'px;';
        }
      });
    }
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
