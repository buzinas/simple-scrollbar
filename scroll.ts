import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: '[mb-scroll]',
    templateUrl: './scroll.html',
    styleUrls: ['./scroll.scss']
})
export class MbScroll implements AfterViewInit {
    private readonly raf;
    private el;
    private scrollRatio;
    private direction;
    private target;
    private bar;
    private lastPageY;

    @ViewChild('bar') _bar: ElementRef;
    @ViewChild('container') container: ElementRef;

    constructor(private elementRef: ElementRef) {
        this.raf = window.requestAnimationFrame || window.setImmediate || function(c) { return setTimeout(c, 0); };
    }

    ngAfterViewInit() {
        this.init(this.elementRef.nativeElement);
    }
    private init(el) {
        this.target = el;

        this.direction = window.getComputedStyle(this.target).direction;

        this.bar = this._bar.nativeElement;


        this.el = this.container.nativeElement;

        if (this.direction === 'rtl') {
            this.el.classList.add('rtl');
        }




        // this.target.insertAdjacentHTML('beforeend', this.bar);
        // this.bar = this.target.lastChild;

        this.dragDealer();
        this.moveBar();

        window.addEventListener('resize', this.moveBar);
        this.el.addEventListener('scroll', this.moveBar);
        this.el.addEventListener('mouseenter', this.moveBar);


        const css = window.getComputedStyle(el);
        if (css['height'] === '0px' && css['max-height'] !== '0px') {
            el.style.height = css['max-height'];
        }
    }

    // Mouse drag handler
    private dragDealer() {
        this.lastPageY = 0;

        this.bar.addEventListener('mousedown', (e) => {
            this.lastPageY = e.pageY;
            this.bar.classList.add('ss-grabbed');
            document.body.classList.add('ss-grabbed');

            document.addEventListener('mousemove', this.drag);
            document.addEventListener('mouseup', this.stop);

            return false;
        });
    }

    drag = (e) => {
        const delta = e.pageY - this.lastPageY;
        this.lastPageY = e.pageY;

        this.raf(() => {
            this.el.scrollTop += delta / this.scrollRatio;
        });
    }

    stop = () => {
        this.bar.classList.remove('ss-grabbed');
        document.body.classList.remove('ss-grabbed');
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.stop);
    }

    private moveBar = () => {
        const totalHeight = this.el.scrollHeight,
            ownHeight = this.el.clientHeight;

        this.scrollRatio = ownHeight / totalHeight;

        const isRtl = this.direction === 'rtl';

        const right = isRtl ?
            (this.target.clientWidth - this.bar.clientWidth + 18) :
            (this.target.clientWidth - this.bar.clientWidth) * -1;

        this.raf(() => {
            // Hide scrollbar if no scrolling is possible
            if (this.scrollRatio >= 1) {
                this.bar.classList.add('ss-hidden');
            } else {
                this.bar.classList.remove('ss-hidden');
                this.bar.style.cssText = 'height:' + Math.max(this.scrollRatio * 100, 10) +
                    '%; top:' + (this.el.scrollTop / totalHeight ) * 100 + '%;right:' + 0 + 'px;';
            }
        });
    }
}
