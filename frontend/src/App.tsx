import { useState } from "react";

type Line = { grossSalary: string; month: string; age: string };
type ApiResponse = {
  summary: {
    lineCount: number;
    totalGross: number;
    totalDeclaredCotisation: number;
    totalRecalculatedCotisation: number;
    totalDelta: number;
    flaggedCount: number;
  };
  lines: Array<{
    month: string;
    age: number;
    grossSalary: number;
    rates: { declaredRate: number; recalculatedRate: number; atRate: number; reductionRate: number };
    amounts: { declaredCotisation: number; recalculatedCotisation: number; fillonReduction: number; atCotisation: number; delta: number };
    status: "ok" | "review";
  }>;
};

export default function App() {
  const [lines, setLines] = useState<Line[]>([
    { grossSalary: "", month: "", age: "" },
  ]);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLine = (i: number, key: keyof Line, value: string) => {
    const next = [...lines];
    next[i] = { ...next[i], [key]: value };
    setLines(next);
  };

  const addLine = () => setLines([...lines, { grossSalary: "", month: "", age: "" }]);
  const removeLine = (i: number) => setLines(lines.filter((_, idx) => idx !== i));

  const submit = async () => {
    setLoading(true); setError(null);
    try {
      const payload = {
        lines: lines.map((l) => ({
          grossSalary: Number(l.grossSalary),
          month: l.month,
          age: Number(l.age),
        })),
      };

      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f5f7fb 0%, #eef1f8 50%, #e8ecf7 100%)",
        padding: 32,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          background: "#ffffff",
          color: "#222",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          padding: 24,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Audit Cotisations</h1>
        <div style={{ marginBottom: 16, lineHeight: 1.5 }}>
          <strong>Comment ça marche :</strong>
          <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0 }}>
            <li>Taux déclaré fixe : 42 %.</li>
            <li>Réduction dégressive jusqu&apos;à 8 % pour les salaires &lt; 2500 €.</li>
            <li>Bonus jeunesse : +1 % de réduction pour les moins de 26 ans.</li>
            <li>Plancher : le taux ne descend jamais sous 22 %.</li>
            <li>Si l&apos;écart recalculé dépasse 30 €, la ligne passe en « review ».</li>
          </ul>
        </div>

        {lines.map((line, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, marginBottom: 8 }}>
          <input type="number" step="0.01" value={line.grossSalary} onChange={e => updateLine(i, "grossSalary", e.target.value)} placeholder="Salaire brut (€)" />
          <input type="text" value={line.month} onChange={e => updateLine(i, "month", e.target.value)} placeholder="Mois (YYYY-MM)" />
          <input type="number" value={line.age} onChange={e => updateLine(i, "age", e.target.value)} placeholder="Âge" />
          <button onClick={() => removeLine(i)}>X</button>
        </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button onClick={addLine}>Ajouter une ligne</button>
          <button onClick={submit} disabled={loading}>
            {loading ? "Calcul..." : "Calculer"}
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {result && (
          <>
            <h2>Résumé</h2>
            <ul>
              <li>Lignes: {result.summary.lineCount}</li>
              <li>Salaire brut total: {result.summary.totalGross}</li>
              <li>Cotisation déclarée: {result.summary.totalDeclaredCotisation}</li>
              <li>Cotisation recalculée: {result.summary.totalRecalculatedCotisation}</li>
              <li>Delta total: {result.summary.totalDelta}</li>
              <li>Flaggées: {result.summary.flaggedCount}</li>
            </ul>

            <h2>Détail</h2>
            <table style={{ borderCollapse: "collapse", width: "100%", background: "#fff", color: "#222", border: "1px solid #ddd" }}>
              <thead style={{ background: "#f0f2f5" }}>
                <tr>
                  <th style={{ padding: 8, textAlign: "left" }}>Mois</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Âge</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Salaire brut</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Cotisation déclarée</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Cotisation recalculée</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Réduction Fillon</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Delta</th>
                  <th style={{ padding: 8, textAlign: "left" }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {result.lines.map((ln, idx) => (
                  <tr key={idx} style={{ background: ln.status === "review" ? "#ffe6e6" : "#e6ffed" }}>
                    <td style={{ padding: 8 }}>{ln.month}</td>
                    <td style={{ padding: 8 }}>{ln.age}</td>
                    <td style={{ padding: 8 }}>{ln.grossSalary.toFixed(2)}</td>
                    <td style={{ padding: 8 }}>{ln.amounts.declaredCotisation.toFixed(2)}</td>
                    <td style={{ padding: 8 }}>{ln.amounts.recalculatedCotisation.toFixed(2)}</td>
                    <td style={{ padding: 8 }}>{ln.amounts.fillonReduction.toFixed(2)}</td>
                    <td style={{ padding: 8 }}>{ln.amounts.delta.toFixed(2)}</td>
                    <td style={{ padding: 8, fontWeight: 600 }}>{ln.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
