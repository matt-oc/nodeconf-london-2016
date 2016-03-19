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
    var snapToElement = document.querySelector(location.hash);

    if (!snapToElement) { return; }

    setTimeout(() => {
        window.scrollTo(window.scrollLeft, snapToElement.offsetTop);
    });
}