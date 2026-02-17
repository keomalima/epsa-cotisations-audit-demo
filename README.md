## Audit des cotisations

Application simple pour recalculer les cotisations (taux déclaré 42 %, réduction dégressive < 2500 €, bonus -1 % < 26 ans, plancher 22 %, alerte si delta > 30 €).

### Démarrage rapide
```bash
# depuis la racine
make
# lance backend (Fastify + script Python) et frontend (Vite + React)
# backend : http://localhost:3000
# frontend : http://localhost:5173
```

Le frontend envoie les lignes de paie à `/api/audit` et affiche le résumé + le détail.
