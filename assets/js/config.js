// Set API_BASE to your deployed Worker URL (no trailing slash). Local dev: http://localhost:8787
// Contains no secrets. Admin sign-in is handled by Cloudflare Access.
window.CF_CONFIG = {
  API_BASE: 'http://localhost:8787',
  ACCESS_LOGOUT_URL: '' // optional: https://<team>.cloudflareaccess.com/cdn-cgi/access/logout
};
