import { z } from "zod";

// =====================
// Request Schemas
// =====================

const payrollLineSchema = z.object({
  grossSalary: z.number().positive(),
  month: z.string().min(1),
  age: z.number().int().min(16).max(80)
});

const auditSchemaReq = z.object({
  lines: z.array(payrollLineSchema).min(1).max(10)
});

const auditLineResultSchema = z.object({
  id: z.number().int(),
  month: z.string(),
  age: z.number().int(),
  grossSalary: z.number(),
  rates: z.object({
    declaredRate: z.number(),
    recalculatedRate: z.number(),
    atRate: z.number(),
    reductionRate: z.number()
  }),
  amounts: z.object({
    declaredCotisation: z.number(),
    recalculatedCotisation: z.number(),
    fillonReduction: z.number(),
    atCotisation: z.number(),
    delta: z.number()
  }),
  status: z.enum(["ok", "review"])
});

const auditSchemaRes = z.object({
  summary: z.object({
    lineCount: z.number().int(),
    totalGross: z.number(),
    totalDeclaredCotisation: z.number(),
    totalRecalculatedCotisation: z.number(),
    totalDelta: z.number(),
    flaggedCount: z.number().int()
  }),
  lines: z.array(auditLineResultSchema)
});

export type AuditInput = z.infer<typeof auditSchemaReq>

// =====================
// Schema Objects Export
// =====================

export const auditSchemas = {
  // Request schemas
  request: {
    audit: auditSchemaReq
  },
  
  // Response schemas
  response: {
    audit: auditSchemaRes
  },
};
