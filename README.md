[![](https://data.jsdelivr.com/v1/package/npm/simple-scrollbar/badge)](https://www.jsdelivr.com/package/npm/simple-scrollbar)

# SimpleScrollbar
Very simple vanilla javascript library for creating a custom scrollbar cross-browser and cross-devices.

## Demo
http://buzinas.github.io/simple-scrollbar

## React version

I also open sourced a newer and more modern React version at:
https://github.com/closeio/react-custom-scroller

## Benefits

- Extremely lightweight (less than 1KB after gzip and minify)
- It uses the native scroll events, so:
  - All the events work and are smooth (mouse wheel, space, page down, page up, arrows etc).
  - The performance is awesome!
- No dependencies, completely vanilla Javascript!
- RTL support (thanks to [@BabkinAleksandr](https://github.com/BabkinAleksandr))

## Browser Support

It was developed with evergreen browsers in mind, but it works on IE11.

## Usage

You can use this library as a script tag, or you can import it as a npm module, eg:

### Script tag

Download the script [here](https://github.com/buzinas/simple-scrollbar/blob/master/simple-scrollbar.min.js) and the styles from [here](https://github.com/buzinas/simple-scrollbar/blob/master/simple-scrollbar.css) and include it:

```html
<link rel="stylesheet" href="/path/to/simple-scrollbar.css">
<script src="/path/to/simple-scrollbar.min.js"></script>
```

Or include it via [jsDelivr CDN](https://www.jsdelivr.com/package/npm/simple-scrollbar):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-scrollbar@latest/simple-scrollbar.css">
<script src="https://cdn.jsdelivr.net/npm/simple-scrollbar@latest/simple-scrollbar.min.js"></script>
```

### CommonJS

```js
const SimpleScrollbar = require('simple-scrollbar');
require('simple-scrollbar/simple-scrollbar.css')
```

### ES2015 modules

```js
import SimpleScrollbar from 'simple-scrollbar'
import 'simple-scrollbar/simple-scrollbar.css'
```

### Auto-binding
Include the attribute `ss-container` in any `<div>` that you want to make scrollable, and the library will turn it for you

```HTML
<div ss-container>One</div>
<div ss-container>
  <span>Two</span>
</div>
```

### Manual binding
If you want to manually turn your div in a SimpleScrollbar, you can use the `SimpleScrollbar.initEl` method.

```HTML
<div class="myClass"></div>

<script>
  var el = document.querySelector('.myClass');
  SimpleScrollbar.initEl(el);
</script>
```

### Dynamically added content
If you use some client Framework, like Angular, Aurelia, etc - or any library that includes DOMElements dynamically in your app, and you want to use the SimpleScrollbar `ss-container` attribute, you can use the `SimpleScrollbar.initAll` method, and it will turn all the elements with that attribute in a scrollable one for you.

```Javascript
var div = document.createElement('div');
div.insertAdjacentHTML('afterbegin', '<span>One</span>');
div.setAttribute('ss-container', true);

var otherDiv = div.cloneNode(true);
otherDiv.querySelector('span').textContent = 'Two';

document.body.appendChild(div);
document.body.appendChild(otherDiv);

SimpleScrollbar.initAll();
```


### RTL Support

Add `direction: rtl;` to your `<div>`'s CSS, and SimpleScrollbar will detect the direction automatically.

## Credits
Inspired by yairEO's jQuery plugin ([fakescroll](https://github.com/yairEO/fakescroll))
