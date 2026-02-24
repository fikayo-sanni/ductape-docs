# Keeping the access key safe when using the client SDK from the frontend

When the **@ductape/client** SDK runs in the browser, anything you put in the bundle or in env (e.g. `VITE_ACCESS_KEY`) is visible to anyone who inspects the app. So the **access key must not be a full-power secret** if it is ever exposed. Below are strategies to keep it safe and, if you use a “public” key, how to limit abuse.

---

## 1. Never put the real access key in the frontend (recommended)

**Idea:** The browser never sees the access key. Only your backend holds it.

- **Backend-for-frontend (BFF):** Your frontend talks only to **your** API (same origin or your backend). Your backend:
  - Authenticates the **user** (session cookie, JWT from your auth, etc.).
  - Holds the Ductape **access key** (env var, secrets manager).
  - Calls Ductape (or the SDK) on the server with that key.
- **Flow:**  
  `Browser → Your API (with user auth) → Your backend uses access key → Ductape API`
- **Result:** The access key never leaves your server. “Abuse” is limited to users who can call your API, which you control (auth, rate limits, authorization).

**Implementation sketch:**

- Expose endpoints like `POST /api/ductape/actions/run`, `POST /api/ductape/databases/query`, etc.
- Each handler: (1) verify user session/JWT, (2) optionally check authorization (e.g. this user may only use this product/env), (3) call Ductape with the server-held access key, (4) return the result to the frontend.
- The frontend then either uses a thin client that talks to your API instead of Ductape, or you keep using `@ductape/client` but configure it to point at your BFF and send a **short-lived token** (see below) instead of the access key—if your backend and Ductape support that.

---

## 2. Short-lived tokens (session / JWT) instead of the access key

**Idea:** The frontend never gets the long-lived access key. It gets a **short-lived token** that your backend (or Ductape) issues.

- Your backend (with the access key) issues a **token** (e.g. JWT) that:
  - Is tied to the current user/session.
  - Expires in minutes or hours.
  - Optionally has **scope** (e.g. only certain products, envs, or operations).
- The frontend sends this token (e.g. in `Authorization: Bearer <token>`) to either:
  - Your BFF (which then uses the access key server-side), or
  - Ductape API, if it supports token-based auth.
- **Abuse:** Stealing the token gives limited time and possibly limited scope; you can revoke sessions or invalidate tokens.

**If Ductape does not yet support short-lived tokens:** Use the BFF pattern (strategy 1); the “token” is then your own session/JWT, and the BFF maps that to the server-held access key.

---

## 3. Public key designed to be safe if exposed

**Idea:** Use a key that is **intended** to be public (e.g. in the frontend) and is constrained so that abuse is limited and manageable.

To make a “public” key **safe to expose** and **hard to abuse**:

- **Scope it**
  - Restrict what the key can do: e.g. read-only, or only specific operations (e.g. `list_countries`), or only certain products/envs.
  - So even if someone steals it, they can only do what you’ve allowed.
- **Bind it**
  - Restrict by **origin** (e.g. only requests from `https://yourapp.com` via CORS or server-side checks).
  - Or restrict by **API route** (e.g. only `/client/actions/run` with a fixed allowlist of actions).
- **Rate limit**
  - Per key, per IP, or per user (if you pass a user id and the backend validates it). This limits damage from abuse and scraping.
- **Audit**
  - Log use of the key; detect abnormal patterns and revoke or rotate the key.
- **Revoke / rotate**
  - If a key is leaked or abused, revoke it and issue a new one; frontend can be updated (e.g. via config or a new deploy).

**Backend support:** This requires the Ductape backend (or your BFF) to support such keys: e.g. “public” vs “secret” keys, and permission/scope rules. If that doesn’t exist yet, implement it in your BFF (e.g. one dedicated “public” key per app that has strict limits and is the only key your frontend ever uses conceptually, while the real access key stays on the server).

---

## 4. Summary table

| Approach | Access key location | Frontend has | Abuse mitigation |
|----------|---------------------|--------------|-------------------|
| **BFF** | Server only | User session / JWT | Your auth + authz; key never exposed |
| **Short-lived token** | Server (or Ductape) | Time-limited token | Expiry + scope; revoke session |
| **Public / scoped key** | N/A (key is public) | Key safe to expose | Scope, binding, rate limit, audit, revoke |

---

## 5. What not to do

- **Do not** put the main workspace/product **access key** (the one that has full API power) in the frontend bundle or in client-side env (e.g. `VITE_ACCESS_KEY` with that secret).
- **Do not** assume that “obscuring” the key (e.g. in a minified bundle) is enough; it can be extracted.
- If you **must** use a key in the frontend, use one that is **explicitly** designed to be public (scoped, rate-limited, and revocable), not the main secret.

---

## 6. Applying this to the Paystack React example

