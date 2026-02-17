import {} from './audit.schemas.js';
// =====================
// Audit CRUD Handlers
// =====================
async function auditHandler(request, reply) {
    try {
        const body = request.body;
        const lines = body.lines.map((line, index) => {
            const declaredRate = 0.42;
            const atRate = line.grossSalary <= 2000 ? 0.015 : line.grossSalary <= 3500 ? 0.02 : 0.025;
            const reductionRateBase = Math.max(0, (2500 - line.grossSalary) / 2500) * 0.08;
            const youthBonus = line.age < 26 ? 0.01 : 0;
            const reductionRate = reductionRateBase + youthBonus;
            const recalculatedRate = Math.max(0.22, declaredRate - reductionRate);
            const declaredCotisation = round2(line.grossSalary * declaredRate);
            const recalculatedCotisation = round2(line.grossSalary * recalculatedRate);
            const fillonReduction = round2(line.grossSalary * reductionRate);
            const atCotisation = round2(line.grossSalary * atRate);
            const delta = round2(declaredCotisation - recalculatedCotisation);
            return {
                id: index + 1,
                month: line.month,
                age: line.age,
                grossSalary: line.grossSalary,
                rates: {
                    declaredRate: round4(declaredRate),
                    recalculatedRate: round4(recalculatedRate),
                    atRate: round4(atRate),
                    reductionRate: round4(reductionRate)
                },
                amounts: {
                    declaredCotisation,
                    recalculatedCotisation,
                    fillonReduction,
                    atCotisation,
                    delta
                },
                status: delta > 30 ? "review" : "ok"
            };
        });
        const summary = {
            lineCount: lines.length,
            totalGross: round2(sum(lines.map((line) => line.grossSalary))),
            totalDeclaredCotisation: round2(sum(lines.map((line) => line.amounts.declaredCotisation))),
            totalRecalculatedCotisation: round2(sum(lines.map((line) => line.amounts.recalculatedCotisation))),
            totalDelta: round2(sum(lines.map((line) => line.amounts.delta))),
            flaggedCount: lines.filter((line) => line.status === "review").length
        };
        return reply.code(200).send({ summary, lines });
    }
    catch (error) {
        reply.code(500).send({ message: "Failed to audit input" });
    }
}
async function healthHandler(request, reply) {
    try {
        return reply.code(200).send({ message: "Server is healthy" });
    }
    catch (error) {
        reply.code(500).send({ message: "Server error" });
    }
}
// =====================
// Export Controller Object
// =====================
export const auditControllers = {
    auditHandler,
    healthHandler
};
function sum(values) {
    return values.reduce((acc, value) => acc + value, 0);
}
function round2(value) {
    return Number(value.toFixed(2));
}
function round4(value) {
    return Number(value.toFixed(4));
}
//# sourceMappingURL=audit.controllers.js.map