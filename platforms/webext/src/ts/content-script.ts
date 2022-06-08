import { inject as injectGithub } from './modules/github';
import { inject as injectTwitter } from './modules/twitter';
import {initReact} from "./util/react";

// window.addEventListener('load', () => {
    initReact();

    switch (window.location.host) {
        case 'github.com': {
            injectGithub();
            console.log('[TimezoneDB] Loaded GitHub module.')
            break;
        }
        case 'twitter.com': {
            injectTwitter();
            console.log('[TimezoneDB] Loaded Twitter module.')
            break;
        }
    }
// });