The current example uses `VITE_ACCESS_KEY` in the browser for demos and local dev. For production:

1. **Preferred:** Move to a BFF: the React app calls your backend with the user’s session; the backend holds `ACCESS_KEY` and calls Ductape (e.g. `actions.run` for Paystack). The frontend never sees the access key.
2. **Alternative:** If you later introduce a **public** or **scoped** key (e.g. “frontend key” with limited actions and rate limits), the React app could use that in the frontend; the main access key stays on the server.
3. **Short-lived tokens:** If your backend (or Ductape) supports issuing a short-lived token for the logged-in user, the React app sends that token instead of the access key; the server still keeps the access key secret.

This doc can be extended once Ductape (or your gateway) supports public/scoped keys or short-lived tokens; the same principles (scope, bind, rate limit, audit, revoke) apply.

---

## 7. How Supabase does it

Supabase explicitly supports **two kinds of keys** so the frontend can use one without ever touching the other.

### Two keys

| Key | Safe in frontend? | Privileges | Purpose |
|-----|-------------------|------------|---------|
| **anon / publishable** (`anon` JWT or `sb_publishable_...`) | **Yes** – designed to be public | **Low** – only what Postgres allows for the `anon` / `authenticated` role | Web, mobile, CLI, source code |
| **service_role / secret** (`service_role` JWT or `sb_secret_...`) | **No – never** | **Full** – bypasses Row Level Security | Servers, Edge Functions, admin tools only |

- The **publishable/anon** key answers “*what* is calling?” (e.g. your web app). It is **intended** to be exposed in the browser, mobile app, or source code. Obfuscation is not considered security; the key is treated as public.
- The **secret/service_role** key answers “*trusted backend*”. It must only live on the server. Supabase can **reject** secret keys when they are sent from a browser (e.g. by checking `User-Agent` and returning 401).

### Why the “public” key is safe

Access is **not** enforced by hiding the key. It is enforced by **Postgres**:

1. **Row Level Security (RLS)** is enabled on tables. Policies define what the `anon` and `authenticated` roles can read/write.
2. **Who is the user?** Supabase Auth issues a **user JWT** when someone logs in. The client sends both the **publishable key** (identifies the app) and the **user JWT** (identifies the user). Postgres uses the user JWT for RLS (e.g. `auth.uid()`).
3. So: the publishable key only gets you “in the door” as that app; **data access** is then limited by RLS and the authenticated user. The key alone does not grant full DB access.

So the public key is “safe” because:
- It has **low privilege by design** (anon/authenticated role, not service_role).
- **RLS** restricts which rows can be read/updated.
- Optional: rate limiting, security advisor, and key rotation (newer publishable/secret keys can be rotated independently).

### Ductape parallels

- **Two keys:** Introduce a **publishable** (or “frontend”) key that is allowed in the browser and has limited scope (e.g. only certain routes or actions), and keep the **access key** (or “service” key) server-only and full-power.
- **Enforcement:** The backend treats the publishable key as low-privilege: e.g. only allowlisted operations, or a dedicated “anon” role that your gateway/backend maps to restricted permissions. Row- or resource-level checks (like RLS) can further limit what each request can do.
- **User identity:** When the user is logged in, the frontend sends a **user token** (e.g. your JWT or Ductape session). The backend uses that for “who is this?” and applies per-user limits or scoping; the publishable key alone does not grant full access.
- **Block secret in browser (optional):** Like Supabase, you can reject requests that send the **secret** key from a browser (e.g. via User-Agent or a header) and return 401 so the secret is never valid when used from the client.

---

## 8. Securing the frontend → BFF (proxy) connection with a publishable key

You’re already using a BFF: the frontend talks to the **proxy**, and the proxy calls Ductape. The access key should **never** be in the frontend. The frontend only needs something safe to expose—a **publishable key**—to identify the app and (optionally) the workspace. The proxy then resolves the **access key** on the server.

### How it fits together

1. **Frontend sends (only things safe to expose or short-lived):**
   - **User JWT** – `Authorization: Bearer <token>` or `x-access-token`. Identifies *who* is making the request. Required for authz.
   - **Publishable key** – Identifies *which app/workspace*. Safe to be in the browser (e.g. in env like `VITE_PUBLISHABLE_KEY`). Sent in header (e.g. `X-Publishable-Key`) or in body.
   - **Workspace / context** – e.g. `workspace_id`, or derived from the publishable key on the server.
   - **Request payload** – e.g. encrypted body (as today) or plain body; must **not** contain `access_key`.

2. **Proxy/BFF does:**
   - Validates the **user JWT** (who).
   - Validates the **publishable key** (which app/workspace) and optionally checks origin or rate limits.
   - Resolves **access_key** **only on the server** (e.g. via `validateWorkspaceAccess(user_id, workspace_id)` or a lookup by publishable_key → workspace_id → access_key). Never reads `access_key` from the request body for browser-originated requests.
   - Calls Ductape (or SDK) with the resolved access key and returns the result.

