import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'unconfigured';
  let dbLatencyMs: number | null = null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isSupabaseConfigured) {
    try {
      const dbStart = Date.now();
      const supabase = createClient();
      const { error } = await supabase
        .from('properties')
        .select('id')
        .limit(1);

      dbLatencyMs = Date.now() - dbStart;
      dbStatus = error ? `degraded: ${error.message}` : 'connected';
    } catch (err: any) {
      dbStatus = `unreachable: ${err?.message || 'unknown error'}`;
    }
  } else {
    dbStatus = 'sample_mode';
  }

  const isHealthy = dbStatus === 'connected' || dbStatus === 'sample_mode';

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'production',
      subsystems: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
      },
      durationMs: Date.now() - startTime,
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
