# SimpleScrollbar
Very simple vanilla javascript library for creating a custom scrollbar cross-browser and cross-devices.

## Demo
http://buzinas.github.io/simple-scrollbar

## Benefits

- Extremely lightweight (less than 1KB after gzip and minify)
- It uses the native scroll events, so:
  - All the events work and are smooth (mouse wheel, space, page down, page up, arrows etc).
  - The performance is awesome!
- No dependencies, completely vanilla Javascript!

## Browser Support

It was developed for evergreen browsers, but it works both on IE10 and IE11 either.

If you want to make it works down to IE9, the only thing you need to do is to add the [classList polyfill] (https://github.com/eligrey/classList.js).

```HTML
<!--[if IE 9]><script src="classList.min.js"></script><![endif]-->
```

## Usage
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
If you use some client Framework, like AngularJS, Aurelia, CalangoJS, etc - or any library that includes DOMElements dynamically in your app, and you want to use the SimpleScrollbar `ss-container` attribute, you can use the `SimpleScrollbar.initAll` method, and it will turn all the elements with that attribute in a scrollable one for you.

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

## Credits
Inspired by yairEO's jQuery plugin ([fakescroll](https://github.com/yairEO/fakescroll))