So the frontend’s connection to the BFF is “secured” by: (1) the frontend never sending the access key, and (2) the frontend sending a publishable key that is safe to expose and that the BFF uses only to resolve context and then the server-side access key.

### What is the “publishable key”?

- **Option A – Use existing `public_key`:** If your stack already sends a `public_key` (e.g. product/public key) in the proxy request and that key is considered safe to expose (it only identifies the product/workspace, not a secret), you can treat it as the publishable key. The proxy already uses it for decryption/context; ensure the proxy **never** expects `access_key` from the client when using this path and always resolves it via `validateWorkspaceAccess` or similar.
- **Option B – Dedicated publishable key per workspace:** Create a separate key per workspace (or per app) that is **only** for frontend use: store it in the DB, show it once in the dashboard, and allow it to be rotated. The frontend sends this key; the proxy looks up `publishable_key → workspace_id`, then resolves `access_key` with `validateWorkspaceAccess(user_id, workspace_id)`. This key is safe to expose by design.

### Implementation checklist (proxy/BFF)

1. **Stop requiring `access_key` from the client** for browser requests. For the encrypted-payload path you already resolve `access_key` in `decryptProxyRequest` via `validateWorkspaceAccess`; keep that. For any plain-body path used by the frontend, remove the requirement for `access_key` in the body and resolve it server-side from `user_id` + `workspace_id` (or from publishable key → workspace).
2. **Accept a publishable key** in header or body (e.g. `X-Publishable-Key` or `publishable_key`). If you use Option B, add a lookup: `publishable_key` → `workspace_id` (and optionally validate that the key is active).
3. **Optional:** Reject requests that **do** send `access_key` in the body when they look like browser requests (e.g. `User-Agent` or a header like `X-Client: web`), and return 401. That prevents someone from pasting the secret key into the frontend.
4. **Optional:** Rate limit or scope by publishable key (e.g. per-key limits, or allowlist of operations for that key).

### Implemented: publishable key on workspace_accesses

- **Storage:** Each workspace access has an optional `publishable_key` (e.g. `dpk_...`). It is generated on first use or via “Generate” in the workbench Tokens tab; it can be **revoked** (set to `null`) or **regenerated** (new value, previous invalidated).
- **API:** Workspaces expose `GET /workspaces/v1/:workspace_id/publishable-key` (get or create), `POST .../publishable-key/regenerate`, and `POST .../publishable-key/revoke` (with `user_id` in query/body and user auth).
- **Proxy:** When the frontend sends a request with **only** the publishable key (header `X-Publishable-Key` or body `publishable_key`), the proxy resolves it to `(workspace_id, user_id, access_key)` via a DB lookup on `workspace_accesses`, then **caches that mapping in memory** (TTL 5 min); Redis can be used later for multi-instance cache.
- **Scope:** Requests authenticated **only** with the publishable key (no full user JWT/access_key from client) are **restricted**: they **cannot** create, update, or fetch primitives (e.g. databases create/fetch, storage create/fetch, caches create/fetch). They **can** perform operations like **query** and other read/execute actions. The proxy enforces this with an allowlist/denylist of module methods for publishable-key auth.

### Session required in params (publishable-key flow)

When the frontend uses a **publishable key**, every request is validated by the proxy. For security, the proxy requires a **session** as a second layer of validation:

- **Session in params:** The first argument to every SDK call (the options object) **must** include a `session` property set to a valid session token. That token must be issued by **your backend** (e.g. after user auth). The frontend never starts sessions; it only receives a session token from your server and passes it in each request.
- **Example:** When calling `storage.upload`, `databases.query`, `actions.run`, etc., the options object must contain `session: '<token from backend>'`. If `session` is missing or empty, the proxy returns a validation error.
- **Sessions only on the backend:** The client SDKs (`@ductape/client`, `@ductape/react`, `@ductape/vue`) **do not allow** calling session methods (e.g. `sessions.start`, `sessions.verify`, `sessions.refresh`, `sessions.revoke`) when using a publishable key. Those methods throw on the client. Session creation, verification, refresh, and revoke must be performed **only on the backend** (e.g. in your BFF or API). Your backend starts a session (or validates the user) and returns a session token to the frontend; the frontend then includes that token in the `session` field of every Ductape request.

### Summary

- **BFF (proxy)** = frontend never has the access key; proxy has it (or resolves it server-side).
- **Publishable key** = the only key the frontend holds; it identifies the app/workspace and is safe to expose. The proxy uses it only to get context and then resolves the real access key on the server.
- **User JWT** = required for full SDK access key flow. For **publishable-key-only** flow, no JWT is sent; the publishable key is resolved to an access key and scope is limited (no create/update/fetch of primitives).
