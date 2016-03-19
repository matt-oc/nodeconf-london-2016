/*
 * DOM utility module
 *
 * A small module containing utilities to work with the DOM
 */

export default { hasClass, removeClass, addClass, toggleClass };

/*
 * Returns true if element has given className
 *
 * @param {HTMLElement} element
 * @return {Boolean}
 */
function hasClass(element, className) {
    return element.className.split(' ').indexOf(className) !== -1;
}

/*
 * Removes class from element if it currently has it
 *
 * @param {HTMLElement} element
 * @param {String} className
 */
function removeClass(element, className) {
    var classNames = element.className.split(' ');

    if (!hasClass(element, className)) {
        return;
    }

    classNames.splice(classNames.indexOf(classNames), 1);
    element.className = classNames.join(' ');
}

/*
 * Adds class to element if doesn't currently have it
 *
 * @param {HTMLElement} element
 * @param {String} className
 */
function addClass(element, className) {
    if (hasClass(element, className)) {
        return;
    }

    element.className += ' ' + className;
}

/*
 * Toggles class on element - adds it or removes it if a state value is passed
 * depending wether it's truthy of not
 *
 * @param {HTMLElement} element
 * @param {String} className
 * @param {Boolean=} state
 */
function toggleClass(element, className, state) {
    state = typeof state !== 'undefined' ? state : !hasClass(element, className);

    if (state) {
        addClass(element, className);
    } else {
        removeClass(element, className);
    }
}