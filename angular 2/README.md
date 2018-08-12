# SimpleScrollbar
Very simple vanilla angular 2 component for creating a custom scrollbar cross-browser and cross-devices.

## Demo
http://buzinas.github.io/simple-scrollbar (Javascript library demo)

## Benefits

- Extremely lightweight (less than 1KB after gzip and minify)
- It uses the native scroll events, so:
  - All the events work and are smooth (mouse wheel, space, page down, page up, arrows etc).
  - The performance is awesome!
- No dependencies, completely vanilla Javascript!
- RTL support (thanks to [@BabkinAleksandr](https://github.com/BabkinAleksandr))

## Browser Support

It was developed for evergreen browsers, but it works both on IE10 and IE11 either.

If you want to make it works down to IE9, the only thing you need to do is to add the [classList polyfill](https://github.com/eligrey/classList.js).

```HTML
<!--[if IE 9]><script src="classList.min.js"></script><![endif]-->
```

## Usage

You can import this module into imports property, or you can import the component directly in declarations, eg:
``` js
@NgModule({
    declarations: [
        ...
    ],
    imports: [
        MbScrollModule,
        ...
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

### HTML files
You just need to add mb-scroll component as a atribiute or tag

```HTML
<div mb-scroll>
    <!-- Your HTML code -->
</div>
```
