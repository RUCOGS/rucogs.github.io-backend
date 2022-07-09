import { TemplateConfig } from '../mail.controller';

export default {
  extends: 'default-template',
  text: (data) => `
Hi ${data.name},

We want to verify you are a Rutgers student for your cogs.club account. Please open the link below to verify yourself. If you didn't request any verficiation, please then ignore this email.

<{{link}}>
`,
} as TemplateConfig;
