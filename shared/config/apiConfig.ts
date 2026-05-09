export interface AppConfig {
	apiUrl: string;
}

let _config: AppConfig | null = null;

export function setAppConfig(config: AppConfig) {
	_config = config;
}

export function getAppConfig() {
	if (!_config) throw new Error("Config not initialized!");
  	return _config;
}
