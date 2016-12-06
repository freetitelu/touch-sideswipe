/* touchSideSwipe v0.1.2
 * https://github.com/Lucyway/touch-sideswipe
 * 2016 (c) Mititelu Nick (aka freetitelu). MIT license.
 */
// todo: issue закрывается повторном вертикальном при скролле по навбару
// todo: issue закрывается при сдвигу влево по фону
// todo: issue отключать виджет при ресайзе окна и если окно > 1024
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
            elInitID: config.elementID || 'touchSideSwipe',
            elSubMainWidth: config.elementWidth || 400, //px
            elSubMainMaxWidth: config.elementMaxWidth || 0.8, // *100%
            sideHookWidth: config.sideHookWidth || 10, //px
            moveSpeed: config.moveSpeed || 0.2, //sec
            opacityBackground: config.opacityBackground || 0.8,
            shiftForStart: config.shiftForStart || 30, // px
            windowMaxWidth: config.windowMaxWidth || 1024, // px
        };
        //if (window.screen.availWidth >= opt.windowMaxWidth){return false}
        var touchstartCoordX;
        var touchmoveCoordX;
        var open;
        var screenAvailWidth = window.screen.availWidth;
        var elMainCoordX0;

        //------------------------------------------------------------------
        // create DOM-elements: main-wrapper, sub-wrapper, label, background
        //------------------------------------------------------------------
        var elInit = document.getElementById(opt.elInitID);
        var elMain = document.createElement('div');
        var elSubMain = document.createElement('div');
        var elLabel = document.createElement('div');
        var elBg = document.createElement('div');
        
        //------------------------------------------------------------------
        // wrap initial-elem in main in submain, add bg in body
        //------------------------------------------------------------------
        elMain.appendChild(elSubMain);
        elSubMain.appendChild(elLabel);
        elInit.parentNode.insertBefore(elMain, elInit);
        elSubMain.appendChild(elInit);
        document.body.insertBefore(elBg, document.body.lastChild);

        //------------------------------------------------------------------
        // css classes for customize
        //------------------------------------------------------------------
        elMain.classList = 'tss';
        elSubMain.classList = 'tss-wrap';
        elLabel.classList = 'tss-label';
        elBg.classList = 'tss-bg';

        //------------------------------------------------------------------
        // create first style parameters: width and state wrapped DOM-element
        //------------------------------------------------------------------
        var elSubMainWidth;
        if (screenAvailWidth > 499) {
            elSubMainWidth = opt.elSubMainWidth;
        } else {
            elSubMainWidth = screenAvailWidth * opt.elSubMainMaxWidth;
        }
        elSubMain.style.width = elSubMainWidth + 'px';
        var elMainWidth = elSubMainWidth + opt.sideHookWidth;
        elMain.style.transitionDuration = opt.moveSpeed + 's';
        elBg.style.transitionDuration = opt.moveSpeed + 's';
        tssClose();

        //------------------------------------------------------------------
        // recalc parameters on resize window
        //------------------------------------------------------------------
        function tssWinOnresize() {
            if (open === true) {
                tssClose();
            }
            screenAvailWidth = window.screen.availWidth;
            if (screenAvailWidth < 500) {
                elSubMainWidth = screenAvailWidth * elSubMainMaxWidth;
            } else {
                elSubMainWidth = opt.elSubMainWidth;
            }
            elMainWidth = elSubMainWidth + opt.sideHookWidth;
            elSubMain.style.width = elSubMainWidth + 'px';
            elMain.style.transform = 'translateX(' + (-elSubMainWidth) + 'px)';
            elMain.style.width = elMainWidth + 'px';
        }

        //------------------------------------------------------------------
        // start touch-event
        //------------------------------------------------------------------
        function tssTouchstart(event) {
            document.body.style.overflow = 'hidden';
            elMain.style.transitionDuration = '0s';
            elBg.style.transitionDuration = '0s';
            elBg.style.zIndex = 999;
            elMainCoordX0 = elMain.getBoundingClientRect().left;
            touchstartCoordX = event.touches[0].pageX;
        }

        //------------------------------------------------------------------
        // Drag element
        //------------------------------------------------------------------
        function tssTouchmove(event) {
            //event.preventDefault();
            touchmoveCoordX = event.touches[0].pageX;
            var elMainCoordX0New = touchmoveCoordX - (touchstartCoordX - elMainCoordX0);
            if (elMainCoordX0New < 0){
                if (touchstartCoordX > elSubMainWidth){
                    elMainCoordX0New = elMainCoordX0New + (touchstartCoordX - elSubMainWidth);
                }
                if(touchmoveCoordX < elSubMainWidth){
                    elMain.style.transform = 'translateX(' + elMainCoordX0New + 'px)';
                }
                var elBgOpacity = touchmoveCoordX / elSubMainWidth;
                if (elBgOpacity > 0 && elBgOpacity < 1) {
                    if (elBgOpacity >= opt.opacityBackground) {
                        elBg.style.opacity = opt.opacityBackground;
                    } else {
                        elBg.style.opacity = elBgOpacity;
                    }
                }
            }
        }

        //------------------------------------------------------------------
        // end touch-event
        //------------------------------------------------------------------
        function tssTouchend(event) {
            //elMain.style.transform = '';
            document.body.style.overflow = '';
            elSubMain.style.transform = '';
            elMain.style.transitionDuration = opt.moveSpeed + 's';//todo: перетащить в open/close
            elBg.style.transitionDuration = opt.moveSpeed + 's';
                //if(touchmoveCoordX>elSubMainWidth){return false}
                if (Math.abs(touchstartCoordX - touchmoveCoordX) > opt.shiftForStart) {
                    if (touchmoveCoordX > touchstartCoordX) {
                        tssOpen();
                    } else {
                        tssClose();
                    }
                }
                else {
                    if (touchmoveCoordX > touchstartCoordX) {
                        tssClose();
                    } else {
                        tssOpen();
                    }
                }
        }

        //------------------------------------------------------------------
        // open/close on click
        //------------------------------------------------------------------
        function tssClick(event) {
            if (!open) {
                tssOpen();
            } else {
                //click elBg
                if (event.clientX > elSubMainWidth) {
                    tssClose();
                }
            }
        }

        //------------------------------------------------------------------
        // open/close functions
        //------------------------------------------------------------------
        function tssOpen() {
            elBg.style.opacity = opt.opacityBackground;
            elMain.style.width = screenAvailWidth + 'px';
            elMain.style.transform = 'translateX(0px)';
            elMain.classList.remove('tss--close');
            elMain.classList.add('tss--open');
            elBg.classList.remove('tss-bg--close');
            elBg.classList.add('tss-bg--open');
            elBg.style.zIndex = '999';
            open = true;
        }

        function tssClose() {
            document.body.style.overflow = '';
            elBg.style.opacity = 0;
            elMain.style.width = elMainWidth + 'px';
            elMain.style.transform = 'translateX(' + (-elSubMainWidth) + 'px)';
            elMain.classList.remove('tss--open');
            elMain.classList.add('tss--close');
            elBg.classList.remove('tss-bg--open');
            elBg.classList.add('tss-bg--close');
            elBg.style.zIndex = '-999';
            open = false;
        }

        //------------------------------------------------------------------
        // actions
        //------------------------------------------------------------------
        window.onresize = tssWinOnresize;
        elMain.addEventListener('touchstart', tssTouchstart, false);
        elMain.addEventListener('touchmove', tssTouchmove, false);
        elMain.addEventListener('touchend', tssTouchend, false);
        elMain.addEventListener('click', tssClick, false);
    };
    //function tssWinOnresize() {
    //        if (window.screen.availWidth >= opt.windowMaxWidth){return false}
    return TouchSideSwipe;
}));