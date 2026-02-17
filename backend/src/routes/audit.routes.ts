import type { FastifyInstance } from 'fastify'

import { auditControllers } from './audit.controllers.js'
import { auditSchemas } from "./audit.schemas.js";

// =====================
// Tax Routes
// =====================

export async function auditRoutes(fastify: FastifyInstance) {
    fastify.get('/health', {handler: auditControllers.healthHandler});

    fastify.post('/audit', {
        schema: {
            body: auditSchemas.request.audit,
            response: { 200: auditSchemas.response.audit }
        },
        handler: auditControllers.auditHandler
    });
}