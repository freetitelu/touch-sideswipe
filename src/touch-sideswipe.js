/* touchSideSwipe v0.1.1
 * https://github.com/Lucyway/touch-sideswipe
 * 2016 (c) Mititelu Nick (aka freetitelu). MIT license.
 */
(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.TouchSideSwipe = factory();
    }
}(this, function() {
    var TouchSideSwipe = function(config) {
        'use strict';
        var opt = { //default options
            wrappedElementID: config.elementID || 'touchSideSwipe',
            wrappedElementWidth: config.elementWidth || 400, //px
            wrappedElementMaxWidth: config.elementMaxWidth || 0.8, // *100%
            sideHookWidth: config.sideHookWidth || 10, //px
            moveSpeed: config.moveSpeed || 0.2, //sec
            opacityBackground: config.opacityBackground || 0.8,
        };
        var touchmoveCoordXTmp = [];
        var touchstartCoordX;
        var open = false;
        var screenAvailWidth = window.screen.availWidth;
        var tssElemCoordX0;
        var tssElem = document.createElement('div');
        var wrappedElem = document.getElementById(opt.wrappedElementID);

        //------------------------------------------------------------------
        // wrap elem in touchSideSwipe DOM element
        //------------------------------------------------------------------
        wrappedElem.parentNode.insertBefore(tssElem, wrappedElem);
        tssElem.appendChild(wrappedElem);

        //------------------------------------------------------------------
        // create first parameters: width and state wrapped DOM-element
        //------------------------------------------------------------------
        wrappedElem.classList.add('tss_wrapped');
        var wrappedElemWidth;
        if (screenAvailWidth > 499) {
            wrappedElemWidth = opt.wrappedElementWidth;
        } else {
            wrappedElemWidth = screenAvailWidth * 0.8;
        }
        wrappedElem.style.width = wrappedElemWidth + 'px';
        var tssElemWidth = wrappedElemWidth + opt.sideHookWidth;
        tssElem.classList = 'tss tss--close';
        tssElem.style.transform = 'translateX(' + (-wrappedElemWidth) + 'px)';
        tssElem.style.width = tssElemWidth + 'px';

        //------------------------------------------------------------------
        // recalc parameters on resize window
        //------------------------------------------------------------------
        function tssWinOnresize() {
            if (open === true) {
                tssClose(tssElem, bgElem);
            }
            screenAvailWidth = window.screen.availWidth;
            if (screenAvailWidth < 500) {
                wrappedElemWidth = screenAvailWidth * 0.8;
            } else {
                wrappedElemWidth = opt.wrappedElementWidth;
            }
            tssElemWidth = wrappedElemWidth + opt.sideHookWidth;
            wrappedElem.style.width = wrappedElemWidth + 'px';
            tssElem.style.transform = 'translateX(' + (-wrappedElemWidth) + 'px)';
            tssElem.style.width = tssElemWidth + 'px';
        }

        //------------------------------------------------------------------
        // create background DOM element
        //------------------------------------------------------------------
        var bgElem = document.createElement('div');
        document.body.insertBefore(bgElem, document.body.lastChild);
        bgElem.classList = 'tss-bg';

        //------------------------------------------------------------------
        // create label DOM element
        //------------------------------------------------------------------
        var labelElem = document.createElement('div');
        wrappedElem.appendChild(labelElem);
        labelElem.classList = 'tss-label';

        //------------------------------------------------------------------
        // start touch-event
        //------------------------------------------------------------------
        function tssTouchstart(event) {
            tssElem.style.transitionDuration = '0s';
            bgElem.style.transitionDuration = '0s';
            bgElem.style.zIndex = 999;
            tssElemCoordX0 = tssElem.getBoundingClientRect().left;
            touchstartCoordX = event.touches[0].pageX;
        }

        //------------------------------------------------------------------
        // Drag element
        //------------------------------------------------------------------
        function tssTouchmove(event) {
            event.preventDefault();
            var touchmoveCoordX = event.touches[0].pageX;
            var tssElemCoordX0New = touchmoveCoordX - (touchstartCoordX - tssElemCoordX0);
            if (tssElemCoordX0New < 0) {
                tssElem.style.transform = 'translateX(' + tssElemCoordX0New + 'px)';
                var bgElemOpacity = touchmoveCoordX / wrappedElemWidth;
                if (bgElemOpacity > 0 && bgElemOpacity < 1) {
                    if (bgElemOpacity >= opt.opacityBackground) {
                        bgElem.style.opacity = opt.opacityBackground;
                    } else {
                        bgElem.style.opacity = bgElemOpacity;
                    }
                }
                if (touchmoveCoordX > wrappedElemWidth) {
                    wrappedElem.style.transform = 'translateX(' + (-tssElemCoordX0New) + 'px)';
                    bgElem.style.opacity = opt.opacityBackground;
                }
            }
            //remember swipe vector
            touchmoveCoordXTmp.push(event.touches[0].pageX);
        }

        //------------------------------------------------------------------
        // end touch-event
        //------------------------------------------------------------------
        function tssTouchend(event) {
            tssElem.style.transitionDuration = opt.moveSpeed + 's';
            bgElem.style.transitionDuration = opt.moveSpeed + 's';
            wrappedElem.style.transform = '';
            var touchendXLast = touchmoveCoordXTmp[touchmoveCoordXTmp.length - 1];
            var touchendXBeforeLast = touchmoveCoordXTmp[touchmoveCoordXTmp.length - 2];
            if (Math.abs(touchendXLast - touchendXBeforeLast) > 0) {
                if (touchendXLast > touchendXBeforeLast) {
                    tssOpen(tssElem, bgElem);
                } else {
                    tssClose(tssElem, bgElem);
                }
            }
            touchmoveCoordXTmp = [];
        }

        //------------------------------------------------------------------
        // open/close on click
        //------------------------------------------------------------------
        function tssClick(event) {
            if (open === false) {
                tssOpen();
            } else {
                //click between the open element and the right side of the window
                if (event.clientX > wrappedElemWidth) {
                    tssClose();
                }
            }
        }

        //------------------------------------------------------------------
        // open/close functions
        //------------------------------------------------------------------
        function tssOpen() {
            bgElem.style.opacity = opt.opacityBackground;
            tssElem.style.width = screenAvailWidth + 'px';
            tssElem.style.transform = 'translateX(0px)';
            tssElem.classList.remove('tss--close');
            tssElem.classList.add('tss--open');
            bgElem.classList.remove('tss-bg--close');
            bgElem.classList.add('tss-bg--open');
            bgElem.style.zIndex = '999';
            open = true;
        }

        function tssClose() {
            bgElem.style.opacity = 0;
            tssElem.style.width = tssElemWidth + 'px';
            tssElem.style.transform = 'translateX(' + (-wrappedElemWidth) + 'px)';
            tssElem.classList.remove('tss--open');
            tssElem.classList.add('tss--close');
            bgElem.classList.remove('tss-bg--open');
            bgElem.classList.add('tss-bg--close');
            bgElem.style.zIndex = '-999';
            open = false;
        }

        //------------------------------------------------------------------
        // actions
        //------------------------------------------------------------------
        window.onresize = tssWinOnresize;
        tssElem.addEventListener('touchstart', tssTouchstart, false);
        tssElem.addEventListener('touchmove', tssTouchmove, false);
        tssElem.addEventListener('touchend', tssTouchend, false);
        tssElem.addEventListener('click', tssClick, false);
    };
    return TouchSideSwipe;
}));