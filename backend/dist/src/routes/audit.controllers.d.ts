import type { FastifyReply, FastifyRequest } from 'fastify';
import { type AuditInput } from './audit.schemas.js';
declare function auditHandler(request: FastifyRequest<{
    Body: AuditInput;
}>, reply: FastifyReply): Promise<undefined>;
declare function healthHandler(request: FastifyRequest, reply: FastifyReply): Promise<undefined>;
export declare const auditControllers: {
    auditHandler: typeof auditHandler;
    healthHandler: typeof healthHandler;
};
export {};
//# sourceMappingURL=audit.controllers.d.ts.map