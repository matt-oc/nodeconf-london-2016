/*
 * UI Rules
 *
 * Module that initialises and maintains UI element's rules by triggering
 * functions (Hooks) for configured selectors when certain DOM events are
 * triggered
 */

var sections = document.querySelectorAll('section'),
    nav = document.querySelectorAll('ul.nav a'),
    y = 0,
    rules = {},
    NAV_THRESHOLD = 50,
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
 * Generic scrolling behaviours
 */
rules['body'] = {

    scroll() {
        updateFixedHeader();
        updateActiveSection();
    }

};

/*
 * Toggle fix-header class on body
 */
function updateFixedHeader() {
    if (document.body.scrollTop > sections[0].offsetHeight) {
        document.body.className = 'fix-header';
    } else {
        document.body.className = '';
    }
}

/*
 * Update active voice in navigation depending on current scrolled distance
 */
function updateActiveSection() {
    var i, y, current, href;

    if (location.pathname !== '/') { return; }

    for (i = 0; i < sections.length; i++) {
        y = sections[i].offsetTop - NAV_THRESHOLD + sections[i].offsetHeight;

        if (y >= document.body.scrollTop) {
            current = sections[i].id;
            break;
        }
    }

    for (i = 0; i < nav.length; i++) {
        href = nav[i].getAttribute('href');

        if (href === `#${current}` || href === `/#${current}`) {
            nav[i].className = 'active';
        } else {
            nav[i].className = '';
        }
    }
}

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