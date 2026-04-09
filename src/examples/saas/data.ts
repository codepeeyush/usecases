export type IntegrationStatus = 'connected' | 'failed' | 'pending'

export interface LogEntry {
  id: string
  time: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  status: number
  duration: number
  requestBody?: string
  responseBody?: string
}

export interface Integration {
  id: string
  name: string
  description: string
  status: IntegrationStatus
  icon: string
  lastSynced: string | null
  botToken?: string
  webhookUrl?: string
  errorMessage?: string
  errorCode?: string
  scopes?: string[]
  eventCount?: number
  lastEvent?: string
  // impact metrics for failed integrations
  failingSince?: string       // human-readable: "2h 14m"
  blockedCount?: number       // notifications / events blocked
  logs: LogEntry[]
}

export const integrations: Integration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Sync payment events and revenue data.',
    status: 'connected',
    icon: 'stripe',
    lastSynced: '2 minutes ago',
    scopes: ['read_only'],
    eventCount: 1284,
    lastEvent: '2m ago',
    logs: [
      {
        id: 'l1', time: '14:31:00', method: 'GET', endpoint: '/api/stripe/events', status: 200, duration: 145,
        requestBody: 'GET /api/stripe/events?limit=20&starting_after=evt_xyz\nAuthorization: Bearer sk_live_••••••••••',
        responseBody: '{\n  "object": "list",\n  "data": [{ "id": "evt_1N..." }],\n  "has_more": true\n}',
      },
      {
        id: 'l2', time: '14:29:00', method: 'GET', endpoint: '/api/stripe/balance', status: 200, duration: 98,
        requestBody: 'GET /api/stripe/balance\nAuthorization: Bearer sk_live_••••••••••',
        responseBody: '{\n  "available": [{ "amount": 48230, "currency": "usd" }],\n  "pending": [{ "amount": 8900, "currency": "usd" }]\n}',
      },
      {
        id: 'l3', time: '14:27:00', method: 'POST', endpoint: '/api/stripe/webhook/register', status: 201, duration: 203,
        requestBody: 'POST /api/stripe/webhook/register\n{\n  "url": "https://nexus.app/webhooks/stripe",\n  "events": ["payment_intent.succeeded"]\n}',
        responseBody: '{\n  "id": "we_1N...",\n  "status": "enabled"\n}',
      },
    ],
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Link commits and PRs to CRM deals.',
    status: 'connected',
    icon: 'github',
    lastSynced: '14 minutes ago',
    scopes: ['repo', 'read:org'],
    eventCount: 342,
    lastEvent: '14m ago',
    logs: [
      {
        id: 'l1', time: '14:18:00', method: 'GET', endpoint: '/api/github/repos', status: 200, duration: 312,
        requestBody: 'GET /api/github/repos?per_page=30\nAuthorization: token ghp_••••••••••',
        responseBody: '[\n  { "id": 123, "name": "nexus-core", "private": true },\n  { "id": 124, "name": "nexus-api", "private": true }\n]',
      },
      {
        id: 'l2', time: '14:17:00', method: 'GET', endpoint: '/api/github/pulls', status: 200, duration: 187,
        requestBody: 'GET /api/github/pulls?state=open\nAuthorization: token ghp_••••••••••',
        responseBody: '[\n  { "number": 42, "title": "feat: new dashboard", "state": "open" }\n]',
      },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send notifications and alerts to Slack channels.',
    status: 'failed',
    icon: 'slack',
    lastSynced: null,
    botToken: 'xoxb-invalid-4892301',
    webhookUrl: 'https://hooks.slack.com/services/T00000/B00000/XXXXXXXX',
    errorMessage: 'Invalid token — Your Bot Token may have expired or been revoked.',
    errorCode: '401 Unauthorized',
    scopes: ['chat:write', 'channels:read', 'users:read'],
    failingSince: '2h 14m',
    blockedCount: 47,
    logs: [
      {
        id: 'l1', time: '14:32:01', method: 'POST', endpoint: '/api/slack/test-connection', status: 401, duration: 234,
        requestBody: 'POST /api/slack/test-connection\nAuthorization: Bearer xoxb-invalid-4892301\nContent-Type: application/json\n\n{ "channel": "#alerts" }',
        responseBody: '{\n  "ok": false,\n  "error": "invalid_auth",\n  "needed": "chat:write",\n  "provided": "none"\n}',
      },
      {
        id: 'l2', time: '14:31:45', method: 'POST', endpoint: '/api/slack/refresh-token', status: 400, duration: 156,
        requestBody: 'POST /api/slack/refresh-token\n{\n  "grant_type": "refresh_token",\n  "refresh_token": "xoxe-1-..."\n}',
        responseBody: '{\n  "ok": false,\n  "error": "token_revoked"\n}',
      },
      {
        id: 'l3', time: '14:30:12', method: 'GET', endpoint: '/api/slack/status', status: 401, duration: 89,
        requestBody: 'GET /api/slack/status\nAuthorization: Bearer xoxb-invalid-4892301',
        responseBody: '{\n  "ok": false,\n  "error": "invalid_auth"\n}',
      },
      {
        id: 'l4', time: '14:28:50', method: 'GET', endpoint: '/api/slack/channels', status: 401, duration: 112,
        requestBody: 'GET /api/slack/channels?limit=100\nAuthorization: Bearer xoxb-invalid-4892301',
        responseBody: '{\n  "ok": false,\n  "error": "invalid_auth"\n}',
      },
    ],
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automate workflows across 5,000+ apps.',
    status: 'pending',
    icon: 'zapier',
    lastSynced: null,
    scopes: [],
    logs: [],
  },
]

// Live log templates for connected integrations (used in simulation)
export const liveLogTemplates: Record<string, Omit<LogEntry, 'id' | 'time'>[]> = {
  stripe: [
    { method: 'GET', endpoint: '/api/stripe/events', status: 200, duration: 0,
      requestBody: 'GET /api/stripe/events?limit=20\nAuthorization: Bearer sk_live_••••••••••',
      responseBody: '{\n  "object": "list",\n  "data": [{ "id": "evt_new..." }],\n  "has_more": false\n}' },
    { method: 'POST', endpoint: '/api/stripe/webhook/verify', status: 200, duration: 0,
      requestBody: 'POST /api/stripe/webhook/verify\n{ "signature": "t=...,v1=..." }',
      responseBody: '{ "verified": true, "event_type": "payment_intent.succeeded" }' },
    { method: 'GET', endpoint: '/api/stripe/customers', status: 200, duration: 0,
      requestBody: 'GET /api/stripe/customers?limit=10\nAuthorization: Bearer sk_live_••••••••••',
      responseBody: '{ "data": [{ "id": "cus_...", "email": "user@example.com" }] }' },
  ],
  github: [
    { method: 'GET', endpoint: '/api/github/events', status: 200, duration: 0,
      requestBody: 'GET /api/github/events\nAuthorization: token ghp_••••••••••',
      responseBody: '[{ "type": "PushEvent", "repo": "nexus-core" }]' },
    { method: 'GET', endpoint: '/api/github/pulls', status: 200, duration: 0,
      requestBody: 'GET /api/github/pulls?state=all\nAuthorization: token ghp_••••••••••',
      responseBody: '[{ "number": 43, "title": "fix: auth middleware", "state": "open" }]' },
  ],
}
