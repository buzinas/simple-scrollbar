# SimpleScrollbar
Very simple javascript library for creating a custom scrollbar cross-browser and cross-devices.

Extremely lightweight, and it uses the native scroll events, so the performance is awesome!

No dependencies, developed with vanilla javascript!

## Usage
### Auto-binding
`<div ss-container>One</div>`
`<div ss-container>Two</div>`

`<script>SimpleScrollbar.initAll();</script>`

### Manual binding
`<div class="myClass"></div>`

`<script>SimpleScrollbar.initEl(document.querySelector(".myClass"));</script>`

[DEMO](//buzinas.github.io/simple-scrollbar)
