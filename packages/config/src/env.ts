export interface AppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

let config: AppConfig = {
  supabaseUrl: '',
  supabaseAnonKey: '',
};

export function initConfig(values: AppConfig): void {
  config = values;
}

export function getConfig(): AppConfig {
  return config;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}
