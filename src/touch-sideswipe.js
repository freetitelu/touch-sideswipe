/* touchSideSwipe v1.0.0. 2019 (c) Mititelu Nick. MIT license. 
   https://github.com/freetitelu/touch-sideswipe */
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
            elWrapWidth: config.elementWidth || 400, //px
            elWrapMaxWidth: config.elementMaxWidth || 0.8, // *100%
            sideHookWidth: config.sideHookWidth || 24, //px
            moveSpeed: config.moveSpeed || 0.2, //sec
            opacityBackground: config.opacityBackground || 0.8,
            shiftForStart: config.shiftForStart || 50, // px
            windowMaxWidth: config.windowMaxWidth || 1024, // px
            rightMod: config.rightMod || false,
        };
        //------------------------------------------------------------------
        var winInnerWidth = window.innerWidth;
        var touchstartCoordX;
        var touchmoveCoordX;
        var opened;
        var elMainCoordX0;
        var elInit;
        var elMain;
        var elWrap;
        var elLabel;
        var elLabelPic;
        var elWrapWidth;
        var elMainWidth;
        var mod = 1;
        if(opt.rightMod){mod = -1};
        var init = false;

        //------------------------------------------------------------------
        // create, define, customize initial elements and states
        //------------------------------------------------------------------
        function tssInitStates() {
            init = true;
            //-------------------------------
            // create DOM-elements: main-wrapper, sub-wrapper, label
            //-------------------------------
            elInit = document.getElementById(opt.elInitID);
            if(!elInit){console.log('not found ' + opt.elInitID);return false}
            elInit.classList.add('touch-side-swipe');
            elMain = document.createElement('div');
            elWrap = document.createElement('div');
            elLabel = document.createElement('div');
            elLabelPic = document.createElement('div');
            elLabelPic.classList.add('tss-label_pic');
            elLabel.innerHTML = elLabelPic.outerHTML;
            //-------------------------------

            //-------------------------------
            // wrap initial-elem in main in submain
            elMain.appendChild(elWrap);
            elWrap.appendChild(elLabel);
            elInit.parentNode.insertBefore(elMain, elInit);
            elWrap.appendChild(elInit);
            //-------------------------------

            //-------------------------------
            // css classes for customize
            //-------------------------------
            elMain.classList = 'tss';
            if(opt.rightMod){elMain.classList.add('tss--right')}
            elWrap.classList = 'tss-wrap';
            elLabel.classList = 'tss-label';
            //-------------------------------

            //-------------------------------
            // create first style parameters: width and state wrapped DOM-element
            //-------------------------------
            if (winInnerWidth > 499) {
                elWrapWidth = opt.elWrapWidth;
            } else {
                elWrapWidth = winInnerWidth * opt.elWrapMaxWidth;
            }
            elWrap.style.width = elWrapWidth + 'px';
            elMainWidth = elWrapWidth + opt.sideHookWidth;
            elMain.style.transitionDuration = opt.moveSpeed + 's';
            elLabel.style.transitionDuration = opt.moveSpeed + 's';
            //-------------------------------
            tssClose();
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // recalc parameters on resize window
        //------------------------------------------------------------------
        function tssRecalcStates() {
            if (opened) {
                tssClose();
            }
            winInnerWidth = window.innerWidth;
            if (winInnerWidth > 499) {
                elWrapWidth = opt.elWrapWidth;
            } else {
                elWrapWidth = winInnerWidth * opt.elWrapMaxWidth;
            }
            elMainWidth = elWrapWidth + opt.sideHookWidth;
            elWrap.style.width = elWrapWidth + 'px';
            elMain.style.transform = 'translateX(' + (-elWrapWidth) + 'px)';
            elLabel.style.transform = 'translateX(' + (elWrapWidth) + 'px)';
            //elLabelPic
            elMain.style.width = elMainWidth + 'px';
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // start touch-event (use states from tssInitStates, tssRecalcStates)
        //------------------------------------------------------------------
        function tssTouchstart(event) {
            document.body.style.overflowY = 'hidden';
            elMain.style.transitionDuration = '0s';
            elLabel.style.transitionDuration = '0s';
            elMainCoordX0 = elMain.getBoundingClientRect().left;
            touchstartCoordX = event.changedTouches[0].clientX;
            
            if(!opened){
                elLabel.classList.add('tss-label--opened');
            }

        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // Drag element (use states from tssInitStates, tssRecalcStates, tssTouchstart)
        //------------------------------------------------------------------
        function tssTouchmove(event) {
            touchmoveCoordX = event.changedTouches[0].clientX;
            var elMainCoordX0New = touchmoveCoordX - (touchstartCoordX - elMainCoordX0);

            if ((elMainCoordX0New) <= 0) { // swipe touchmove < elWrapWidth
                if (touchstartCoordX > elWrapWidth) { //if opened and touchstart over elSub
                    elMainCoordX0New = elMainCoordX0New + (touchstartCoordX - elWrapWidth);
                }
                if (touchmoveCoordX <= elWrapWidth) {
                    elMain.style.transform = 'translateX(' + elMainCoordX0New + 'px)';
                }
                var elLabelBg = touchmoveCoordX / elWrapWidth;
                if (elLabelBg > 0 && elLabelBg < 1) {
                    if (elLabelBg >= opt.opacityBackground) {
                        elLabel.style.backgroundColor = opt.opacityBackground;
                    } else {
                        elLabel.style.backgroundColor = 'rgba(0, 0, 0, ' + elLabelBg + ')';
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
            if (!opened && touchendCoordX > touchstartCoordX) {
                if (Math.abs(touchstartCoordX - touchendCoordX) > opt.shiftForStart) {
                    tssOpen();
                } else {
                    tssClose();
                }
            } //touchendCoordX!==touchstartCoordX, equal for click event
            else if (!opened && touchendCoordX < touchstartCoordX) { // if not opened and drag move left 
                tssClose();
            }
            else if (opened && (touchendCoordX < touchstartCoordX) && (touchendCoordX <= elWrapWidth)) {
                if ((touchstartCoordX > elWrapWidth) && (touchendCoordX < (elWrapWidth - opt.shiftForStart)) ||
                    (touchstartCoordX < elWrapWidth) && (Math.abs(touchstartCoordX - touchendCoordX) > opt.shiftForStart)) {
                    tssClose();
                } else {
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
            if (!opened) {
                tssOpen();
            } else {
                tssClose();
            }
        }

        //------------------------------------------------------------------


        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // change states on Open
        //------------------------------------------------------------------
        function tssOpen() {
            elMain.style.transitionDuration = opt.moveSpeed + 's';
            elLabel.style.transitionDuration = opt.moveSpeed + 's';
            elLabel.classList.add('tss-label--opened');
            elLabel.style.backgroundColor = 'rgba(0, 0, 0, ' + opt.opacityBackground + ')';
            elMain.style.width = winInnerWidth + 'px';
            elMain.style.transform = 'translateX(0px)';
            elMain.classList.add('tss--opened');
            opened = true;
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // change states on Close
        //------------------------------------------------------------------
        function tssClose() {
            elMain.style.transitionDuration = opt.moveSpeed + 's';
            elLabel.style.transitionDuration = opt.moveSpeed + 's';
            elLabel.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            if(!opt.rightMod){elLabel.style.transform = 'translateX(' + elWrapWidth + 'px)';}
            else if(opt.rightMod){elLabel.style.transform = 'translateX(0px)';}
            elMain.style.width = elMainWidth + 'px';
            elMain.style.transform = 'translateX(' + -elWrapWidth*mod + 'px)';
            elMain.classList.remove('tss--opened');
            elLabel.classList.remove('tss-label--opened');
            opened = false;
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // tssClear (for large-width windows)
        //------------------------------------------------------------------
        function tssClear() {
            if (elMain != undefined) {
                elMain.parentNode.insertBefore(elInit, elMain);
                elMain.remove();
                init = false;
            }
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // winOnresizeEngine (if change width of window)
        //------------------------------------------------------------------
        function winOnresizeEngine(event) {
            winInnerWidth = window.innerWidth;
            if (winInnerWidth < opt.windowMaxWidth && !init) {
                tssActionsEngine();
            } else if (winInnerWidth >= opt.windowMaxWidth && init) {
                tssClear();
            }
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // set of listeners and states
        //------------------------------------------------------------------
        function tssActionsEngine() {
            if (winInnerWidth < opt.windowMaxWidth && !init) {
                tssInitStates();
                window.addEventListener('resize', tssRecalcStates);
                elMain.addEventListener('touchstart', tssTouchstart);
                elMain.addEventListener('touchmove', tssTouchmove);
                elMain.addEventListener('touchend', tssTouchend);
                elLabel.addEventListener('click', elLabelClick);
            }
            window.addEventListener('resize', winOnresizeEngine);
        }
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // aaaand actioooon!
        //------------------------------------------------------------------
        tssActionsEngine();

        //public functions
        var returnTssOpen;
        var returnTssClose;
        function tssRecalcApi(){// if not mobile window width
            if (winInnerWidth > opt.windowMaxWidth) {
                var returnTssFailed = '(touch-sideswipe) cant use when window inner width > ' + opt.windowMaxWidth + 'px (your actual option windowMaxWidth). Please, add the condition here.';
                returnTssOpen = function(){console.log('tssOpen ' + returnTssFailed )};
                returnTssClose = function(){console.log('tssClose ' + returnTssFailed)};
            }
            else {
                returnTssOpen = tssOpen;
                returnTssClose = tssClose;
            }
        }
        tssRecalcApi();
        window.addEventListener('resize', tssRecalcApi, false);
        
        return {
            tssOpen: returnTssOpen,
            tssClose: returnTssClose
        }

    };
    return TouchSideSwipe;
}));