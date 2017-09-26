window.requestAnimationFrame = setTimeout;
describe('simple scrollbar', function () {
    var viewport;
    var content;
    var testContainer;
    beforeEach(function () {
        testContainer = document.createElement('div');
        viewport = document.createElement('div');
        content = document.createElement('div');
        content.style.background = '#eee';
        viewport.appendChild(content);
        testContainer.appendChild(viewport);
        document.body.appendChild(testContainer);
    });
    afterEach(function () {
        document.body.removeChild(testContainer);
    })
    function getScrollbar() {
        return viewport.querySelector('.ss-scroll');
    }
    function getScrollContainer() {
        return viewport.querySelector('.ss-content');
    }
    describe('when content is not taller than viewport', function () {
        beforeEach(function () {
            viewport.style.height = '100px';
            content.style.height = '100px';
            SimpleScrollbar.initEl(viewport);
        })
        it('should hide scrollbar', function (done) {
            setTimeout(function () {
                expect(getScrollbar().offsetParent).toBeFalsy();
                done();
            });
        });
    });
    describe('observing content changes', function () {
        beforeEach(function () {
            viewport.style.height = '100px';
            content.style.height = '100px';
        })
        it('should show scrollbar if content height is taller than viewport after init', function (done) {
            SimpleScrollbar.initEl(viewport);

            content.style.height = '500px';

            setTimeout(function () {
                expect(getScrollbar().offsetParent).toBeTruthy();
                expect(getScrollbar().style.top).toBe('0%');
                done();
            });
        });
        it('should show scrollbar if content becomes visible after init', function (done) {
            content.style.height = '500px';
            document.body.style.display = 'none';
            SimpleScrollbar.initEl(viewport);

            setTimeout(function () {
                document.body.style.display = 'block';
                expect(getScrollbar().offsetParent).toBeTruthy();
                expect(getScrollbar().style.top).toBe('0%');
                done();
            });
        });
    })
    describe('when content is taller than viewport', function () {
        var contentHeight = 500;
        var viewportHeight = 100;
        beforeEach(function () {
            viewport.style.height = viewportHeight + 'px';
            content.style.height = contentHeight + 'px';
            SimpleScrollbar.initEl(viewport);
        })
        it('should show scrollbar', function (done) {
            setTimeout(function () {
                expect(getScrollbar().offsetParent).toBeTruthy();
                done();
            });    
        });
        it('should put the scrollbar at the top', function (done) {
            setTimeout(function () {
                expect(getScrollbar().style.top).toBe('0%');
                done();
            });    
        });
        it('set height of scrollbar to 20%', function (done) {
            setTimeout(function () {
                expect(getScrollbar().style.height).toBe('20%');
                done();
            });    
        });
        it('should update scrollbar when content\'s offset top changes', function (done) {
            var scrollTop = 100;
            getScrollContainer().scrollTop = scrollTop;

            setTimeout(function () {
                var expectedTop = scrollTop / contentHeight * 100 ;
                expect(getScrollbar().style.top).toBe(expectedTop + '%');
                done();
            });    
        })
    });
});