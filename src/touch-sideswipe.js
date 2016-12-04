/* touchSideSwipe v0.1.0
 * https://github.com/Lucyway/touch-sideswipe
 * MIT license 2016. Author Mititelu Nick (aka freetitelu)
 */
//todo: hamburger
//todo: add in site
//todo: create branch gh-page and gh-site for demo
//todo: init and registrate in npm and bower

(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {define(factory);}
    else if (typeof module === 'object' && module.exports) {module.exports = factory();}
    else {root.TouchSideSwipe = factory();}
}(this, function() {
    var TouchSideSwipe = function(config) {
        'use strict';
        //var TouchSideSwipe = TouchSideSwipe || function(config) {
        var opt = {
            wrappedElementID: config.wrappedElementID || 'touchSideSwipe',
            sideHookWidth: config.sideHookWidth || 10,
        };
        //var tssElemCoordX2;
        var touchmoveCoordXTmp = [];
        var touchstartCoordX;
        var open = false;
        var screenAvailWidth = window.screen.availWidth;
        var tssElemCoordX1;

        var tssElem = document.createElement('div');
        var wrappedElem = document.getElementById(opt.wrappedElementID);

        //wrap elem in touchSideSwipe DOM element
        wrappedElem.parentNode.insertBefore(tssElem, wrappedElem);
        tssElem.appendChild(wrappedElem);

        //define 'width' and display hidden inner DOM-element
        wrappedElem.classList.add('tss_wrapped');
        var wrappedElemWidth;
        if(screenAvailWidth>499){
            wrappedElemWidth = wrappedElem.clientWidth;
        }
        else {
            wrappedElemWidth = screenAvailWidth * 0.8;
        }
        wrappedElem.style.width = wrappedElemWidth + 'px';
        var tssElemWidth = wrappedElemWidth + opt.sideHookWidth;
        //
        tssElem.classList = 'tss tss--close';
        tssElem.style.transform = 'translateX(' + (-wrappedElemWidth) + 'px)';
        tssElem.style.width = tssElemWidth + 'px';

        window.onresize = function() {
            if (open === true) {
                tssClose(tssElem, bgElem);
            }
            screenAvailWidth = window.screen.availWidth;
            if (screenAvailWidth<500){
                wrappedElemWidth = screenAvailWidth * 0.8;
            }
            else{
                wrappedElemWidth = wrappedElem.clientWidth;
            }
            tssElemWidth = wrappedElemWidth + opt.sideHookWidth;
            wrappedElem.style.width = wrappedElemWidth + 'px';
            tssElem.style.transform = 'translateX(' + (-wrappedElemWidth) + 'px)';
            tssElem.style.width = tssElemWidth + 'px';
            console.log(wrappedElemWidth + ' | ' + tssElemWidth);
        };

        //background DOM element
        var bgElem = document.createElement('div');
        document.body.insertBefore(bgElem, document.body.lastChild);
        bgElem.classList = 'tss_bg';

        //------------------------------------------------------------------
        // start touch-event
        //------------------------------------------------------------------
        tssElem.addEventListener(
            'touchstart',
            function(event) {
                /*wrappedElemWidth = wrappedElem.clientWidth;
                tssElemWidth = wrappedElemWidth + opt.sideHookWidth;
                //if (open === false) {
                    tssElem.style.width = tssElemWidth + 'px';
                //}*/

                tssElem.classList.remove('tss--transition');
                //elem.classList.remove('transition');
                bgElem.classList.remove('tss--transition');
                bgElem.style.zIndex = 999;

                var tssElemCoord = tssElem.getBoundingClientRect();
                //tssElemCoordX1 = box.left + pageXOffset;
                tssElemCoordX1 = tssElemCoord.left;
                touchstartCoordX = event.touches[0].pageX;
            },
            false
        );
        //------------------------------------------------------------------
        // Drag element
        //------------------------------------------------------------------
        tssElem.addEventListener(
            'touchmove',
            function(event) {
                event.preventDefault();

                var touchMoveCoordX = event.touches[0].pageX;
                var touchmoveCoordX1 = touchMoveCoordX - (touchstartCoordX - tssElemCoordX1);
                if (touchmoveCoordX1 < 0) {
                    tssElem.style.transform = 'translateX(' + touchmoveCoordX1 + 'px)';
                    var bgElemOpacity = touchMoveCoordX / wrappedElemWidth;
                    if (bgElemOpacity > 0 && bgElemOpacity < 1) {
                        if (bgElemOpacity >= 0.8) {
                            bgElem.style.opacity = 0.8
                        } else {
                            bgElem.style.opacity = bgElemOpacity
                        }
                    };
                    if (touchMoveCoordX > wrappedElemWidth) {
                        wrappedElem.style.transform = 'translateX(' + (-touchmoveCoordX1) + 'px)';
                        bgElem.style.opacity = 0.8;
                    }
                }
                //remember swipe vector
                touchmoveCoordXTmp.push(event.touches[0].pageX);
            },
            false
        );
        //------------------------------------------------------------------
        // end touch-event
        //------------------------------------------------------------------
        function tssOpen(tssElem, bgElem) {
            open = true;
            tssElem.classList.remove('tss--close');
            tssElem.classList.add('tss--open');
            bgElem.classList.remove('tss_bg--close');
            bgElem.classList.add('tss_bg--open');
        }

        function tssClose(tssElem, bgElem) {
            open = false;
            tssElem.classList.remove('tss--open');
            tssElem.classList.add('tss--close');
            bgElem.classList.remove('tss_bg--open');
            bgElem.classList.add('tss_bg--close');
        }
        /*tssElem.addEventListener(
            'touchend',
            function end(event) {

            },
            false
        );*/
        tssElem.addEventListener(
            'touchend',
            function(event) {
                
                tssElem.classList.add('tss--transition');

                //elem.classList.add('transition');
                wrappedElem.style.transform = '';
                //elem.classList.add('transition');
                bgElem.style.opacity = '';
                bgElem.classList.add('tss--transition');
                bgElem.style.zIndex = '';
                var touchendX = touchmoveCoordXTmp[touchmoveCoordXTmp.length - 1];
                var touchendXBefore = touchmoveCoordXTmp[touchmoveCoordXTmp.length - 2];
                if (Math.abs(touchendX - touchendXBefore) > 0) {
                    if (touchendX > touchendXBefore) {
                        tssOpen(tssElem, bgElem);
                        tssElem.style.width = screenAvailWidth + 'px';
                        tssElem.style.transform = 'translateX(0px)';
                    } else {
                        tssClose(tssElem, bgElem);
                        tssElem.style.width = tssElemWidth + 'px';
                        tssElem.style.transform = 'translateX(' + (-wrappedElemWidth) + 'px)';
                    }
                }
                touchmoveCoordXTmp = [];
            },
            false
        );
    };
    return TouchSideSwipe;
}));