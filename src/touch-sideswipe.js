/* touchSideSwipe v0.2.0
 * https://github.com/Lucyway/touch-sideswipe
 * 2016 (c) Mititelu Nick (aka freetitelu). MIT license.
 */
// todo: сделать крестик на лейбл при открытии
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
        //------------------------------------------------------------------
        var opt = { //default options
            elInitID: config.elementID || 'touchSideSwipe',
            elSubmainWidth: config.elementWidth || 400, //px
            elSubmainMaxWidth: config.elementMaxWidth || 0.8, // *100%
            sideHookWidth: config.sideHookWidth || 44, //px
            moveSpeed: config.moveSpeed || 0.2, //sec
            opacityBackground: config.opacityBackground || 0.8,
            shiftForStart: config.shiftForStart || 50, // px
            windowMaxWidth: config.windowMaxWidth || 1024, // px
        };
        //------------------------------------------------------------------
        var winInnerWidth = window.innerWidth;
        var touchstartCoordX;
        var touchmoveCoordX;
        var open;
        var elMainCoordX0;
        var elInit;
        var elMain;
        var elSubmain;
        var elLabel;
        var elBg;
        var elSubmainWidth;
        var elMainWidth;
        var init = false;

        //------------------------------------------------------------------
        // create, define, customize initial elements and states
        //------------------------------------------------------------------
        function tssInitStates() {
            init = true;
            //-------------------------------
            // create DOM-elements: main-wrapper, sub-wrapper, label, background
            //-------------------------------
            elInit = document.getElementById(opt.elInitID);
            elMain = document.createElement('div');
            elSubmain = document.createElement('div');
            elLabel = document.createElement('div');
            elLabel.innerHTML = '<div class="tss-label_pic"></div>';
            elBg = document.createElement('div');
            //-------------------------------
            
            //-------------------------------
            // wrap initial-elem in main in submain, add bg in body
            elMain.appendChild(elSubmain);
            elSubmain.appendChild(elLabel);
            elInit.parentNode.insertBefore(elMain, elInit);
            elSubmain.appendChild(elInit);
            document.body.insertBefore(elBg, document.body.lastChild);
            //-------------------------------

            //-------------------------------
            // css classes for customize
            //-------------------------------
            elMain.classList = 'tss';
            elSubmain.classList = 'tss-wrap';
            elLabel.classList = 'tss-label';
            elBg.classList = 'tss-bg';
            //-------------------------------

            //-------------------------------
            // create first style parameters: width and state wrapped DOM-element
            //-------------------------------
            if (winInnerWidth > 499) {
                elSubmainWidth = opt.elSubmainWidth;
            } else {
                elSubmainWidth = winInnerWidth * opt.elSubmainMaxWidth;
            }
            elSubmain.style.width = elSubmainWidth + 'px';
            elMainWidth = elSubmainWidth + opt.sideHookWidth;
            elMain.style.transitionDuration = opt.moveSpeed + 's';
            elBg.style.transitionDuration = opt.moveSpeed + 's';
            //-------------------------------
            tssClose();
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // recalc parameters on resize window
        //------------------------------------------------------------------
        function tssRecalcStates() {
            if (open === true) {
                tssClose();
            }
            winInnerWidth = window.innerWidth;
            if (winInnerWidth > 499) {
                elSubmainWidth = opt.elSubmainWidth;
            } else {
                elSubmainWidth = winInnerWidth * opt.elSubmainMaxWidth;
            }
            elMainWidth = elSubmainWidth + opt.sideHookWidth;
            elSubmain.style.width = elSubmainWidth + 'px';
            elMain.style.transform = 'translateX(' + (-elSubmainWidth) + 'px)';
            elMain.style.width = elMainWidth + 'px';
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // start touch-event (use states from tssInitStates, tssRecalcStates)
        //------------------------------------------------------------------
        function tssTouchstart(event) {
            document.body.style.overflow = 'hidden';
            elMain.style.transitionDuration = '0s';
            elBg.style.transitionDuration = '0s';
            elBg.style.zIndex = 999;
            elMainCoordX0 = elMain.getBoundingClientRect().left;
            touchstartCoordX = event.changedTouches[0].clientX;
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // Drag element (use states from tssInitStates, tssRecalcStates, tssTouchstart)
        //------------------------------------------------------------------
        function tssTouchmove(event) {
            touchmoveCoordX = event.changedTouches[0].clientX;
            var elMainCoordX0New = touchmoveCoordX - (touchstartCoordX - elMainCoordX0);

            if ((elMainCoordX0New) <= 0){ // swipe touchmove < elSubmainWidth
                if (touchstartCoordX > elSubmainWidth){//if opened and touchstart over elSub
                    elMainCoordX0New = elMainCoordX0New + (touchstartCoordX - elSubmainWidth);
                }
                if(touchmoveCoordX <= elSubmainWidth){
                    elMain.style.transform = 'translateX(' + elMainCoordX0New  + 'px)';
                }
                var elBgOpacity = touchmoveCoordX / elSubmainWidth;
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

        //------------------------------------------------------------------
        // end touch-event (use states from tssInitStates, tssRecalcStates, tssTouchmove)
        //------------------------------------------------------------------
        function tssTouchend(event) {
            var touchendCoordX = event.changedTouches[0].clientX;
            document.body.style.overflow = '';
            elMain.style.transitionDuration = opt.moveSpeed + 's';//todo: перетащить в open/close
            elBg.style.transitionDuration = opt.moveSpeed + 's';
            if (!open && touchendCoordX > touchstartCoordX) {
                if (Math.abs(touchstartCoordX - touchendCoordX) > opt.shiftForStart) {
                    tssOpen();
                }
                else {
                    tssClose();
                }
            }//touchendCoordX!==touchstartCoordX, equal for click event
            else if (open && (touchendCoordX < touchstartCoordX) && (touchendCoordX <= elSubmainWidth)){
                if ((touchstartCoordX > elSubmainWidth) && (touchendCoordX < (elSubmainWidth - opt.shiftForStart)) ||
                    (touchstartCoordX < elSubmainWidth) && (Math.abs(touchstartCoordX - touchendCoordX) > opt.shiftForStart)) {
                    tssClose();
                }
                else {
                    tssOpen();
                }
            }
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // open/close on click label-element
        //------------------------------------------------------------------
        function elLabelClick(event) {
            event.stopPropagation();
            if (open === false) {
                tssOpen();
            } 
            else {
                tssClose();
            }
        }

        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // open/close on click background-element
        //------------------------------------------------------------------
        function elBgClick(event) {
            event.stopPropagation();
            var elMainCoordX0ForClick = elMain.getBoundingClientRect().left;
            if (event.clientX > (elMainCoordX0ForClick + elSubmainWidth)) {
                tssClose();
            }
        }

        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // change states on Open
        //------------------------------------------------------------------
        function tssOpen() {
            elBg.style.opacity = opt.opacityBackground;
            elMain.style.width = winInnerWidth + 'px';
            elMain.style.transform = 'translateX(0px)';
            elMain.classList.remove('tss--close');
            elMain.classList.add('tss--open');
            elBg.classList.remove('tss-bg--close');
            elBg.classList.add('tss-bg--open');
            elBg.style.zIndex = '999';
            open = true;
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // change states on Close
        //------------------------------------------------------------------
        function tssClose() {
            document.body.style.overflow = '';
            elBg.style.opacity = 0;
            elMain.style.width = elMainWidth + 'px';
            elMain.style.transform = 'translateX(' + (-elSubmainWidth) + 'px)';
            elMain.classList.remove('tss--open');
            elMain.classList.add('tss--close');
            elBg.classList.remove('tss-bg--open');
            elBg.classList.add('tss-bg--close');
            elBg.style.zIndex = '-999';
            open = false;
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // tssClear (for large-width windows)
        //------------------------------------------------------------------
        function tssClear() {
            if((elMain && elBg) != undefined){
                elMain.parentNode.insertBefore(elInit, elMain);
                elMain.remove();
                elBg.remove();
                init = false;
            }
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // winOnresizeEngine (if change width of window)
        //------------------------------------------------------------------
        function winOnresizeEngine(event) {
            winInnerWidth = window.innerWidth;
            if(winInnerWidth < 1024 && !init){
                tssActionsEngine();
            }
            else if(winInnerWidth >= 1024 && init){
                tssClear();
            }
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // set of listeners and states
        //------------------------------------------------------------------
        function tssActionsEngine(){
            if(winInnerWidth < 1024 && !init){
                tssInitStates();
                window.addEventListener('resize', tssRecalcStates, false);
                elMain.addEventListener('touchstart', tssTouchstart, false);
                elMain.addEventListener('touchmove', tssTouchmove, false);
                elMain.addEventListener('touchend', tssTouchend, false);
                elMain.addEventListener('click', elBgClick, false);
                elLabel.addEventListener('click', elLabelClick, false);
            }
            window.addEventListener('resize', winOnresizeEngine, false);
        }
        //------------------------------------------------------------------

        tssActionsEngine();
    };
    return TouchSideSwipe;
}));
