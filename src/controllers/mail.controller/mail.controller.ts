import Handlebars from 'handlebars';
import inlineSass from 'inline-sass-commonjs';
import { SendMailOptions, Transporter } from 'nodemailer';
import path from 'path';

export type TemplateConfig = {
  attachments?: SendMailOptions['attachments'];
  extends?: string;
  text?: (data: any) => string;
};

export class MailController {
  private templatePath: string = '';
  private templateData: any;
  private options: SendMailOptions = {};

  constructor(private transporter: Transporter) {}

  private resetOptions() {
    this.templatePath = '';
    this.templateData = {};
    this.options = {};
  }

  withTemplate(path: string = 'default-template', data: any = {}) {
    this.templatePath = path;
    this.templateData = data;
    return this;
  }

  withOptions(options: SendMailOptions) {
    if (!options.from) options.from = 'RUCOGS Club <rucogsnoreply@gmail.com>';
    this.options = options;
    return this;
  }

  async sendMail() {
    let html = this.options.html;
    let attachments = this.options.attachments;
    if (this.templatePath) {
      const [templateHtml, templateAttachments] = await this.useTemplate(this.templatePath, {
        // Templates should use {{{content}}} to inject html content into themselves
        content: this.options.html?.toString() ?? undefined,
        ...this.templateData,
      });
      if (templateHtml) html = templateHtml;
      if (templateAttachments) {
        if (attachments) attachments.concat(templateAttachments);
        else attachments = templateAttachments;
      }
    }
    const options = this.options;

    this.resetOptions();

    await this.transporter.sendMail({
      ...options,
      html,
      attachments,
    });
  }

  private async useTemplate(templatePath: string, data: any = {}): Promise<[string, SendMailOptions['attachments']]> {
    const config: TemplateConfig = (await import(path.join(__dirname, templatePath, '/config'))).default;
    const templateHtml = String(await inlineSass(path.join(__dirname, templatePath, '/template.html')));

    let html = Handlebars.compile(templateHtml)(data);

    // Deep clone the attachments
    let attachments: SendMailOptions['attachments'] = undefined;
    if (config.attachments) {
      attachments = JSON.parse(JSON.stringify(config.attachments)) as SendMailOptions['attachments'];
      attachments?.forEach((x) => {
        if (x.path && typeof x.path === 'string') {
          x.path = path.join(__dirname, templatePath, x.path);
        }
      });
    }

    // Apply all the templates that this template extends
    if (config.extends) {
      const [newHtml, newAttachments] = await this.useTemplate(config.extends, {
        ...data,
        content: html,
      });
      html = newHtml;
      if (newAttachments) attachments = [...(attachments ?? []), ...newAttachments];
    }

    return [html, attachments];
  }
}
