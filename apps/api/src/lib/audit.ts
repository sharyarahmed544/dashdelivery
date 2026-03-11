import { adminDb } from '../lib/firebase';
import logger from './logger';

export interface AuditLogEntry {
    admin_id: string;
    admin_email: string;
    action: string; // 'UPDATE_BOOKING', 'CHANGE_CMS', etc.
    resource_id: string;
    details: any;
    timestamp: Date;
    ip_address?: string;
}

/**
 * Persists an administrative action to the Audit Log collection
 */
export const logAuditAction = async (entry: Omit<AuditLogEntry, 'timestamp'>) => {
    try {
        const auditRef = adminDb.collection('audit_logs').doc();
        await auditRef.set({
            ...entry,
            timestamp: new Date()
        });

        logger.info(`Audit Log Created: ${entry.action}`, { resourceId: entry.resource_id });
    } catch (error) {
        logger.error('Failed to create Audit Log:', error);
    }
};
