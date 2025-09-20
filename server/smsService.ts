import twilio from 'twilio';

export class SmsService {
  private client: twilio.Twilio | null = null;

  constructor() {
    this.initializeTwilio();
  }

  private initializeTwilio() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
    }
  }

  async sendSms(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.client) {
      return { 
        success: false, 
        error: 'SMS service not configured. Please provide Twilio credentials.' 
      };
    }

    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!fromNumber) {
      return { 
        success: false, 
        error: 'Twilio phone number not configured.' 
      };
    }

    try {
      const result = await this.client.messages.create({
        body: message,
        from: fromNumber,
        to: phoneNumber,
      });

      return {
        success: true,
        messageId: result.sid,
      };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send SMS',
      };
    }
  }

  generateThiefSpottedMessage(incidentTitle: string, location: string): string {
    return `⚠️ ALERT SafeCity: Un voleur a été aperçu près de "${incidentTitle}" à ${location}. Soyez vigilant dans cette zone.`;
  }

  generateObjectFoundMessage(incidentTitle: string, location: string, contactInfo: string): string {
    return `✅ SafeCity: Un objet volé a été retrouvé près de "${incidentTitle}" à ${location}. Contact: ${contactInfo}`;
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic phone number validation - accepts international format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }
}

export const smsService = new SmsService();