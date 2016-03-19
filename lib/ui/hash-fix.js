/*
 * Hash fix module
 *
 * In order to fix the issue of browser going to hash location before the 
 * resizes from uiRules modules happened, this repeats the action one tick 
 * after page load
 */

export default { init };

/*
 * Bind update to window load event
 */
function init() {
    window.addEventListener('load', update);
}

/*
 * Snap to current hash location
 */
function update() {
    if (!location.hash) { return; }

    var snapToElement = document.querySelector(location.hash);

    if (!snapToElement) { return; }

    setTimeout(() => {
        window.scrollTo(window.scrollLeft, snapToElement.offsetTop);
    });
}