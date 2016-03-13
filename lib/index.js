import UIRules from './ui/rules';

/*
 * Index module
 *
 * Import and initialises all other modules that are needed to run the app
 */

// Initialise UI rules
UIRules.init();

window.addEventListener('load', () => {
    UIRules.init();
});