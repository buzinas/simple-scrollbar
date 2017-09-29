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
    function getScrollHandle() {
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
                expect(getScrollHandle().offsetParent).toBeFalsy();
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
            var config = { attributes: true, childList: false, characterData: false, subtree: false, attributeFilter: ["style"] };
            var scrollHandle = getScrollHandle();
            var scrollHandleObserver = new MutationObserver(function (visibilityMutations) {
                setTimeout(function () {
                    expect(getScrollHandle().offsetParent).toBeTruthy();
                    expect(getScrollHandle().style.top).toBe('0%');
                    done();
                });
            });
            scrollHandleObserver.observe(scrollHandle, config);
        });
        function testDebounce(ms, expectedCallCount, done) {
            SimpleScrollbar.initEl(viewport);
            var config = { attributes: true, childList: false, characterData: false, subtree: false, attributeFilter: ["style"] };
            var scrollHandle = getScrollHandle();
            var scrollHandleMutationSpy = jasmine.createSpy("mutaion spy");
            (new MutationObserver(scrollHandleMutationSpy)).observe(scrollHandle, config);
            content.style.height = '500px';
            content.style.height = '600px';
            content.style.height = '700px';
            setTimeout(function () {
                setTimeout(function () {
                    expect(scrollHandleMutationSpy).toHaveBeenCalledTimes(expectedCallCount);
                    done();
                });
            }, ms);
        }
        it('should debounce scrollbar update by 200ms', function (done) {
            testDebounce(201, 1, done);
        });
        it('before debounce timeout scrollbar update should not happen', function (done) {
            testDebounce(200, 0, done);
        });
        it('should show scrollbar if content becomes visible after init', function (done) {
            document.body.style.display = 'none';
            content.style.height = '500px';
            SimpleScrollbar.initEl(viewport);
            var config = { attributes: true, childList: false, characterData: false, subtree: false, attributeFilter: ["style"] };
            var visibilityObserver = new MutationObserver(function () {
                setTimeout(function () {
                    expect(getScrollHandle().offsetParent).toBeTruthy();
                    expect(getScrollHandle().style.top).toBe('0%');
                    visibilityObserver.disconnect();
                    done();
                });
            });
            visibilityObserver.observe(document.body, config);

            document.body.style.display = 'block';
        });
        it('should observe the outest hidden parent', function (done) {
            document.body.style.display = 'none';
            testContainer.style.display = 'none';
            content.style.height = '500px';
            SimpleScrollbar.initEl(viewport);
            var config = { attributes: true, childList: false, characterData: false, subtree: false, attributeFilter: ["style"] };
            var visibilityObserver = new MutationObserver(function () {
                setTimeout(function () {
                    expect(getScrollHandle().offsetParent).toBeTruthy();
                    expect(getScrollHandle().style.top).toBe('0%');
                    visibilityObserver.disconnect();
                    done();
                });
            }, 2);
            visibilityObserver.observe(document.body, config);

            testContainer.style.display = 'block';
            setTimeout(function(){
                document.body.style.display = 'block';
            }, 1);
        });
        it('should use the effective style to determine visibility', function (done) {
            var style = document.createElement('style');
            style.textContent = '.hidden{display:none;}';
            document.head.appendChild(style);
            document.body.classList.add('hidden');
            content.style.height = '500px';
            SimpleScrollbar.initEl(viewport);
            var config = { attributes: true, attributeFilter: ["class"], childList: false, characterData: false, subtree: false };
            var visibilityObserver = new MutationObserver(function () {
                setTimeout(function () {
                    expect(getScrollHandle().offsetParent).toBeTruthy();
                    expect(getScrollHandle().style.top).toBe('0%');
                    visibilityObserver.disconnect();
                    done();
                });
            });
            visibilityObserver.observe(document.body, config);

            document.body.classList.remove('hidden');
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
                expect(getScrollHandle().offsetParent).toBeTruthy();
                done();
            });
        });
        it('should put the scrollbar at the top', function (done) {
            setTimeout(function () {
                expect(getScrollHandle().style.top).toBe('0%');
                done();
            });
        });
        it('set height of scrollbar to 20%', function (done) {
            setTimeout(function () {
                expect(getScrollHandle().style.height).toBe('20%');
                done();
            });
        });
        it('should update scrollbar when content\'s offset top changes', function (done) {
            var scrollTop = 100;
            getScrollContainer().scrollTop = scrollTop;

            setTimeout(function () {
                var expectedTop = scrollTop / contentHeight * 100;
                expect(getScrollHandle().style.top).toBe(expectedTop + '%');
                done();
            });
        })
    });
});