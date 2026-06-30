import { createHash, randomBytes } from 'crypto';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export class TwoFactorAuth {
  // Generate a random 6-digit code
  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Hash the code for storage
  static hashCode(code: string): string {
    return createHash('sha256').update(code).digest('hex');
  }

  // Generate a secret for TOTP
  static generateSecret(): string {
    return randomBytes(32).toString('hex');
  }

  // Generate backup codes
  static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 8; i++) {
      codes.push(randomBytes(4).toString('hex'));
    }
    return codes;
  }

  // Hash backup codes for storage
  static hashBackupCodes(codes: string[]): string[] {
    return codes.map(code => createHash('sha256').update(code).digest('hex'));
  }

  // Verify a 2FA code
  static verifyCode(providedCode: string, storedHash: string): boolean {
    const providedHash = this.hashCode(providedCode);
    return providedHash === storedHash;
  }

  // Verify backup code
  static async verifyBackupCode(
    userId: number,
    providedCode: string
  ): Promise<boolean> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { backupCodes: true },
    });

    if (!user?.backupCodes) return false;

    const backupCodes = user.backupCodes as string[];
    const providedHash = createHash('sha256').update(providedCode).digest('hex');
    
    const isValid = backupCodes.includes(providedHash);
    
    if (isValid) {
      // Remove used backup code
      const updatedCodes = backupCodes.filter(code => code !== providedHash);
      await db.update(users)
        .set({ backupCodes: updatedCodes })
        .where(eq(users.id, userId));
    }

    return isValid;
  }

  // Enable 2FA for a user
  static async enable2FA(userId: number): Promise<{
    secret: string;
    backupCodes: string[];
    qrCode: string;
  }> {
    const secret = this.generateSecret();
    const backupCodes = this.generateBackupCodes();
    const hashedBackupCodes = this.hashBackupCodes(backupCodes);
    
    // Create QR code URL for Google Authenticator
    const qrCode = `otpauth://totp/HospitalMIS:${userId}?secret=${secret}&issuer=HospitalMIS`;

    await db.update(users)
      .set({
        twoFactorSecret: secret,
        twoFactorEnabled: true,
        backupCodes: hashedBackupCodes,
      })
      .where(eq(users.id, userId));

    return { secret, backupCodes, qrCode };
  }

  // Disable 2FA for a user
  static async disable2FA(userId: number): Promise<void> {
    await db.update(users)
      .set({
        twoFactorSecret: null,
        twoFactorEnabled: false,
        backupCodes: null,
      })
      .where(eq(users.id, userId));
  }

  // Generate and send 2FA code via email/SMS
  static async send2FACode(userId: number): Promise<void> {
    const code = this.generateCode();
    const codeHash = this.hashCode(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.update(users)
      .set({
        twoFactorCode: codeHash,
        twoFactorCodeExpires: expiresAt,
      })
      .where(eq(users.id, userId));

    // Send code via email/SMS (implement your own sending logic)
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { email: true, phone: true },
    });

    if (user?.email) {
      await this.sendEmail(user.email, code);
    }

    if (user?.phone) {
      await this.sendSMS(user.phone, code);
    }
  }

  private static async sendEmail(email: string, code: string): Promise<void> {
    // Implement email sending logic
    console.log(`Sending 2FA code ${code} to ${email}`);
  }

  private static async sendSMS(phone: string, code: string): Promise<void> {
    // Implement SMS sending logic
    console.log(`Sending 2FA code ${code} to ${phone}`);
  }

  // Verify and consume 2FA code
  static async verifyAndConsumeCode(
    userId: number,
    code: string
  ): Promise<boolean> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        twoFactorCode: true,
        twoFactorCodeExpires: true,
      },
    });

    if (!user?.twoFactorCode || !user?.twoFactorCodeExpires) {
      return false;
    }

    if (new Date() > user.twoFactorCodeExpires) {
      return false;
    }

    const isValid = this.verifyCode(code, user.twoFactorCode);

    if (isValid) {
      // Clear the used code
      await db.update(users)
        .set({
          twoFactorCode: null,
          twoFactorCodeExpires: null,
        })
        .where(eq(users.id, userId));
    }

    return isValid;
  }
}