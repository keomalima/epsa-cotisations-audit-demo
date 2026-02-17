// Third-party
import Fastify from 'fastify';
import { auditRoutes } from './routes/audit.routes.js';
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
// Fastify instance
const fastify = Fastify({ logger: true, trustProxy: true }).withTypeProvider();
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);
// Route registration
fastify.register(auditRoutes, { prefix: "/api" });
// Server start
try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
}
catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
//# sourceMappingURL=server.js.map