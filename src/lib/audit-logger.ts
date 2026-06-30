import { db } from './db';
import { sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
const authOptions = {};
import { headers } from 'next/headers';

export type AuditAction = 
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'PRINT'
  | 'PAYMENT'
  | 'REFUND'
  | 'PRESCRIBE'
  | 'DISPENSE'
  | 'ADMIT'
  | 'DISCHARGE'
  | 'TRANSFER';

export type AuditEntity = 
  | 'PATIENT'
  | 'DOCTOR'
  | 'APPOINTMENT'
  | 'MEDICAL_RECORD'
  | 'PRESCRIPTION'
  | 'BILL'
  | 'INVENTORY'
  | 'LAB_TEST'
  | 'USER'
  | 'ROLE'
  | 'SETTINGS';

export interface AuditLog {
  id?: number;
  userId: number;
  userEmail: string;
  userRole: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: number;
  oldValue?: any;
  newValue?: any;
  metadata?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export class AuditLogger {
  static async log(
    action: AuditAction,
    entity: AuditEntity,
    entityId?: number,
    oldValue?: any,
    newValue?: any,
    metadata?: any
  ) {
    try {
      const session = await getServerSession(authOptions);
      const headersList = headers();
      
      const ipAddress = headersList.get('x-forwarded-for') || 
                        headersList.get('x-real-ip') || 
                        'unknown';
      const userAgent = headersList.get('user-agent') || 'unknown';

      if (!session?.user) {
        // Log anonymous actions if needed
        console.warn('Audit log attempted without session');
        return;
      }

      // Remove sensitive data before logging
      const sanitizeData = (data: any) => {
        if (!data) return data;
        const sanitized = { ...data };
        delete sanitized.password;
        delete sanitized.twoFactorSecret;
        delete sanitized.backupCodes;
        delete sanitized.twoFactorCode;
        return sanitized;
      };

      const auditLog: AuditLog = {
        userId: parseInt(session.user.id),
        userEmail: session.user.email!,
        userRole: session.user.role!,
        action,
        entity,
        entityId,
        oldValue: sanitizeData(oldValue),
        newValue: sanitizeData(newValue),
        metadata,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      };

      // Store in database using raw SQL for flexibility
      await db.execute(sql`
        INSERT INTO audit_logs (
          user_id, user_email, user_role, action, entity, entity_id,
          old_value, new_value, metadata, ip_address, user_agent, timestamp
        ) VALUES (
          ${auditLog.userId}, ${auditLog.userEmail}, ${auditLog.userRole},
          ${auditLog.action}, ${auditLog.entity}, ${auditLog.entityId},
          ${JSON.stringify(auditLog.oldValue)}::jsonb,
          ${JSON.stringify(auditLog.newValue)}::jsonb,
          ${JSON.stringify(auditLog.metadata)}::jsonb,
          ${auditLog.ipAddress}, ${auditLog.userAgent},
          ${auditLog.timestamp}
        )
      `);

      // In production, also send to external logging service
      if (process.env.NODE_ENV === 'production') {
        // await sendToLoggingService(auditLog);
      }

    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw - audit logging should never break the main flow
    }
  }

  static async getLogs(filters: {
    userId?: number;
    action?: AuditAction;
    entity?: AuditEntity;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    let query = sql`SELECT * FROM audit_logs WHERE 1=1`;

    if (filters.userId) {
      query = sql`${query} AND user_id = ${filters.userId}`;
    }
    if (filters.action) {
      query = sql`${query} AND action = ${filters.action}`;
    }
    if (filters.entity) {
      query = sql`${query} AND entity = ${filters.entity}`;
    }
    if (filters.startDate) {
      query = sql`${query} AND timestamp >= ${filters.startDate}`;
    }
    if (filters.endDate) {
      query = sql`${query} AND timestamp <= ${filters.endDate}`;
    }

    query = sql`${query} ORDER BY timestamp DESC`;

    if (filters.limit) {
      query = sql`${query} LIMIT ${filters.limit}`;
    }
    if (filters.offset) {
      query = sql`${query} OFFSET ${filters.offset}`;
    }

    return await db.execute(query);
  }
}

// Add audit_logs table to schema
// Add to src/lib/db/schema.ts:
/*
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  userEmail: varchar('user_email', { length: 255 }).notNull(),
  userRole: varchar('user_role', { length: 50 }).notNull(),
  action: varchar('action', { length: 50 }).notNull(),
  entity: varchar('entity', { length: 50 }).notNull(),
  entityId: integer('entity_id'),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  metadata: jsonb('metadata'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});
*/