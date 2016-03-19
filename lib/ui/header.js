import config from '../config';
import domUtil from '../util/dom';

/*
 * Header module
 *
 * Controls header / nav behaviour on mobile
 */

export default { init, toggle };

var DRAG_AREA = 100,
    DRAGGING_CLASSNAME = 'dragging',
    OPEN_CLASSNAME = 'open',
    SNAP_THRESHOLD_PERCENT = 20,
    CSS_PREFIXES = [ '', '-webkit-', '-moz-', '-o-', '-ms-' ],
    dragging = false,
    header = document.querySelector('[data-header]'),
    nav = document.querySelector('[data-navigation]'),
    navToggle = document.querySelector('[data-navigation-toggle]'),
    offset = 0,
    isOpen = false,
    firstMove, initialOffset, pageWidth, dragStart, enabled;

/*
 * Initialise header behaviour, bind DOM events
 */
function init() {
    resize();
    navToggle.addEventListener('mousedown', toggle);
    navToggle.addEventListener('touchstart', toggle);
    window.addEventListener('touchstart', touchStart);
    window.addEventListener('touchend', touchEnd);
    window.addEventListener('touchmove', touchMove);
    window.addEventListener('resize', resize);
    window.addEventListener('hashchange', () => { setOpen(false); });
}

/*
 * Toggle open state
 * @param {Boolean=} state
 */
function toggle(state = null) {
    var event;

    if (state instanceof Event) {
        event = state;
        state = null;
        event.stopPropagation();
        event.preventDefault();
    }

    state = typeof state === 'boolean' ? state : !isOpen;

    setOpen(state);
}

/*
 * Set navigation open state, reset styles and toggle open class
 *
 * @param {Boolean} state
 */
function setOpen(state) {
    isOpen = !!state;
    reset();
}

/*
 * Start dragging if within threshold on a single touch
 *
 * @param {TouchEvent} e
 */
function touchStart(e) {
    var isSingle = e.touches.length === 1,
        inArea = e.touches[0].pageX < DRAG_AREA;

    if (isTouchElementRec(e.target)) {
        return;
    }

    if (!dragging && isSingle && (inArea || isOpen)) {
        initialOffset = isOpen ? pageWidth : 0;
        dragStart = e.touches[0].pageX;
        dragging = true;
        firstMove = true;
        domUtil.addClass(nav, DRAGGING_CLASSNAME);
    }
}

/*
 * Recursively detect if element or an element's parent has the attribute
 * `data-touch-element` set to prevent behaviour interferences with other
 * touch components
 *
 * @param {TouchEvent} e
 */
function isTouchElementRec(element) {
    if (element.hasAttribute('data-touch-element')) { return true; }

    if (element.parentElement && element.parentElement !== document.body) {
        return isTouchElementRec(element.parentElement);
    }

    return false;
}

/*
 * Stop dragging if drag state is on
 */
function touchEnd() {
    var snap,
        snapThreshold = (pageWidth * SNAP_THRESHOLD_PERCENT) / 100;

    if (!dragging) { return; }

    dragging = false;
    domUtil.removeClass(nav, DRAGGING_CLASSNAME);

    snap = Math.abs(offset) >= snapThreshold;

    if (snap) {
        setOpen(!isOpen);
    } else {
        reset();
    }
}

/*
 * Set offset from touch position on touch move
 *
 * @param {TouchEvent} e
 */
function touchMove(e) {
    if (!dragging) { return; }

    if (firstMove) {
        e.preventDefault();
        firstMove = false;
    }

    setOffset(e.touches[0].pageX - dragStart);
}

/*
 * Set navigation offset depending on current drag offset, edit nav CSS
 *
 * @param {Number} val
 */
function setOffset(val) {
    offset = val;

    if (isOpen && offset > 0) {
        offset = 0;
    } else if (!isOpen && offset < 0) {
        offset = 0;
    } else if (!isOpen && offset > pageWidth) {
        offset = pageWidth;
    }

    var transform = 'translateX(' + (initialOffset + offset) + 'px' + ')';

    CSS_PREFIXES.forEach(function (prefix) {
        nav.style[prefix + 'transform'] = transform;
    });
}

/*
 * Update layout variables on resize, close nav and reset if not under mobile
 * breakpoint
 */
function resize() {
    var newState;

    pageWidth = window.innerWidth;
    newState = pageWidth <= config.MOBILE_BREAKPOINT;

    if (enabled !== newState) {
        reset();
        setOpen(false);
    }

    enabled = newState;
}

/*
 * Reset inline styles on nav
 */
function reset() {
    nav.removeAttribute('style');
    offset = 0;
    domUtil.toggleClass(header, OPEN_CLASSNAME, isOpen);
}