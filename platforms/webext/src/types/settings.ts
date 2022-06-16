export interface ExtensionSettings {
	apiUrl?: string;
	timeFormat?: string;
}

export const defaults: ExtensionSettings = {
	apiUrl: 'https://tzdbapi.synapsetech.dev',
	timeFormat: 'h:MM TT',
};
