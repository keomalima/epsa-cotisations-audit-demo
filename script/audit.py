from dataclasses import dataclass
from typing import List, Dict
import json
import sys
from decimal import Decimal, ROUND_HALF_UP

DECLARED_RATE = Decimal("0.42")
@dataclass
class PayrollLine:
    grossSalary: Decimal
    month: str
    age: int

def round2(x: Decimal) -> Decimal:
    return x.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def compute_line(line: PayrollLine) -> Dict:
    gross = Decimal(str(line.grossSalary))

    at_rate = (
        Decimal("0.015") if gross <= Decimal("2000")
        else Decimal("0.020") if gross <= Decimal("3500")
        else Decimal ("0.025")
    )
    
    reduction_base = max(Decimal("0"), (Decimal("2500") - gross) / Decimal("2500") * Decimal("0.08"))
    youth_bonus = Decimal("0.01") if line.age < 26 else Decimal("0")
    reduction_rate = reduction_base + youth_bonus
    recalculated_rate = max(Decimal("0.22"), DECLARED_RATE - reduction_rate)

    declared_cot = round2(gross * DECLARED_RATE)
    recalculated_cot= round2(gross * recalculated_rate)
    fillon_reduction = round2(gross * reduction_rate)
    at_cot = round2(gross * at_rate)
    delta = round2(declared_cot - recalculated_cot)

    return {
        "month" : line.month,
        "age": line.age,
        "grossSalary": float(gross),
        "rates": {
            "declaredRate": float(DECLARED_RATE),
            "recalculatedRate": float(recalculated_rate),
            "atRate": float(at_rate),
            "reductionRate": float(reduction_rate),
        },
        "amounts": {
            "declaredCotisation": float(declared_cot),
            "recalculatedCotisation": float(recalculated_cot),
            "fillonReduction": float(fillon_reduction),
            "atCotisation": float(at_cot),
            "delta": float(delta),
        },
        "status": "review" if delta > Decimal("30") else "ok",
    }

def compute_report(lines: List[PayrollLine]) -> Dict:
    results = []
    for idx, line in enumerate(lines, start=1):
        row = compute_line(line)
        row["id"] = idx
        results.append(row)

    total_gross = round2(sum(Decimal(str(r["grossSalary"])) for r in results))
    total_declared = round2(sum(Decimal(str(r["amounts"]["declaredCotisation"])) for r in results))
    total_recalculated = round2(sum(Decimal(str(r["amounts"]["recalculatedCotisation"])) for r in results))
    total_delta = round2(sum(Decimal(str(r["amounts"]["delta"])) for r in results))
    flagged = sum(1 for r in results if r["status"] == "review")
    return {
        "summary": {
            "lineCount": len(results),
            "totalGross": float(total_gross),
            "totalDeclaredCotisation": float(total_declared),
            "totalRecalculatedCotisation": float(total_recalculated),
            "totalDelta": float(total_delta),
            "flaggedCount": flagged,
        },
        "lines": results,
    }

def main() :
    payload = json.load(sys.stdin)
    normalized = []
    for item in payload["lines"]:
        if "grossSalary" in item:
            normalized.append(item)
        elif "gross_salary" in item:
            normalized.append({
                "grossSalary": item["gross_salary"],
                "month": item["month"],
                "age": item["age"],
            })
        else:
            raise KeyError("grossSalary manquant")
    lines = [PayrollLine(**item) for item in normalized]
    report = compute_report(lines)
    json.dump(report, sys.stdout)

if __name__ == "__main__":
    main()
