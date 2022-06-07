import { inject as injectGithub } from './modules/github';

window.addEventListener('load', () => {
    switch (window.location.host) {
        case 'github.com': {
            injectGithub();
            console.log('[TimezoneDB] Loaded GitHub module.')
            break;
        }
    }
});

