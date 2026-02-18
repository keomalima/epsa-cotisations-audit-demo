## Audit des cotisations

Application d'audit des cotisations patronales. Compare les cotisations déclarées avec un recalcul basé sur :
- Taux de base : 42 %
- Réduction Fillon (dégressive selon le salaire brut, max 8 % sous 2500 €)
- Bonus jeune (−1 % pour les moins de 26 ans)
- Plancher minimal : 22 %
- Alerte si l'écart dépasse 30 €

### Démo en ligne
**[https://epsa-cotisations-audit-demo.onrender.com/](https://epsa-cotisations-audit-demo.onrender.com/)**

### Utilisation locale (Docker)
```bash
make build  # Build l'image Docker
make run    # Lance le conteneur

# ou en une commande
make start
```

Accéder à l'application : **http://localhost:3000**

---

### Architecture
- **Backend** : Fastify (Node.js + TypeScript) + script Python
- **Frontend** : React + Vite
- **Déploiement** : Docker sur Render
