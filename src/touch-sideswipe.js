/* touchSideSwipe v0.1.0
 * http://touchSideSwipe.com
 * Copyright (c) 2016 Mititelu Nick
 * Released under the MIT license
 */
//todo: гамбургер и обработка на открытие закрытие
//todo: разобраться с размерами бара - ибо неверно вычисляет
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
        //var TouchSideSwipe = TouchSideSwipe || function(config) {
        var opt = {
            wrappedElementID: config.wrappedElementID || 'touchSideSwipe',
            sideHookWidth: config.sideHookWidth || 10,
        };
        var wrappedElem = document.getElementById(opt.wrappedElementID);
        wrappedElem.classList.add('tss_wrapped');
        var wrappedElemWidth = wrappedElem.offsetWidth;
        var tssElemWidth = wrappedElemWidth + opt.sideHook;
        var coordX1;
        var coordX2;
        var touchmoveXTmp = [];
        var touchstartX;
        var open = false;
        var screenAvailWidth;
        //wrap elem in touchSideSwipe DOM element
        var tssElem = document.createElement('div');
        wrappedElem.parentNode.insertBefore(tssElem, wrappedElem);
        tssElem.appendChild(wrappedElem);
        tssElem.classList = 'tss tss--close';
        var bgElem = document.createElement('div');
        document.body.insertBefore(bgElem, document.body.lastChild);
        bgElem.classList = 'tss_bg';
        //------------------------------------------------------------------
        // start touch-event
        //------------------------------------------------------------------
        tssElem.addEventListener(
            'touchstart',
            function(event) {
                tssElem.classList.remove('tss--transition');
                //elem.classList.remove('transition');
                bgElem.classList.remove('tss--transition');
                bgElem.style.zIndex = 999;
                var box = tssElem.getBoundingClientRect();
                //coordX1 = box.left + pageXOffset;
                //coordX2 = box.left + pageXOffset + tssElemWidth;
                coordX1 = box.left;
                coordX2 = box.left + tssElemWidth;
                touchstartX = event.touches[0].pageX;
                screenAvailWidth = window.screen.availWidth;
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
                var touchmoveX = event.touches[0].pageX;
                var touchmoveCoordX1 = touchmoveX - (touchstartX - coordX1);
                if (open === true) {
                    coordX2 = screenAvailWidth;
                }
                //var touchmoveCoordX2 = touchmoveX + (coordX2 - touchstartX);
                if (touchmoveCoordX1 < 0) {
                    tssElem.style.transform = 'translateX(' + touchmoveCoordX1 + 'px)';
                    var bgElemOpacity = touchmoveX / wrappedElemWidth;
                    if (bgElemOpacity > 0 && bgElemOpacity < 1) {
                        if (bgElemOpacity>=0.8) { bgElem.style.opacity = 0.8 }
                        else { bgElem.style.opacity = bgElemOpacity }
                    };
                    if (touchmoveX > wrappedElemWidth) {
                        wrappedElem.style.transform = 'translateX(' + (-touchmoveCoordX1) + 'px)';
                        bgElem.style.opacity = 0.8;
                    }
                }
                //remember swipe direction
                touchmoveXTmp.push(event.touches[0].pageX);
            },
            false
        );
        //------------------------------------------------------------------
        // end touch-event
        //------------------------------------------------------------------
        function tssOpen(tssElem, bgElem) {
            tssElem.classList.remove('tss--close');
            tssElem.classList.add('tss--open');
            bgElem.classList.remove('tss_bg--close');
            bgElem.classList.add('tss_bg--open');
        }

        function tssClose(tssElem, bgElem) {
            tssElem.classList.remove('tss--open');
            tssElem.classList.add('tss--close');
            bgElem.classList.remove('tss_bg--open');
            bgElem.classList.add('tss_bg--close');
        }
        tssElem.addEventListener(
            'touchend',
            function end(event) {

            },
            false
        );
        tssElem.addEventListener(
            'touchend',
            function(event) {
                tssElem.style.transform = '';
                tssElem.classList.add('tss--transition');

                //elem.classList.add('transition');
                wrappedElem.style.transform = '';
                //elem.classList.add('transition');
                bgElem.style.opacity = '';
                bgElem.classList.add('tss--transition');
                bgElem.style.zIndex = '';
                var touchendX = touchmoveXTmp[touchmoveXTmp.length - 1];
                var touchendXBefore = touchmoveXTmp[touchmoveXTmp.length - 2];
                if (Math.abs(touchendX - touchendXBefore) > 0) {
                    if (touchendX > touchendXBefore) {
                        open = true;
                        tssOpen(tssElem, bgElem);
                    } else {
                        open = false;
                        tssClose(tssElem, bgElem);
                    }
                }
                touchmoveXTmp = [];
            },
            false
        );
    };
    return TouchSideSwipe;
}));