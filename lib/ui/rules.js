import config from '../config';
import domUtil from '../util/dom';

/*
 * UI Rules
 *
 * Module that initialises and maintains UI element's rules by triggering
 * functions (Hooks) for configured selectors when certain DOM events are
 * triggered
 */

export default { init };

var MAX_PADDING = 400,
    SCROLL_DELAY = 3000,
    sections = document.querySelectorAll('section'),
    nav = document.querySelectorAll('ul.nav a'),
    y = 0,
    rules = {};

rules['.scroll-pointer'] = {

    init(el) {
        setTimeout(() => {
            domUtil.addClass(el, 'show');
        }, SCROLL_DELAY);
    }

}

// Full height sections rule
rules['[full-height]'] = {

    resize(el) {
        var windowHeight = window.innerHeight,
            padding;

        el.style.height = '';
        el.style.paddingTop = el.style.paddingBottom = 0;

        var height = el.offsetHeight;

        if (height < windowHeight) {
            padding = (windowHeight - height) / 2;

            if (padding > MAX_PADDING) {
                padding = MAX_PADDING;
            }

            el.style.paddingTop = padding + 'px';
            el.style.paddingBottom = padding + 'px';
        } else {
            el.removeAttribute('style');
        }
    }

};

/*
 * Generic scrolling behaviours
 */
rules['body'] = {

    // Convert node lists for sections and nav to arrays and concatenate to 
    // provide full Array or elements to reset when switching to mobile layout
    clear : Array.prototype.slice.call(sections).concat(Array.prototype.slice.call(nav)),

    scroll() {
        updateFixedHeader();
        updateActiveSection();
    }

};

/*
 * Toggle fix-header class on body
 */
function updateFixedHeader() {
    domUtil.toggleClass(document.body, 'fix-header', document.body.scrollTop > sections[0].offsetHeight);
}

/*
 * Update active voice in navigation depending on current scrolled distance
 */
function updateActiveSection() {
    var i, y, current, href;

    if (location.pathname !== '/') {
        var link = document.querySelector(`[href="${location.pathname}"]`);

        if (link) {
            domUtil.addClass(link, 'active');
        }

        return;
    }

    for (i = 0; i < sections.length; i++) {
        y = sections[i].offsetTop - config.NAV_THRESHOLD + sections[i].offsetHeight;

        if (y >= document.body.scrollTop) {
            current = sections[i].id;
            break;
        }
    }

    for (i = 0; i < nav.length; i++) {
        href = nav[i].getAttribute('href');
        domUtil.toggleClass(nav[i], 'active', href === `#${current}` || href === `/#${current}`);
    }
}

/*
 * Initialise UI rules
 */
function init() {
    runHook('init');

    window.addEventListener('load', () => {
        runHook('resize');
        runHook('scroll');
    });

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
        selector, fn, el, elements, i, hooks, n;

    y = document.body.scrollTop;

    for (selector in rules) {
        if (!rules.hasOwnProperty(selector)) { continue; }

        hooks = rules[selector];
        fn = hooks[hook];

        if (!fn) { continue; }

        elements = document.querySelectorAll(selector);

        for (i = 0; i < elements.length; i++) {
            el = elements[i];

            if (windowWidth > config.MOBILE_BREAKPOINT) {
                fn.call(hooks, el);
            } else {
                resetElement(el);

                if (rules[selector].clear) {
                    for (n = 0; n < rules[selector].clear.length; n++) {
                        resetElement(rules[selector].clear[n]);
                    }
                }
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