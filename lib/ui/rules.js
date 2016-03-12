/*
 * UI Rules
 *
 * Module that initialises and maintains UI element's rules by triggering
 * functions (Hooks) for configured selectors when certain DOM events are
 * triggered
 */

var y = 0,
    rules = {},
    MOBILE_BREAK = 600;

// Full height sections rule
rules['[full-height]'] = {

    resize(el) {
        var windowHeight = window.innerHeight,
            paddingTop;

        el.style.height = '';
        el.style.paddingTop = el.style.paddingBottom = 0;

        var height = el.offsetHeight;

        if (height < windowHeight) {
            paddingTop = (windowHeight - height) / 2;
            el.style.paddingTop = paddingTop + 'px';
            el.style.paddingBottom = paddingTop + 'px';
        } else {
            el.removeAttribute('style');
        }
    }

};

/*
 * Initialise UI rules
 */
function init() {
    runHook('init');

    window.addEventListener('scroll', () => {
        runHook('scroll');
    });

    window.addEventListener('resize', () => {
        runHook('resize');
    });

    runHook('resize');
    runHook('scroll');
}

/*
 * Run specific UI rule's hook
 *
 * @param {Object} hook
 */
function runHook(hook) {
    var windowWidth = window.innerWidth,
        selector, fn, el, elements, i, hooks;

    y = document.body.scrollTop;

    for (selector in rules) {
        if (!rules.hasOwnProperty(selector)) { continue; }

        hooks = rules[selector];
        fn = hooks[hook];

        if (!fn) { continue; }

        elements = document.querySelectorAll(selector);

        for (i = 0; i < elements.length; i++) {
            el = elements[i];

            if (windowWidth > MOBILE_BREAK) {
                fn.call(hooks, el);
            } else {
                resetElement(el);
            }
        }
    }
}

/*
 * Reset element's style
 *
 * @param {DOMElement} el
 */
function resetElement(el) {
    if (el.getAttribute('style')) {
        el.removeAttribute('style');
    }
}

export default { init };