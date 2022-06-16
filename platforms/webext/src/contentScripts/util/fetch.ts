import { Account } from '~/types/misc';
import type { ExtensionSettings } from '~/types/settings';
import type { User, ZoneInfo } from '~/types/api';

export async function fetchTimezone(
	accountType: Account,
	id: string,
): Promise<ZoneInfo | 'unspecified'> {
	let extensionSettings: ExtensionSettings = (
		await browser.storage.sync.get({
			settings: {
				apiUrl: 'https://tzdbapi.synapsetech.dev',
			},
		})
	).settings as ExtensionSettings;
	const apiUrl = extensionSettings.apiUrl;

	const res = await fetch(
		`${apiUrl}/v1/users/byPlatform/${accountType}/${id}`,
	);
	if (!res.ok) return 'unspecified';

	const body = (await res.json()) as User;
	return body.timezoneInfo;
}
