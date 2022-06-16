import { inject as injectGithub } from './modules/github';
import { inject as injectTwitter } from './modules/twitter';
import { inject as injectTwitch } from './modules/twitch';
import { inject as injectDiscord } from './modules/discord';
import { initReact } from './util/react';

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(async () => {
	initReact();

	switch (window.location.host) {
		case 'github.com':
			await injectGithub();
			console.log('[TimezoneDB] Loaded GitHub module.');
			break;
		case 'twitter.com':
			await injectTwitter();
			console.log('[TimezoneDB] Loaded Twitter module.');
			break;
		case 'canary.discord.com':
		case 'discord.com':
		case 'ptb.discord.com':
			injectDiscord();
			console.log('[TimezoneDB] Loaded Discord module.');
			break;
		case 'www.twitch.tv':
			injectTwitch();
			console.log('[TimezoneDB] Loaded Twitch module.');
			break;
	}
})();
