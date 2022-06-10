import { ZoneInfo } from '~/types/api';
import dateFormat from 'dateformat';

export function adjustForTimezone(d: Date, offset: number): Date {
    const date = d.toISOString();
    const targetTime = new Date(date);
    const tzDifference = offset + targetTime.getTimezoneOffset() * 60;
    // convert the offset to milliseconds, add to targetTime, and return a new Date
    return new Date(targetTime.getTime() + tzDifference * 1000);
}

export function formatTimezone(zone: ZoneInfo, includeCurrent = false): string {
    let result = zone.id

    if (includeCurrent) {
        const date = adjustForTimezone(new Date(), zone.offset);
        result += ` (Currently ${dateFormat(date, 'h:MM TT')})`;
    }

    return result;
}