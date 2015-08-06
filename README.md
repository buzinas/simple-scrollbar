# SimpleScrollbar
Very simple javascript library for creating a custom scrollbar cross-browser (using the native scroll events)

No dependencies, developed on both vanilla Javascript (ES5) and ES6 (ES2015).

## Usage
### Auto-binding
`<div data-ss-container></div>`

`<script>SimpleScrollbar.initAll();</script>`

### Manual binding
`<div class="myClass"></div>`

`<script>SimpleScrollbar.initEl(document.querySelector(".myClass"));</script>`
