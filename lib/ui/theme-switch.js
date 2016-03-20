import domUtil from '../util/dom';

/*
 * Theme Switch module
 *
 * Controls the behaviour of theme switch for night / day
 */

var switches = document.querySelectorAll('[theme-switch]'),
    night = false;

export default { init };

/*
 * Initialise module - Bind switch clicks if any, update state
 */
function init() {
    switches = Array.prototype.slice.call(switches);

    if (!switches.length) { return; }

    switches.forEach((el) => {
        el.addEventListener('mousedown', toggle);
        el.addEventListener('touchstart', toggle);
    });

    update();
}

/*
 * Toggle night / day state
 *
 * @param {Event=} e
 */
function toggle(e = null) {
    if (e) {
        event.stopPropagation();
        event.preventDefault();
    }

    night = !night;
    update();
}

/*
 * Update classnames according to current state
 */
function update() {
    domUtil.toggleClass(document.body, 'night', night);

    switches.forEach((el) => {
        domUtil.toggleClass(el, 'on', night);
    });
}