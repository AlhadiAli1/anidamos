import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { writeFileSync } from 'node:fs'

// Dev-only endpoint so the admin page can save menu/offer/contact edits straight to
// src/data/restaurantConfig.js on disk. Commit and push the updated file to publish on Netlify.
function adminConfigApiPlugin() {
  const configPath = fileURLToPath(new URL('./src/data/restaurantConfig.js', import.meta.url))

  return {
    name: 'admin-config-api',
    configureServer(server) {
      server.middlewares.use('/api/save-config', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          try {
            const config = JSON.parse(body)
            const fileContent = `import { menuData } from "./menuData";

export const defaultOffers = ${JSON.stringify(config.offers, null, 2)};

export const defaultRestaurantConfig = {
  contact: ${JSON.stringify(config.contact, null, 2)},
  menu: ${JSON.stringify(config.menu, null, 2)},
  offers: defaultOffers,
};

export function getRestaurantConfig() {
  return defaultRestaurantConfig;
}

// Dev-only: writes straight to src/data/restaurantConfig.js via the Vite middleware in vite.config.js.
// Commit and push the updated file to publish changes on Netlify.
export async function saveRestaurantConfig(config) {
  const response = await fetch("/api/save-config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error("Failed to save changes. Make sure 'npm run dev' is running.");
  return response.json();
}
`
            writeFileSync(configPath, fileContent)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (error) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: error.message }))
          }
        })
      })
    },
  }
}

// Dev-only routing so the standalone delivery pages work under `vite dev` /
// `netlify dev` (production uses the equivalent redirects in netlify.toml).
// `/delivery-m*` -> delivery manager page, `/delivery*` -> delivery agent page.
// Only bare page routes are rewritten here; real file/asset/module requests
// (e.g. /delivery/agent.jsx) must pass through untouched.
function deliveryRoutingPlugin() {
  // Bare navigation routes only (with optional trailing slash). Subpaths like
  // /delivery/agent.jsx, /delivery/delivery.css or /@vite/... are left alone.
  const routes = [
    { match: /^\/delivery-m\/?$/, page: '/delivery/manger.html' },
    { match: /^\/delivery\/?$/, page: '/delivery/agent.html' },
    { match: /^\/track\/?$/, page: '/delivery/track.html' },
  ]
  return {
    name: 'delivery-routing',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url || '').split('?')[0]
        for (const route of routes) {
          if (route.match.test(pathname)) {
            req.url = route.page + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '')
            break
          }
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminConfigApiPlugin(), deliveryRoutingPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin/index.html', import.meta.url)),
        'delivery-manager': fileURLToPath(new URL('./delivery/manger.html', import.meta.url)),
        'delivery-agent': fileURLToPath(new URL('./delivery/agent.html', import.meta.url)),
        'delivery-track': fileURLToPath(new URL('./delivery/track.html', import.meta.url)),
      },
    },
  },
})
