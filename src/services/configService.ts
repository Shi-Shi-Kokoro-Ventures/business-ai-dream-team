
interface ApiConfig {
  googleClassroom: boolean;
  trello: boolean;
  openai: boolean;
  twilio: boolean;
  email: boolean;
}

class ConfigService {
  private static instance: ConfigService;
  private config: ApiConfig | null = null;

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  async checkApiConfiguration(): Promise<ApiConfig> {
    if (this.config) return this.config;

    try {
      // Check which APIs are properly configured by testing their availability
      const checks = await Promise.allSettled([
        this.checkGoogleClassroom(),
        this.checkTrello(),
        this.checkOpenAI(),
        this.checkTwilio(),
        this.checkEmail()
      ]);

      this.config = {
        googleClassroom: checks[0].status === 'fulfilled',
        trello: checks[1].status === 'fulfilled',
        openai: checks[2].status === 'fulfilled',
        twilio: checks[3].status === 'fulfilled',
        email: checks[4].status === 'fulfilled'
      };

      return this.config;
    } catch (error) {
      console.error('Failed to check API configuration:', error);
      return {
        googleClassroom: false,
        trello: false,
        openai: false,
        twilio: false,
        email: false
      };
    }
  }

  private async checkGoogleClassroom(): Promise<boolean> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('google-classroom', {
        body: { agentId: 'config-check', action: 'getCourses' }
      });
      return !error && data?.success;
    } catch {
      return false;
    }
  }

  private async checkTrello(): Promise<boolean> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('trello-integration', {
        body: { agentId: 'config-check', action: 'getBoards' }
      });
      return !error && data?.success;
    } catch {
      return false;
    }
  }

  private async checkOpenAI(): Promise<boolean> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('ai-agent-chat', {
        body: { message: 'test', agentId: 'config-check' }
      });
      return !error && data?.success;
    } catch {
      return false;
    }
  }

  private async checkTwilio(): Promise<boolean> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: { agentId: 'config-check', phoneNumber: '+1234567890', message: 'test', userId: 'test' }
      });
      // For Twilio, we expect a specific error about invalid phone number, not missing credentials
      return !error || !data?.error?.includes('credentials');
    } catch {
      return false;
    }
  }

  private async checkEmail(): Promise<boolean> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { agentId: 'config-check', recipient: 'test@example.com', subject: 'test', body: 'test' }
      });
      return !error || !data?.error?.includes('credentials');
    } catch {
      return false;
    }
  }

  getConfigStatus(): ApiConfig | null {
    return this.config;
  }

  invalidateConfig(): void {
    this.config = null;
  }
}

export const configService = ConfigService.getInstance();
