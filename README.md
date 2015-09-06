# SimpleScrollbar
Very simple vanilla javascript library for creating a custom scrollbar cross-browser and cross-devices.

## Benefits:

- Extremely lightweight (less than 1KB after gzip and minify)
- It uses the native scroll events, so:
  - All the events work and are smooth (mouse wheel, space, page down, page up, arrows etc).
  - so the performance is awesome!
- No dependencies, completely vanilla Javascript!

## Browser Support

It was developed for evergreen browsers, but it works both on IE10 and IE11 either.

If you want to make it works down to IE9, the only thing you need to do is to add the [classList polyfill] (https://github.com/eligrey/classList.js).

    <!--[if IE 9]><script src="classList.min.js"></script></[endif]-->

## Usage
### Auto-binding
`<div ss-container>One</div>`
`<div ss-container>Two</div>`

`<script>SimpleScrollbar.initAll();</script>`

### Manual binding
`<div class="myClass"></div>`

`<script>SimpleScrollbar.initEl(document.querySelector(".myClass"));</script>`

Demo http://buzinas.github.io/simple-scrollbar
