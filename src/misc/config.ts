export type AuthConfig = typeof import('@src/config/auth.config.template.json');
export type ServerConfig = Omit<typeof import('@src/config/server.config.template.json'), 'nodemailer'> & {
  nodemailer: any;
};
