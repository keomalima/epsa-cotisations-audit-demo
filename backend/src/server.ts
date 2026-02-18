// Third-party
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { join } from 'node:path';
import { auditRoutes } from './routes/audit.routes.js';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";

// Fastify instance
const fastify = Fastify({ logger: true, trustProxy: true }).withTypeProvider<ZodTypeProvider>();

await fastify.register(cors, { origin: '*' });
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Route registration
fastify.register(auditRoutes, { prefix: "/api" });

// Serve frontend static files
await fastify.register(fastifyStatic, {
  root: join(process.cwd(), '..', 'frontend', 'dist'),
  prefix: '/'
});

// Server start
try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}