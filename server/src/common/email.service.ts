import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ RESEND_API_KEY não configurada! Emails não serão enviados.');
    }
    
    this.resend = new Resend(apiKey);
  }

  async sendPasswordResetEmail(email: string, resetUrl: string, username: string) {
    const { data, error } = await this.resend.emails.send({
      from: process.env.EMAIL_FROM || 'Gigio\'s Coup <onboarding@resend.dev>',
      to: [email],
      subject: 'Recuperação de Senha - Gigio\'s Coup',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                background-color: #1a1410;
                color: #f5e6d3;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(to bottom, #2d1810, #1a1005);
                border: 2px solid #d4a574;
                border-radius: 8px;
                padding: 40px;
              }
              .title {
                font-family: 'Georgia', serif;
                font-size: 32px;
                color: #d4a574;
                text-align: center;
                margin-bottom: 30px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
              }
              .content {
                line-height: 1.6;
                font-size: 16px;
                margin-bottom: 30px;
              }
              .button {
                display: inline-block;
                background-color: #d4a574;
                color: #1a1410 !important;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                font-size: 18px;
                text-align: center;
                margin: 20px 0;
              }
              .button:hover {
                background-color: #f0c080;
              }
              .button-container {
                text-align: center;
              }
              .warning {
                background-color: rgba(212, 165, 116, 0.1);
                border-left: 4px solid #d4a574;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #a0826d;
                margin-top: 30px;
                border-top: 1px solid #d4a574;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="title">🏰 Gigio's Coup</h1>
              
              <div class="content">
                <p>Olá, <strong>${username}</strong>!</p>
                
                <p>Você solicitou a recuperação de senha para sua conta no <strong>Gigio's Coup</strong>.</p>
                
                <p>Para redefinir sua senha, clique no botão abaixo:</p>
                
                <div class="button-container">
                  <a href="${resetUrl}" class="button">Redefinir Senha</a>
                </div>
                
                <div class="warning">
                  ⚠️ <strong>Importante:</strong>
                  <ul>
                    <li>Este link é válido por <strong>1 hora</strong></li>
                    <li>Se você não solicitou esta recuperação, ignore este email</li>
                    <li>Sua senha atual permanecerá inalterada até você criar uma nova</li>
                  </ul>
                </div>
                
                <p>Ou copie e cole este link no seu navegador:</p>
                <p style="word-break: break-all; background-color: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; font-size: 12px;">
                  ${resetUrl}
                </p>
              </div>
              
              <div class="footer">
                <p>Este é um email automático, por favor não responda.</p>
                <p>© 2026 Gigio's Coup - Todos os direitos reservados</p>
              </div>
            </div>
          </body>
        </html>
        `,
      });

      if (error) {
        throw error;
      }

      return { success: true, messageId: data?.id };
  }
}
