window.requestAnimationFrame = setTimeout;
describe('simple scrollbar', function () {
    var viewport;
    var content;
    var testContainer;
    var scheduleNext = setTimeout;
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
            scheduleNext(function () {
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
                scheduleNext(function () {
                    expect(getScrollHandle().offsetParent).toBeTruthy();
                    expect(getScrollHandle().style.top).toBe('0px');
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
            scheduleNext(function () {
                scheduleNext(function () {
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
        describe('when content is invisible at init', function(){
            var styleTag;
            function hideElement(e){
                e.classList.add('hidden');
            }
            function showElement(e){
                e.classList.remove('hidden');
            }
            function verifyScrollbarIsShownAfterContentBecomesVisible(hiddenAncestor, done){
                var config ={ attributes: true, attributeFilter: ['style', 'class'] };
                var visibilityObserver = new MutationObserver(function () {
                    scheduleNext(function () {
                        expect(getScrollHandle().offsetParent).toBeTruthy();
                        expect(getScrollHandle().style.top).toBe('0px');
                        visibilityObserver.disconnect();
                        done();
                    });
                });
                visibilityObserver.observe(hiddenAncestor, config);
            }
            beforeEach(function(){
                styleTag = document.createElement('style');
                styleTag.textContent = '.hidden{display:none;}';
                document.head.appendChild(styleTag);
                content.style.height = '500px';
            });
            afterEach(function(){
                document.head.removeChild(styleTag);
            });
            it('should show scrollbar if content becomes visible', function (done) {
                hideElement(document.body);
                SimpleScrollbar.initEl(viewport);

                verifyScrollbarIsShownAfterContentBecomesVisible(document.body, done);
                
                showElement(document.body);
            });
            it('should observe the outest hidden parent', function (done) {
                hideElement(document.body);
                hideElement(testContainer);
                SimpleScrollbar.initEl(viewport);

                verifyScrollbarIsShownAfterContentBecomesVisible(document.body, done);

                showElement(testContainer);
                scheduleNext(function(){
                    showElement(document.body);
                });
            });
            it('should use the effective style to determine visibility - body', function (done) {
                hideElement(document.body);
                SimpleScrollbar.initEl(viewport);

                verifyScrollbarIsShownAfterContentBecomesVisible(document.body, done);

                showElement(document.body);
            });
            it('should use the effective style to determine visibility - container inside body', function (done) {
                hideElement(testContainer);
                SimpleScrollbar.initEl(viewport);

                verifyScrollbarIsShownAfterContentBecomesVisible(testContainer, done);

                showElement(testContainer);
            });
        });
    });
    describe('when content is taller than viewport', function () {
        var contentHeight = 500;
        var viewportHeight = 100;
        beforeEach(function () {
            viewport.style.height = viewportHeight + 'px';
            content.style.height = contentHeight + 'px';
            SimpleScrollbar.initEl(viewport);
        })
        it('should show scrollbar', function (done) {
            scheduleNext(function () {
                expect(getScrollHandle().offsetParent).toBeTruthy();
                done();
            });
        });
        it('should put the scrollbar at the top', function (done) {
            scheduleNext(function () {
                expect(getScrollHandle().style.top).toBe('0px');
                done();
            });
        });
        it('set height of scrollbar to 20px', function (done) {
            scheduleNext(function () {
                expect(getScrollHandle().style.height).toBe('20px');
                done();
            });
        });
        it('should update scrollbar when content\'s offset top changes', function (done) {
            var scrollTop = 100;
            getScrollContainer().scrollTop = scrollTop;

            scheduleNext(function () {
                var expectedTop = scrollTop / contentHeight * 100;
                expect(getScrollHandle().style.top).toBe(expectedTop + 'px');
                done();
            });
        })
    });
    describe('when the element is a detached node', function () {
        it('should not throw exception', function () {
            var detachedViewport = document.createElement('div')
            
            expect(function () {
                SimpleScrollbar.initEl(detachedViewport);
            }).not.toThrow();
        })
    });
    describe('scroll handle', function () {
        describe('when viewport/content height ratio >= 10px', function () {
            beforeEach(function () {
                viewport.style.height = '200px';
                content.style.height = '800px';

                SimpleScrollbar.initEl(viewport);
            });
            it('should set height to viewportHeight^2/contentHeight', function (done) {
                scheduleNext(function () {
                    expect(getScrollHandle().style.height).toBe(Math.pow(200, 2) / 800 + 'px');
                    done();
                });
            });
            it('should set top to scrollTop/contentHeight*viewportHeight', function (done) {
                getScrollContainer().scrollTop = 600;

                scheduleNext(function () {
                    expect(getScrollHandle().style.top).toBe(600 / 800 * 200 + 'px');
                    done();
                });
            });
        });

        describe('when viewport/content height ratio >= 10px', function () {
            beforeEach(function () {
                viewport.style.height = '200px';
                content.style.height = '4000px';

                SimpleScrollbar.initEl(viewport);
            });
            it('should have minimum 10% of viewport height', function (done) {
                scheduleNext(function () {
                    expect(getScrollHandle().style.height).toBe('20px');
                    done();
                });
            });
            it('should set top to scrollTop/contentHeight*viewportHeight', function (done) {
                getScrollContainer().scrollTop = 3800;

                scheduleNext(function () {
                    expect(getScrollHandle().style.top).toBe('180px');
                    done();
                });
            });
        });
    });
    describe('drag', function () {
        fit('should set scrollTop', function (done) {
            viewport.style.height = '100px';
            content.style.height = '200px';
            SimpleScrollbar.initEl(viewport);
            debugger;
            scheduleNext(function () {
                var mousedown = new MouseEvent('mousedown', {
                    clientY: 0
                });
                getScrollHandle().dispatchEvent(mousedown);
                scheduleNext(function () {
                    var mousemove = new MouseEvent('mousemove', {
                        clientY: 50
                    });
                    document.dispatchEvent(mousemove);
                    scheduleNext(function () {
                        expect(getScrollContainer().scrollTop).toBe(100);
                        done();
                    });
                });
            });
        });
        fit('should adjust scrollTop if scroll handle is set to min heigh', function (done) {
            viewport.style.height = '100px';
            content.style.height = '2000px';
            SimpleScrollbar.initEl(viewport);
            debugger;
            scheduleNext(function () {
                var mousedown = new MouseEvent('mousedown', {
                    clientY: 0
                });
                getScrollHandle().dispatchEvent(mousedown);
                scheduleNext(function () {
                    var mousemove = new MouseEvent('mousemove', {
                        clientY: 90
                    });
                    document.dispatchEvent(mousemove);
                    scheduleNext(function () {
                        expect(getScrollContainer().scrollTop).toBe(1890);
                        done();
                    });
                });
            });
        });
    });
});