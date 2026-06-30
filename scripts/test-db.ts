import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function test() {
  console.log('🔌 Testing connection...\n');
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const r = await sql`SELECT NOW() as time`;
    console.log('✅ Connected! Time:', r[0].time);
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('📊 Tables:', tables.length);
    tables.forEach((t: any) => console.log('   -', t.table_name));
  } catch (e: any) {
    console.error('❌ Failed:', e.message);
  }
}
test();
