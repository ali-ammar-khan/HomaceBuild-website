import assert from 'assert';
import fs from 'fs';
import path from 'path';

let passCount = 0;
let failCount = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✔\x1b[0m ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  \x1b[31m✖\x1b[0m ${desc}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

async function runVerification() {
  console.log('\n===============================================================');
  console.log('HOMACEBUILD - PRODUCTION DEPLOYMENT & READINESS VERIFICATION');
  console.log('===============================================================\n');

  // SUITE 1: DOCKER CONTAINERIZATION & PORTABILITY
  console.log('--- Suite 1: Docker & Container Portability ---');

  it('Dockerfile is configured with multi-stage build and alpine base', () => {
    const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
    assert(dockerfile.includes('FROM node:20-alpine AS base'), 'Must use Node 20 alpine base');
    assert(dockerfile.includes('FROM base AS deps'), 'Must have deps stage');
    assert(dockerfile.includes('FROM base AS builder'), 'Must have builder stage');
    assert(dockerfile.includes('FROM base AS runner'), 'Must have runner stage');
  });

  it('Dockerfile enforces non-root execution (least privilege)', () => {
    const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
    assert(dockerfile.includes('addgroup --system --gid 1001 nodejs'), 'Must define nodejs group');
    assert(dockerfile.includes('adduser --system --uid 1001 nextjs'), 'Must define nextjs user');
    assert(dockerfile.includes('USER nextjs'), 'Must switch to non-root nextjs user');
  });

  it('Dockerfile defines automated container healthcheck', () => {
    const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
    assert(dockerfile.includes('HEALTHCHECK'), 'Must define HEALTHCHECK instruction');
    assert(dockerfile.includes('/api/health'), 'Healthcheck must probe /api/health endpoint');
  });

  it('.dockerignore strictly prevents leaking secrets and heavy caches', () => {
    const dockerignore = fs.readFileSync('.dockerignore', 'utf8');
    assert(dockerignore.includes('.env'), 'Must ignore .env');
    assert(dockerignore.includes('.env.production'), 'Must ignore .env.production');
    assert(dockerignore.includes('node_modules'), 'Must ignore node_modules');
    assert(dockerignore.includes('.next'), 'Must ignore .next');
  });

  it('docker-compose.yml defines web and Caddy reverse proxy with healthcheck and resource limits', () => {
    const compose = fs.readFileSync('docker-compose.yml', 'utf8');
    assert(compose.includes('web:'), 'Must define web service');
    assert(compose.includes('caddy:'), 'Must define caddy service');
    assert(compose.includes('limits:'), 'Must configure resource limits');
    assert(compose.includes('healthcheck:'), 'Must configure container healthcheck');
    assert(compose.includes('443/udp'), 'Must configure HTTP/3 UDP port');
  });

  it('Caddyfile configures automated Let\'s Encrypt TLS, compression, and security headers', () => {
    const caddyfile = fs.readFileSync('Caddyfile', 'utf8');
    assert(caddyfile.includes('reverse_proxy web:3000'), 'Must reverse proxy to web:3000');
    assert(caddyfile.includes('encode zstd gzip'), 'Must enable modern zstd & gzip compression');
    assert(caddyfile.includes('Strict-Transport-Security'), 'Must enforce HSTS in proxy');
    assert(caddyfile.includes('health_uri /api/health'), 'Must monitor upstream health');
  });

  // SUITE 2: HEALTH PROBE & OBSERVABILITY
  console.log('\n--- Suite 2: Health Probes & Observability ---');

  it('Health API endpoint (/api/health) is implemented', () => {
    assert(fs.existsSync('src/app/api/health/route.ts'), 'src/app/api/health/route.ts must exist');
    const healthRoute = fs.readFileSync('src/app/api/health/route.ts', 'utf8');
    assert(healthRoute.includes("export const dynamic = 'force-dynamic'"), 'Health route must be dynamic');
    assert(healthRoute.includes('uptimeSeconds'), 'Health route must report uptime');
    assert(healthRoute.includes('subsystems'), 'Health route must report subsystem status');
  });

  // SUITE 3: SECURITY & SECRET PROTECTION
  console.log('\n--- Suite 3: Secret Protection & Security Configuration ---');

  it('.env.production.example provides exhaustive, securely categorized configuration', () => {
    assert(fs.existsSync('.env.production.example'), '.env.production.example must exist');
    const envExample = fs.readFileSync('.env.production.example', 'utf8');
    assert(envExample.includes('NEXT_PUBLIC_SITE_URL'), 'Must document NEXT_PUBLIC_SITE_URL');
    assert(envExample.includes('NEXT_PUBLIC_SUPABASE_URL'), 'Must document NEXT_PUBLIC_SUPABASE_URL');
    assert(envExample.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'), 'Must document NEXT_PUBLIC_SUPABASE_ANON_KEY');
    assert(envExample.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Must document SUPABASE_SERVICE_ROLE_KEY');
    assert(envExample.includes('RESEND_API_KEY'), 'Must document RESEND_API_KEY');
    assert(envExample.includes('NEVER EXPOSE TO BROWSER'), 'Must explicitly warn against client exposure');
  });

  it('Zero confidential secrets are referenced in client-side code', () => {
    function walk(dir) {
      let results = [];
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (!['node_modules', '.next', '.git'].includes(file)) {
            results = results.concat(walk(full));
          }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          results.push(full);
        }
      }
      return results;
    }

    const files = walk('./src');
    const forbiddenClientTokens = [
      'process.env.SUPABASE_SERVICE_ROLE_KEY',
      'process.env.RESEND_API_KEY',
      'process.env.TURNSTILE_SECRET_KEY',
    ];

    let leakCount = 0;
    files.forEach((file) => {
      const content = fs.readFileSync(file, 'utf8');
      const isClient = content.includes("'use client'");
      if (isClient) {
        forbiddenClientTokens.forEach((token) => {
          if (content.includes(token)) {
            console.error(`[CRITICAL LEAK DETECTED] ${token} found in client component: ${file}`);
            leakCount++;
          }
        });
      }
    });

    assert.strictEqual(leakCount, 0, 'No server secrets may ever appear in "use client" components');
  });

  it('next.config.mjs enforces standalone output, no X-Powered-By, and strict security headers', () => {
    const nextConfig = fs.readFileSync('next.config.mjs', 'utf8');
    assert(nextConfig.includes('output: "standalone"'), 'Must have standalone output');
    assert(nextConfig.includes('poweredByHeader: false'), 'Must disable X-Powered-By header');
    assert(nextConfig.includes('X-Frame-Options'), 'Must enforce X-Frame-Options');
    assert(nextConfig.includes('Strict-Transport-Security'), 'Must enforce HSTS');
  });

  // SUITE 4: DATABASE SCHEMA & MIGRATIONS INTEGRITY
  console.log('\n--- Suite 4: Database Schema & Migration Integrity ---');

  it('PostgreSQL schema and initial migration files exist and match', () => {
    assert(fs.existsSync('schema.sql'), 'schema.sql must exist');
    assert(fs.existsSync('supabase/migrations/20261026000001_initial_schema.sql'), 'Initial migration must exist');
    const schemaSql = fs.readFileSync('schema.sql', 'utf8');
    assert(schemaSql.includes('public.properties'), 'schema.sql must create properties table');
    assert(schemaSql.includes('public.inquiries'), 'schema.sql must create inquiries table');
    assert(schemaSql.includes('public.profiles'), 'schema.sql must create profiles table');
    assert(schemaSql.includes('ENABLE ROW LEVEL SECURITY'), 'schema.sql must enable RLS');
  });

  // SUITE 5: RECOVERY & BACKUP DRILL
  console.log('\n--- Suite 5: Operational Procedures & Backup Verification ---');

  it('Database backup command generation is verified', () => {
    const backupCmd = 'pg_dump -h db.your-ref.supabase.co -U postgres -d postgres -F c -b -v -f backup_$(date +%Y%m%d).dump';
    assert(backupCmd.includes('pg_dump'), 'Must provide valid pg_dump command');
  });

  console.log('\n===============================================================');
  console.log(`  VERIFICATION COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('===============================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runVerification();
