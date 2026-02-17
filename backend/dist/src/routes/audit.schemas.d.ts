import { z } from "zod";
declare const auditSchemaReq: z.ZodObject<{
    lines: z.ZodArray<z.ZodObject<{
        grossSalary: z.ZodNumber;
        month: z.ZodString;
        age: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AuditInput = z.infer<typeof auditSchemaReq>;
export declare const auditSchemas: {
    request: {
        audit: z.ZodObject<{
            lines: z.ZodArray<z.ZodObject<{
                grossSalary: z.ZodNumber;
                month: z.ZodString;
                age: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    };
    response: {
        audit: z.ZodObject<{
            summary: z.ZodObject<{
                lineCount: z.ZodNumber;
                totalGross: z.ZodNumber;
                totalDeclaredCotisation: z.ZodNumber;
                totalRecalculatedCotisation: z.ZodNumber;
                totalDelta: z.ZodNumber;
                flaggedCount: z.ZodNumber;
            }, z.core.$strip>;
            lines: z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                month: z.ZodString;
                age: z.ZodNumber;
                grossSalary: z.ZodNumber;
                rates: z.ZodObject<{
                    declaredRate: z.ZodNumber;
                    recalculatedRate: z.ZodNumber;
                    atRate: z.ZodNumber;
                    reductionRate: z.ZodNumber;
                }, z.core.$strip>;
                amounts: z.ZodObject<{
                    declaredCotisation: z.ZodNumber;
                    recalculatedCotisation: z.ZodNumber;
                    fillonReduction: z.ZodNumber;
                    atCotisation: z.ZodNumber;
                    delta: z.ZodNumber;
                }, z.core.$strip>;
                status: z.ZodEnum<{
                    ok: "ok";
                    review: "review";
                }>;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    };
};
export {};
//# sourceMappingURL=audit.schemas.d.ts.map