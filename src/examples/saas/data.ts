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
  webhookSecret?: string
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
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sync contacts, deals, and CRM activity.',
    status: 'failed',
    icon: 'hubspot',
    lastSynced: null,
    scopes: ['contacts:read'],
    errorMessage: 'Insufficient OAuth scopes — crm.contacts.write permission not granted.',
    errorCode: '403 Forbidden',
    failingSince: '45m',
    blockedCount: 312,
    logs: [
      {
        id: 'l1', time: '14:28:14', method: 'POST', endpoint: '/api/hubspot/contacts/sync', status: 403, duration: 201,
        requestBody: 'POST /api/hubspot/contacts/sync\nAuthorization: Bearer pat-na1-••••••••••\nContent-Type: application/json\n\n{ "contacts": [{ "email": "lead@example.com", "firstname": "Alex" }] }',
        responseBody: '{\n  "status": "error",\n  "message": "This app hasn\'t been granted all required scopes to make this call. Required scopes: crm.contacts.write.",\n  "correlationId": "3f8e2a1b-..."\n}',
      },
      {
        id: 'l2', time: '14:24:50', method: 'POST', endpoint: '/api/hubspot/contacts/sync', status: 403, duration: 188,
        requestBody: 'POST /api/hubspot/contacts/sync\nAuthorization: Bearer pat-na1-••••••••••\n\n{ "contacts": [{ "email": "prospect@acme.com" }] }',
        responseBody: '{\n  "status": "error",\n  "message": "This app hasn\'t been granted all required scopes to make this call. Required scopes: crm.contacts.write.",\n  "correlationId": "9d4c7b2e-..."\n}',
      },
      {
        id: 'l3', time: '14:19:02', method: 'GET', endpoint: '/api/hubspot/contacts', status: 200, duration: 143,
        requestBody: 'GET /api/hubspot/contacts?limit=10\nAuthorization: Bearer pat-na1-••••••••••',
        responseBody: '{\n  "total": 2418,\n  "results": [{ "id": "101", "properties": { "email": "lead@example.com" } }]\n}',
      },
    ],
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Sync leads, opportunities, and account data.',
    status: 'failed',
    icon: 'salesforce',
    lastSynced: null,
    scopes: ['api', 'refresh_token'],
    errorMessage: 'Salesforce API limit reached — 15,000 of 15,000 daily calls consumed.',
    errorCode: '429 Too Many Requests',
    failingSince: '1h 2m',
    blockedCount: 891,
    logs: [
      {
        id: 'l1', time: '14:30:00', method: 'GET', endpoint: '/api/salesforce/limits', status: 200, duration: 91,
        requestBody: 'GET /services/data/v59.0/limits\nAuthorization: Bearer 00D5g000••••••••••',
        responseBody: '{\n  "DailyApiRequests": { "Max": 15000, "Remaining": 0 },\n  "DailyBulkV2QueryJobs": { "Max": 10000, "Remaining": 9874 }\n}',
      },
      {
        id: 'l2', time: '14:30:01', method: 'GET', endpoint: '/api/salesforce/leads/sync', status: 429, duration: 56,
        requestBody: 'GET /services/data/v59.0/query?q=SELECT+Id,Name+FROM+Lead\nAuthorization: Bearer 00D5g000••••••••••',
        responseBody: '[\n  {\n    "message": "Request limit exceeded. Daily org API usage exceeded.",\n    "errorCode": "REQUEST_LIMIT_EXCEEDED"\n  }\n]',
      },
      {
        id: 'l3', time: '13:28:44', method: 'POST', endpoint: '/api/salesforce/opportunities/upsert', status: 429, duration: 48,
        requestBody: 'POST /services/data/v59.0/composite/batch\nAuthorization: Bearer 00D5g000••••••••••\n\n{ "batchRequests": [{ "method": "PATCH", "url": "/v59.0/sobjects/Opportunity/0065g00000••" }] }',
        responseBody: '[\n  {\n    "message": "Request limit exceeded.",\n    "errorCode": "REQUEST_LIMIT_EXCEEDED"\n  }\n]',
      },
    ],
  },
  {
    id: 'intercom',
    name: 'Intercom',
    description: 'Route support conversations and sync user events.',
    status: 'failed',
    icon: 'intercom',
    lastSynced: null,
    webhookUrl: 'https://nexus.app/webhooks/intercom',
    webhookSecret: 'whsec_stale_a3f9d2••••••••••',
    scopes: ['read_admins', 'write_conversations'],
    errorMessage: 'Webhook signature validation failed — HMAC mismatch. Secret may have been rotated.',
    errorCode: '400 Bad Request',
    failingSince: '3d 7h',
    blockedCount: 2140,
    logs: [
      {
        id: 'l1', time: '14:31:55', method: 'POST', endpoint: '/webhooks/intercom', status: 400, duration: 12,
        requestBody: 'POST /webhooks/intercom\nX-Hub-Signature: sha1=a1b2c3d4e5f6••••••••••\nContent-Type: application/json\n\n{ "type": "conversation.user.created", "data": { "item": { "id": "conv_001" } } }',
        responseBody: '{\n  "type": "error.list",\n  "errors": [{ "code": "unauthorized", "message": "Invalid signature. Ensure the secret matches the one configured in Intercom." }]\n}',
      },
      {
        id: 'l2', time: '14:29:10', method: 'POST', endpoint: '/webhooks/intercom', status: 400, duration: 11,
        requestBody: 'POST /webhooks/intercom\nX-Hub-Signature: sha1=f7e8d9c0b1a2••••••••••\nContent-Type: application/json\n\n{ "type": "conversation.admin.replied", "data": { "item": { "id": "conv_002" } } }',
        responseBody: '{\n  "type": "error.list",\n  "errors": [{ "code": "unauthorized", "message": "Invalid signature. Ensure the secret matches the one configured in Intercom." }]\n}',
      },
      {
        id: 'l3', time: '14:26:33', method: 'POST', endpoint: '/webhooks/intercom', status: 400, duration: 10,
        requestBody: 'POST /webhooks/intercom\nX-Hub-Signature: sha1=2c3d4e5f6a7b••••••••••\nContent-Type: application/json\n\n{ "type": "user.created", "data": { "item": { "id": "usr_409" } } }',
        responseBody: '{\n  "type": "error.list",\n  "errors": [{ "code": "unauthorized", "message": "Invalid signature." }]\n}',
      },
    ],
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Link issues and sprints to CRM deals and contacts.',
    status: 'connected',
    icon: 'jira',
    lastSynced: '8 minutes ago',
    scopes: ['read:jira-work', 'write:jira-work'],
    eventCount: 567,
    lastEvent: '8m ago',
    logs: [
      {
        id: 'l1', time: '14:24:00', method: 'GET', endpoint: '/api/jira/issues', status: 200, duration: 274,
        requestBody: 'GET /rest/api/3/search?jql=project=NEXUS+AND+updated>=-1w\nAuthorization: Basic ••••••••••',
        responseBody: '{\n  "total": 42,\n  "issues": [{ "key": "NEXUS-88", "fields": { "summary": "Onboarding flow v2" } }]\n}',
      },
      {
        id: 'l2', time: '14:22:15', method: 'PUT', endpoint: '/api/jira/issues/NEXUS-87', status: 200, duration: 198,
        requestBody: 'PUT /rest/api/3/issue/NEXUS-87\nAuthorization: Basic ••••••••••\n\n{ "fields": { "status": { "name": "Done" } } }',
        responseBody: '{}',
      },
    ],
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Deliver transactional and marketing emails.',
    status: 'connected',
    icon: 'sendgrid',
    lastSynced: '1 minute ago',
    scopes: ['mail.send', 'stats.read'],
    eventCount: 8924,
    lastEvent: '1m ago',
    logs: [
      {
        id: 'l1', time: '14:32:44', method: 'POST', endpoint: '/api/sendgrid/mail/send', status: 202, duration: 311,
        requestBody: 'POST /v3/mail/send\nAuthorization: Bearer SG.••••••••••\n\n{ "to": [{ "email": "user@example.com" }], "subject": "Your invoice is ready", "template_id": "d-abc123" }',
        responseBody: '(empty — 202 Accepted)',
      },
      {
        id: 'l2', time: '14:31:02', method: 'GET', endpoint: '/api/sendgrid/stats', status: 200, duration: 155,
        requestBody: 'GET /v3/stats?start_date=2024-01-01\nAuthorization: Bearer SG.••••••••••',
        responseBody: '[\n  { "date": "2024-01-10", "stats": [{ "metrics": { "delivered": 412, "opens": 198, "bounces": 3 } }] }\n]',
      },
    ],
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
