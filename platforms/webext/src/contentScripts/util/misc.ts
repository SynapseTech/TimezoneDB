import { ZoneInfo } from '~/types/api';
import dateFormat from 'dateformat';
import { defaults, ExtensionSettings } from '~/types/settings';

export function adjustForTimezone(d: Date, offset: number): Date {
	const date = d.toISOString();
	const targetTime = new Date(date);
	const tzDifference = offset + targetTime.getTimezoneOffset() * 60;
	// convert the offset to milliseconds, add to targetTime, and return a new Date
	return new Date(targetTime.getTime() + tzDifference * 1000);
}

export async function formatTimezone(
	zone: ZoneInfo,
	includeCurrent = false,
): Promise<string> {
	let result = zone.id;

	const extensionSettings: ExtensionSettings = (
		await browser.storage.sync.get({
			settings: defaults,
		})
	).settings as ExtensionSettings;
	const timeFormat = extensionSettings.timeFormat;

	if (includeCurrent) {
		const date = adjustForTimezone(new Date(), zone.offset);
		result += ` (Currently ${dateFormat(date, timeFormat)})`;
	}

	return result;
}
