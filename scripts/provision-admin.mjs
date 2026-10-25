#!/usr/bin/env node
/**
 * scripts/provision-admin.mjs
 * 
 * Secure Initial-Admin Provisioning Script for HomaceBuild and Realators.
 * Uses Supabase Service Role Key to safely provision or elevate the owner/admin
 * account without exposing administrative privileges to public registration.
 *
 * Usage:
 *   node scripts/provision-admin.mjs --email owner@homacebuild.com --password YourSecurePassword123! --name "Homace Admin"
 * 
 * Or pass via environment variables:
 *   ADMIN_EMAIL=owner@homacebuild.com ADMIN_PASSWORD=... ADMIN_NAME=... node scripts/provision-admin.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to parse simple .env files without external dependencies
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  }
  return env;
}

// Merge .env.local and .env into process.env if not already set
const localEnv = loadEnvFile(path.join(rootDir, '.env.local'));
const baseEnv = loadEnvFile(path.join(rootDir, '.env'));
for (const [k, v] of Object.entries({ ...baseEnv, ...localEnv })) {
  if (!process.env[k]) {
    process.env[k] = v;
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    email: process.env.ADMIN_EMAIL || '',
    password: process.env.ADMIN_PASSWORD || '',
    name: process.env.ADMIN_NAME || 'Homace Owner',
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--email' && args[i + 1]) {
      options.email = args[++i];
    } else if (arg === '--password' && args[i + 1]) {
      options.password = args[++i];
    } else if (arg === '--name' && args[i + 1]) {
      options.name = args[++i];
    }
  }

  return options;
}

function printUsage() {
  console.log(`
===================================================================
HOMACEBUILD AND REALATORS - INITIAL ADMIN PROVISIONING TOOL
===================================================================

This script creates or updates an owner/administrator account with
the 'admin' role in Supabase. Public registration is restricted to
'agent' privileges, ensuring tamper-proof administrative security.

Usage:
  node scripts/provision-admin.mjs [options]

Options:
  --email <email>        Staff or owner email address (Required)
  --password <password>  Secure password for account (Min 8 chars, Required)
  --name <fullName>      Full name of administrator (Default: "Homace Owner")
  --dry-run              Validate configuration without writing to Supabase
  --help, -h             Display this help message

Environment Variables (Alternative to flags):
  ADMIN_EMAIL            Admin email address
  ADMIN_PASSWORD         Admin password
  ADMIN_NAME             Full name
  NEXT_PUBLIC_SUPABASE_URL    Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY   Service role administrative secret
===================================================================
`);
}

export async function provisionAdmin(options = parseArgs()) {
  if (options.help) {
    printUsage();
    return { success: true, message: 'Help displayed.' };
  }

  console.log('---------------------------------------------------------------');
  console.log('Starting Initial-Admin Provisioning Process...');
  console.log('---------------------------------------------------------------');

  // 1. Validation
  if (!options.email || !options.email.includes('@')) {
    console.error('Error: A valid email address is required (use --email or ADMIN_EMAIL).');
    return { success: false, error: 'Invalid or missing email.' };
  }

  if (!options.password || options.password.length < 8) {
    console.error('Error: A secure password of at least 8 characters is required (use --password or ADMIN_PASSWORD).');
    return { success: false, error: 'Password must be at least 8 characters.' };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isConfigured = supabaseUrl && serviceRoleKey && !supabaseUrl.includes('placeholder') && !serviceRoleKey.includes('placeholder');

  console.log(`- Target Email: ${options.email}`);
  console.log(`- Full Name:    ${options.name}`);
  console.log(`- Supabase URL: ${supabaseUrl || 'NOT CONFIGURED'}`);

  if (options.dryRun) {
    console.log('\n[DRY RUN MODE] Configuration and inputs are valid.');
    return { success: true, dryRun: true };
  }

  if (!isConfigured) {
    console.warn('\n[WARNING] Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are placeholder or missing.');
    console.warn('To provision against a live instance, define them in .env.local or your production host environment.');
    return {
      success: false,
      error: 'Supabase credentials missing or set to placeholder.',
    };
  }

  // 2. Connect via Supabase Admin Client (Service Role)
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // 3. Check if user already exists
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const existingUser = usersData?.users?.find(
      (u) => u.email?.toLowerCase() === options.email.toLowerCase()
    );

    let userId = existingUser?.id;

    if (existingUser) {
      console.log(`- Existing auth user found with ID: ${userId}. Updating credentials...`);
      const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        {
          password: options.password,
          email_confirm: true,
          user_metadata: { full_name: options.name },
        }
      );
      if (updateError) {
        throw new Error(`Failed to update existing user: ${updateError.message}`);
      }
    } else {
      console.log('- Creating new auth user in Supabase Auth...');
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email: options.email,
        password: options.password,
        email_confirm: true,
        user_metadata: { full_name: options.name },
      });
      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
      }
      userId = created.user.id;
      console.log(`- Auth user created successfully with ID: ${userId}`);
    }

    // 4. Upsert/elevate profile in public.profiles table with role: 'admin'
    console.log(`- Elevating profile permissions for user ID ${userId} to role: 'admin'...`);
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: options.name,
        role: 'admin',
        is_active: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (profileError) {
      throw new Error(`Failed to update public.profiles: ${profileError.message}`);
    }

    console.log('\n===============================================================');
    console.log('SUCCESS: Initial owner/administrator account is fully provisioned!');
    console.log(`Email:    ${options.email}`);
    console.log(`Role:     admin`);
    console.log(`Login:    /login -> Staff Administration Portal`);
    console.log('===============================================================\n');

    return { success: true, userId, email: options.email, role: 'admin' };
  } catch (err) {
    console.error('\n[PROVISIONING FAILED]', err.message || err);
    return { success: false, error: err.message };
  }
}

// Direct CLI invocation
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const options = parseArgs();
  provisionAdmin(options).then((res) => {
    if (!res.success && !res.dryRun && !options.help) {
      process.exit(1);
    }
  });
}
