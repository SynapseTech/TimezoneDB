import { Account } from '~/types/misc';
import type { ExtensionSettings } from '~/types/settings';
import type { User, ZoneInfo } from '~/types/api';
import { defaults } from '~/types/settings';

export async function fetchTimezone(
	accountType: Account,
	id: string,
): Promise<ZoneInfo | 'unspecified'> {
	let extensionSettings: ExtensionSettings = (
		await browser.storage.sync.get({
			settings: defaults,
		})
	).settings as ExtensionSettings;
	const apiUrl = extensionSettings.apiUrl;

	try {
		const res = await fetch(
			`${apiUrl}/v1/users/byPlatform/${accountType}/${id}`,
		);
		if (!res.ok) return 'unspecified';

		const body = (await res.json()) as User;
		return body.timezoneInfo;
	} catch (ignored) {
		return 'unspecified';
	}
}
