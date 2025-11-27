import axios, { AxiosInstance } from 'axios';
import nodemailer from 'nodemailer';

// ============ TIPOS E INTERFACES ============

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface NotificationParams {
  customerPhone: string;
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  orderItems?: OrderItem[];
  totalAmount?: string;
  paymentMethod?: string;
  voucherUrl?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

interface NotificationConfig {
  // WhatsApp (Evolution API)
  evoApiKey: string;
  evoBaseUrl: string;
  evoInstanceName: string;
  
  // Email (Gmail)
  emailUser: string;
  emailPass: string;
  
  // Empresa
  ownerPhones: string[]; // Ej: ['+50612345678', '+50687654321']
  ownerEmails: string[]; // Ej: ['owner1@grema.com', 'owner2@grema.com']
  
  // URLs
  baseUrl: string; // Ej: 'https://gremastore.com'
  logoUrl?: string;
}

interface Instance {
  id: string;
  name: string;
  connectionStatus: string;
}

// ============ CLASE PRINCIPAL ============

export class NotificationService {
  private readonly config: NotificationConfig;
  private readonly whatsappApi: AxiosInstance;
  private readonly emailTransporter: any;

  constructor(config: NotificationConfig) {
    this.config = {
      logoUrl: 'https://ik.imagekit.io/xj7y5uqcr/Logo%20en%20negro.png?updatedAt=1753365043217',
      ...config
    };

    // Inicializar cliente WhatsApp
    this.whatsappApi = axios.create({
      baseURL: this.config.evoBaseUrl,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.evoApiKey
      }
    });

    // Inicializar cliente Email
    this.emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.emailUser,
        pass: this.config.emailPass
      }
    });
  }

  // ============ MÉTODOS PRIVADOS - WHATSAPP ============

  private async isWhatsAppInstanceActive(): Promise<boolean> {
    try {
      const response = await this.whatsappApi.get('/instance/fetchInstances');
      const instances: Instance[] = response.data;
      const instance = instances.find(i => i.name === this.config.evoInstanceName);
      return instance?.connectionStatus === 'open';
    } catch (error: any) {
      console.error('❌ Error verificando instancia WhatsApp:', error.message);
      return false;
    }
  }

  private async sendWhatsAppText(phone: string, text: string): Promise<void> {
    const isActive = await this.isWhatsAppInstanceActive();
    if (!isActive) {
      throw new Error('La instancia de WhatsApp no está activa');
    }

    await this.whatsappApi.post(
      `/message/sendText/${this.config.evoInstanceName}`,
      {
        number: phone,
        text
      }
    );
  }

  private async sendWhatsAppMedia(phone: string, mediaUrl: string, caption: string): Promise<void> {
    const isActive = await this.isWhatsAppInstanceActive();
    if (!isActive) {
      throw new Error('La instancia de WhatsApp no está activa');
    }

    await this.whatsappApi.post(
      `/message/sendMedia/${this.config.evoInstanceName}`,
      {
        number: phone,
        mediatype: 'image',
        mimetype: 'image/jpeg',
        caption,
        media: mediaUrl
      }
    );
  }

  // ============ MÉTODOS PRIVADOS - EMAIL ============

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.emailTransporter.sendMail({
      from: this.config.emailUser,
      to,
      subject,
      html
    });
  }

  // ============ MÉTODOS PRIVADOS - UTILIDADES ============

  private formatOrderItems(items: OrderItem[]): string {
    return items.map(item => 
      `- ${item.name} x${item.quantity} - ₡${item.price.toLocaleString()}`
    ).join('\n');
  }

  private getPaymentLink(orderNumber: string): string {
    return `${this.config.baseUrl}/payment/${orderNumber}`;
  }

  private getTrackingLink(orderNumber: string): string {
    return `${this.config.baseUrl}/tracking/${orderNumber}`;
  }

  // ============ MÉTODOS PÚBLICOS - NOTIFICACIONES ============

  /**
   * 1. CONFIRMACIÓN DE PEDIDO
   * Notifica a cliente (WhatsApp + Email) y empresa (WhatsApp + Email)
   */
  async sendOrderConfirmation(params: NotificationParams): Promise<void> {
    const { 
      customerPhone, 
      customerEmail, 
      customerName,
      orderNumber, 
      orderItems = [], 
      totalAmount 
    } = params;

    const orderDetails = orderItems.length > 0 
      ? this.formatOrderItems(orderItems) 
      : 'Ver detalles en el sistema';

    const paymentLink = this.getPaymentLink(orderNumber);
    const trackingLink = this.getTrackingLink(orderNumber);

    try {
      // === NOTIFICAR AL CLIENTE ===
      
      // WhatsApp al cliente
      await this.sendWhatsAppText(
        `+506${customerPhone}`,
        `🎉 *¡Gracias por tu pedido, ${customerName}!*\n\n` +
        `📦 Orden: #${orderNumber}\n` +
        `💰 Total: ${totalAmount}\n\n` +
        `*Detalles:*\n${orderDetails}\n\n` +
        `📸 Sube tu comprobante: ${paymentLink}\n` +
        `🔍 Rastrea tu pedido: ${trackingLink}\n\n` +
        `Grema Store - Tu tienda de confianza 🛍️`
      );

      // Email al cliente
      await this.sendEmail(
        customerEmail,
        `Confirmación de Pedido #${orderNumber} - Grema Store`,
        this.getOrderConfirmationEmailTemplate({
          customerName,
          orderNumber,
          orderDetails,
          totalAmount: totalAmount || 'N/A',
          paymentLink,
          trackingLink
        })
      );

      // === NOTIFICAR A LA EMPRESA ===
      
      // WhatsApp a dueños
      for (const ownerPhone of this.config.ownerPhones) {
        await this.sendWhatsAppText(
          ownerPhone,
          `🔔 *NUEVO PEDIDO RECIBIDO*\n\n` +
          `👤 Cliente: ${customerName}\n` +
          `📞 Teléfono: +506${customerPhone}\n` +
          `📧 Email: ${customerEmail}\n` +
          `📦 Orden: #${orderNumber}\n` +
          `💰 Total: ${totalAmount}\n\n` +
          `*Productos:*\n${orderDetails}`
        );
      }

      // Email a dueños
      if (this.config.ownerEmails.length > 0) {
        await this.sendEmail(
          this.config.ownerEmails.join(','),
          `🔔 Nuevo Pedido #${orderNumber} - Grema Store`,
          this.getNewOrderEmailForOwners({
            customerName,
            customerPhone,
            customerEmail,
            orderNumber,
            orderDetails,
            totalAmount: totalAmount || 'N/A'
          })
        );
      }

      console.log(`✅ Confirmación de pedido #${orderNumber} enviada exitosamente`);
    } catch (error: any) {
      console.error(`❌ Error enviando confirmación de pedido #${orderNumber}:`, error.message);
      throw error;
    }
  }

  /**
   * 2. CONFIRMACIÓN DE COMPROBANTE DE PAGO
   * Notifica solo a empresa (WhatsApp con imagen + Email)
   */
  async sendPaymentVoucherReceived(params: NotificationParams): Promise<void> {
    const { 
      customerName,
      customerPhone,
      orderNumber, 
      totalAmount, 
      paymentMethod,
      voucherUrl 
    } = params;

    if (!voucherUrl) {
      throw new Error('Se requiere la URL del comprobante de pago');
    }

    try {
      // WhatsApp a dueños con imagen
      for (const ownerPhone of this.config.ownerPhones) {
        await this.sendWhatsAppMedia(
          ownerPhone,
          voucherUrl,
          `💰 *COMPROBANTE DE PAGO RECIBIDO*\n\n` +
          `👤 Cliente: ${customerName}\n` +
          `📞 Teléfono: +506${customerPhone}\n` +
          `📦 Orden: #${orderNumber}\n` +
          `💵 Monto: ${totalAmount}\n` +
          `💳 Método: ${paymentMethod}\n\n` +
          `⚠️ Verifica el comprobante y actualiza el estado del pedido`
        );
      }

      // Email a dueños
      if (this.config.ownerEmails.length > 0) {
        await this.sendEmail(
          this.config.ownerEmails.join(','),
          `💰 Comprobante Recibido - Pedido #${orderNumber}`,
          this.getPaymentVoucherEmailForOwners({
            customerName,
            customerPhone,
            orderNumber,
            totalAmount: totalAmount || 'N/A',
            paymentMethod: paymentMethod || 'N/A',
            voucherUrl
          })
        );
      }

      console.log(`✅ Notificación de comprobante para pedido #${orderNumber} enviada`);
    } catch (error: any) {
      console.error(`❌ Error enviando notificación de comprobante #${orderNumber}:`, error.message);
      throw error;
    }
  }

  /**
   * 3. PEDIDO LISTO
   * Notifica solo a cliente (WhatsApp + Email)
   */
  async sendOrderReady(params: NotificationParams): Promise<void> {
    const { 
      customerPhone, 
      customerEmail, 
      customerName,
      orderNumber,
      estimatedDelivery
    } = params;

    const trackingLink = this.getTrackingLink(orderNumber);

    try {
      // WhatsApp al cliente
      await this.sendWhatsAppText(
        `+506${customerPhone}`,
        `✅ *¡Tu pedido está listo, ${customerName}!*\n\n` +
        `📦 Orden: #${orderNumber}\n` +
        `🚚 Tu pedido está siendo preparado para envío\n` +
        (estimatedDelivery ? `📅 Entrega estimada: ${estimatedDelivery}\n` : '') +
        `\n🔍 Rastrea tu pedido: ${trackingLink}\n\n` +
        `¡Gracias por tu preferencia! 🎉`
      );

      // Email al cliente
      await this.sendEmail(
        customerEmail,
        `✅ Tu Pedido #${orderNumber} está Listo - Grema Store`,
        this.getOrderReadyEmailTemplate({
          customerName,
          orderNumber,
          estimatedDelivery: estimatedDelivery || 'Pronto',
          trackingLink
        })
      );

      console.log(`✅ Notificación de pedido listo #${orderNumber} enviada`);
    } catch (error: any) {
      console.error(`❌ Error enviando notificación de pedido listo #${orderNumber}:`, error.message);
      throw error;
    }
  }

  /**
   * 4. ENVÍO DE GUÍA DE TRACKING
   * Notifica solo a cliente (WhatsApp + Email)
   */
  async sendTrackingInfo(params: NotificationParams): Promise<void> {
    const { 
      customerPhone, 
      customerEmail, 
      customerName,
      orderNumber,
      trackingNumber,
      trackingUrl,
      estimatedDelivery
    } = params;

    if (!trackingNumber) {
      throw new Error('Se requiere el número de rastreo');
    }

    const trackingLink = trackingUrl || this.getTrackingLink(orderNumber);

    try {
      // WhatsApp al cliente
      await this.sendWhatsAppText(
        `+506${customerPhone}`,
        `🚚 *¡Tu pedido va en camino, ${customerName}!*\n\n` +
        `📦 Orden: #${orderNumber}\n` +
        `🔢 Guía de rastreo: *${trackingNumber}*\n` +
        (estimatedDelivery ? `📅 Entrega estimada: ${estimatedDelivery}\n` : '') +
        `\n🔍 Rastrea tu envío: ${trackingLink}\n\n` +
        `¡Pronto lo tendrás en tus manos! 📬`
      );

      // Email al cliente
      await this.sendEmail(
        customerEmail,
        `🚚 Tu Pedido #${orderNumber} fue Enviado - Grema Store`,
        this.getTrackingEmailTemplate({
          customerName,
          orderNumber,
          trackingNumber,
          trackingLink,
          estimatedDelivery: estimatedDelivery || 'Próximamente'
        })
      );

      console.log(`✅ Información de rastreo para pedido #${orderNumber} enviada`);
    } catch (error: any) {
      console.error(`❌ Error enviando información de rastreo #${orderNumber}:`, error.message);
      throw error;
    }
  }

  // ============ PLANTILLAS DE EMAIL ============

  private getOrderConfirmationEmailTemplate(data: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #f9fafb;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${this.config.logoUrl}" alt="Grema Store" style="max-width: 180px; margin-bottom: 16px;" />
          <h2 style="color: #2d3748;">¡Gracias por tu pedido, ${data.customerName}! 🎉</h2>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
          <p style="font-size: 16px; color: #4a5568; margin: 8px 0;">
            <strong>Número de orden:</strong> #${data.orderNumber}
          </p>
          <p style="font-size: 16px; color: #4a5568; margin: 8px 0;">
            <strong>Total:</strong> ${data.totalAmount}
          </p>
          <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 14px; color: #4a5568; margin: 8px 0;">
            <strong>Productos:</strong>
          </p>
          <pre style="font-family: Arial, sans-serif; font-size: 14px; color: #4a5568; white-space: pre-wrap;">${data.orderDetails}</pre>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <p style="font-size: 16px; color: #4a5568; margin-bottom: 12px;">📸 Sube tu comprobante de pago:</p>
          <a href="${data.paymentLink}" style="display: inline-block; background: #3182ce; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 8px;">Subir Comprobante</a>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <p style="font-size: 16px; color: #4a5568; margin-bottom: 12px;">🔍 Rastrea tu pedido:</p>
          <a href="${data.trackingLink}" style="display: inline-block; background: #38a169; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 8px;">Rastrear Orden</a>
        </div>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 14px; color: #718096; text-align: center;">Grema Store © 2025 - Tu tienda de confianza 🛍️</p>
      </div>
    `;
  }

  private getNewOrderEmailForOwners(data: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fff3cd;">
        <h2 style="color: #856404; text-align: center;">🔔 NUEVO PEDIDO RECIBIDO</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 16px;">
          <p><strong>Cliente:</strong> ${data.customerName}</p>
          <p><strong>Teléfono:</strong> +506${data.customerPhone}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Orden:</strong> #${data.orderNumber}</p>
          <p><strong>Total:</strong> ${data.totalAmount}</p>
          <hr style="margin: 16px 0;" />
          <p><strong>Productos:</strong></p>
          <pre style="font-family: Arial, sans-serif; font-size: 14px; white-space: pre-wrap;">${data.orderDetails}</pre>
        </div>
        <p style="font-size: 14px; color: #856404; text-align: center; margin-top: 24px;">Revisa el panel de administración para más detalles</p>
      </div>
    `;
  }

  private getPaymentVoucherEmailForOwners(data: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #d4edda;">
        <h2 style="color: #155724; text-align: center;">💰 COMPROBANTE DE PAGO RECIBIDO</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 16px;">
          <p><strong>Cliente:</strong> ${data.customerName}</p>
          <p><strong>Teléfono:</strong> +506${data.customerPhone}</p>
          <p><strong>Orden:</strong> #${data.orderNumber}</p>
          <p><strong>Monto:</strong> ${data.totalAmount}</p>
          <p><strong>Método:</strong> ${data.paymentMethod}</p>
          <hr style="margin: 16px 0;" />
          <p><strong>Comprobante:</strong></p>
          <img src="${data.voucherUrl}" alt="Comprobante de pago" style="max-width: 100%; border-radius: 8px; margin-top: 12px;" />
        </div>
        <p style="font-size: 14px; color: #155724; text-align: center; margin-top: 24px;">⚠️ Verifica el comprobante y actualiza el estado del pedido</p>
      </div>
    `;
  }

  private getOrderReadyEmailTemplate(data: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #f9fafb;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${this.config.logoUrl}" alt="Grema Store" style="max-width: 180px; margin-bottom: 16px;" />
          <h2 style="color: #2d3748;">✅ ¡Tu pedido está listo, ${data.customerName}!</h2>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
          <p style="font-size: 18px; color: #38a169; font-weight: bold;">📦 Orden #${data.orderNumber}</p>
          <p style="font-size: 16px; color: #4a5568; margin: 16px 0;">
            🚚 Tu pedido está siendo preparado para envío
          </p>
          <p style="font-size: 16px; color: #4a5568;">
            📅 Entrega estimada: <strong>${data.estimatedDelivery}</strong>
          </p>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${data.trackingLink}" style="display: inline-block; background: #38a169; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">🔍 Rastrear Pedido</a>
        </div>
        <p style="font-size: 16px; color: #4a5568; text-align: center; margin-top: 24px;">¡Gracias por tu preferencia! 🎉</p>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 14px; color: #718096; text-align: center;">Grema Store © 2025</p>
      </div>
    `;
  }

  private getTrackingEmailTemplate(data: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #f9fafb;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${this.config.logoUrl}" alt="Grema Store" style="max-width: 180px; margin-bottom: 16px;" />
          <h2 style="color: #2d3748;">🚚 ¡Tu pedido va en camino, ${data.customerName}!</h2>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
          <p style="font-size: 18px; color: #3182ce; font-weight: bold;">📦 Orden #${data.orderNumber}</p>
          <p style="font-size: 16px; color: #4a5568; margin: 16px 0;">
            🔢 Guía de rastreo: <strong>${data.trackingNumber}</strong>
          </p>
          <p style="font-size: 16px; color: #4a5568;">
            📅 Entrega estimada: <strong>${data.estimatedDelivery}</strong>
          </p>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${data.trackingLink}" style="display: inline-block; background: #3182ce; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">🔍 Rastrear Envío</a>
        </div>
        <p style="font-size: 16px; color: #4a5568; text-align: center; margin-top: 24px;">¡Pronto lo tendrás en tus manos! 📬</p>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 14px; color: #718096; text-align: center;">Grema Store © 2025</p>
      </div>
    `;
  }
}

// ============ EXPORTAR INSTANCIA SINGLETON (OPCIONAL) ============

// Si quieres usar una instancia única configurada
export const createNotificationService = (config: NotificationConfig) => {
  return new NotificationService(config);
};