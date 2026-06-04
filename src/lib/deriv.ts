// Deriv WebSocket client + OAuth helpers.
// Docs: https://developers.deriv.com/

export const DERIV_APP_ID =
  (typeof window !== "undefined" && localStorage.getItem("deriv_app_id")) ||
  (import.meta.env.VITE_DERIV_APP_ID as string | undefined) ||
  "1089"; // Deriv's public demo app_id — replace with your own in localStorage 'deriv_app_id' or VITE_DERIV_APP_ID

const WS_URL = `wss://ws.derivws.com/websockets/v3?app_id=${DERIV_APP_ID}&l=EN&brand=deriv`;

export type DerivAccount = { account: string; token: string; currency: string };

export function getStoredAccounts(): DerivAccount[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("deriv_accounts") || "[]");
  } catch {
    return [];
  }
}

export function storeAccounts(accs: DerivAccount[]) {
  localStorage.setItem("deriv_accounts", JSON.stringify(accs));
}

export function clearAccounts() {
  localStorage.removeItem("deriv_accounts");
  localStorage.removeItem("deriv_active_account");
}

export function getActiveAccount(): DerivAccount | null {
  const accs = getStoredAccounts();
  if (!accs.length) return null;
  const id = localStorage.getItem("deriv_active_account");
  return accs.find((a) => a.account === id) || accs[0];
}

export function setActiveAccount(loginid: string) {
  localStorage.setItem("deriv_active_account", loginid);
}

export function loginUrl() {
  return `https://oauth.deriv.com/oauth2/authorize?app_id=${DERIV_APP_ID}`;
}

// ---- WebSocket client with subscriptions + req_id routing ----
type Handler = (data: any) => void;

export class DerivClient {
  private ws: WebSocket | null = null;
  private reqId = 1;
  private pending = new Map<number, (d: any) => void>();
  private subs = new Map<string, Handler>(); // subscription id -> handler
  private msgListeners = new Set<Handler>();
  private opened = false;
  private openPromise: Promise<void> | null = null;

  connect(): Promise<void> {
    if (this.opened) return Promise.resolve();
    if (this.openPromise) return this.openPromise;
    this.openPromise = new Promise((resolve, reject) => {
      const ws = new WebSocket(WS_URL);
      this.ws = ws;
      ws.onopen = () => {
        this.opened = true;
        resolve();
      };
      ws.onerror = (e) => reject(e);
      ws.onclose = () => {
        this.opened = false;
        this.openPromise = null;
      };
      ws.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        this.msgListeners.forEach((l) => l(data));
        if (data.req_id && this.pending.has(data.req_id)) {
          const cb = this.pending.get(data.req_id)!;
          // For subscriptions, keep the callback active via subs map
          if (data.subscription?.id) {
            this.subs.set(data.subscription.id, cb);
          } else {
            this.pending.delete(data.req_id);
          }
          cb(data);
        }
      };
    });
    return this.openPromise;
  }

  onMessage(fn: Handler) {
    this.msgListeners.add(fn);
    return () => this.msgListeners.delete(fn);
  }

  async send<T = any>(payload: Record<string, any>): Promise<T> {
    await this.connect();
    const req_id = this.reqId++;
    return new Promise((resolve) => {
      this.pending.set(req_id, resolve);
      this.ws!.send(JSON.stringify({ ...payload, req_id }));
    });
  }

  subscribe(payload: Record<string, any>, handler: Handler) {
    let subId: string | null = null;
    this.send({ ...payload, subscribe: 1 }).then((first: any) => {
      const id: string | undefined = first.subscription?.id;
      if (id) {
        subId = id;
        this.subs.set(id, handler);
      }
      handler(first);
    });
    return () => {
      const id = subId;
      if (id) {
        this.send({ forget: id });
        this.subs.delete(id);
      }
    };
  }

  close() {
    this.ws?.close();
    this.ws = null;
    this.opened = false;
    this.openPromise = null;
    this.pending.clear();
    this.subs.clear();
  }
}

let _client: DerivClient | null = null;
export function getDerivClient() {
  if (!_client) _client = new DerivClient();
  return _client;
}
