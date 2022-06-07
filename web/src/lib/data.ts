export interface ZoneInfo {
    id: string;
    offset: number;
}

export interface User {
    id: number;
    username: string;
    githubId?: number;
    discordId?: number;
    twitterId?: number;
    twitchId?: number;
    timezoneInfo: ZoneInfo;
}