// Root entry shim for Render (and any host that builds from the repo root).
// The actual API lives in nutridesh-backend/. Requiring it boots the Express
// server (it calls app.listen on load). This lets the existing Render service
// keep using `npm install` + `node server.js` after the monorepo restructure.
require('./nutridesh-backend/server.js');
