export interface ZoneInfo {
    id: string;
    offset: number;
}

export interface User {
    id: number;
    username: string;
    githubId?: number;
    discordId?: number;
    timezoneInfo: ZoneInfo;
}