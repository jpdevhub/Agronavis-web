# Agronavis

### Intelligence for every field.

Agronavis turns satellite data, Earth observation and machine learning into simple, actionable
intelligence for agriculture.

```text
Satellite Data
      |
Earth Observation
      |
AI + Geospatial Intelligence
      |
Farm Insights
      |
Better Decisions
```

Live at **[agronavis.in](https://agronavis.in)**

---

The public website: twelve pages covering the product, who it is for, pricing, the company and
its open roles. Every form reaches a real inbox through the Agronavis API.

The product has not opened to the public yet and the site says so. Nothing on it claims a
measurement we have not taken or a customer we do not have.

Next.js and Tailwind, deployed on Vercel.

## Running it

```bash
npm install
cp .env.example .env.local
npm run dev                  # http://localhost:3000
```

Forms need the API running alongside it, from the backend repository.

| Command | |
| --- | --- |
| `npm run dev` | Development server |
| `npm run fresh` | Clear the build cache first, for when something is stale |
| `npm run build` | Production build |
| `npm run lint` | Check the code |

## Notes

Open roles are read from the API, so a role opens or closes without a deploy. The careers form
takes a CV as a PDF, a Word document or a photo, compressed before storage.

## More

`docs/development.md` for design tokens and local environment notes.
