import type { FastifyReply, FastifyRequest } from 'fastify'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { type AuditInput } from './audit.schemas.js';

// =====================
// Audit CRUD Handlers
// =====================

async function auditHandler (request: FastifyRequest<{ Body: AuditInput }>, reply: FastifyReply) {
  try {
    const result = await runPythonAudit(request.body)
    return reply.code(200).send(result)
  } catch (error: any) {
    request.log.error({ err: error }, 'Python audit failed')
    return reply.code(500).send({ message: 'Failed to audit input' })
  }
}

async function healthHandler (request: FastifyRequest, reply: FastifyReply) {
    try {
        return reply.code(200).send({message: "Server is healthy"});
    } catch (error: any) {
        reply.code(500).send({ message: "Server error"});
    }
}

function runPythonAudit(body: AuditInput): Promise<any> {
  const scriptPath = join(process.cwd(), '..', 'script', 'audit.py')
  const input = JSON.stringify(body)

  return new Promise((resolve, reject) => {
    const child = spawn('python3', [scriptPath], { stdio: ['pipe', 'pipe', 'pipe'] })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => { stdout += chunk.toString() })
    child.stderr.on('data', (chunk) => { stderr += chunk.toString() })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`python exited with code ${code}: ${stderr}`))
      }
      try {
        const parsed = JSON.parse(stdout)
        resolve(parsed)
      } catch (err) {
        reject(new Error(`failed to parse python output: ${err instanceof Error ? err.message : String(err)}`))
      }
    })

    child.stdin.write(input)
    child.stdin.end()
  })
}

// =====================
// Export Controller Object
// =====================

export const auditControllers = {
	auditHandler,
    healthHandler
};
