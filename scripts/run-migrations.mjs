/**
 * Run data migrations via Supabase REST API.
 * Usage: node scripts/run-migrations.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  // First try inserting WITHOUT type to test the table
  console.log('=== Step 1: Test insert without type ===')
  const testInsert = {
    name: 'Test Location',
    address: 'Test',
    city: 'Test',
    state: 'GA',
    country: 'US',
    lat: 33.0,
    lng: -84.0,
    currentBatteryCount: 0,
    maxCapacity: 100,
    fillRate: 1
  }

  const { data: testData, error: testErr } = await supabase
    .from('dealerships')
    .insert([testInsert])
    .select()

  if (testErr) {
    console.error('Test insert error:', testErr.message)
    console.error('Full error:', JSON.stringify(testErr))
  } else {
    console.log('Test insert succeeded:', testData[0]?.id)
    // Check what columns exist
    console.log('Columns returned:', Object.keys(testData[0]))

    // Clean up test
    await supabase.from('dealerships').delete().eq('id', testData[0].id)
    console.log('Test row cleaned up')
  }

  // Now try with type column
  console.log('\n=== Step 2: Test insert WITH type ===')
  const testInsert2 = { ...testInsert, name: 'Test Location 2', type: ['dealership'] }
  const { data: testData2, error: testErr2 } = await supabase
    .from('dealerships')
    .insert([testInsert2])
    .select()

  if (testErr2) {
    console.error('Insert with type error:', testErr2.message)
    console.log('\nThe "type" column likely needs to be added or has wrong type.')
    console.log('Please run this SQL in Supabase Dashboard:\n')
    console.log('ALTER TABLE dealerships ADD COLUMN IF NOT EXISTS type text DEFAULT \'recycling\';')
    console.log('\nThen re-run this script.')
  } else {
    console.log('Insert with type succeeded')
    await supabase.from('dealerships').delete().eq('id', testData2[0].id)
    console.log('Test row cleaned up')

    // Proceed with actual seeding
    await seedData()
  }
}

async function seedData() {
  console.log('\n=== Step 3: Check existing data ===')
  const { data: existing } = await supabase
    .from('dealerships')
    .select('id, name, type')

  console.log(`Found ${existing?.length || 0} existing rows`)

  // Update existing without type to recycling
  if (existing) {
    for (const d of existing) {
      if (!d.type) {
        await supabase.from('dealerships').update({ type: 'recycling' }).eq('id', d.id)
        console.log(`  Set "${d.name}" -> recycling`)
      }
    }
  }

  // Seed dealerships
  console.log('\n=== Step 4: Seed dealership locations ===')
  const seeds = [
    { name: 'AutoNation Ford Atlanta', type: ['dealership'], address: '2400 Peachtree Rd NW, Atlanta, GA 30305', city: 'Atlanta', state: 'GA', country: 'US', lat: 33.8463, lng: -84.3621, currentBatteryCount: 142, maxCapacity: 200, fillRate: 8 },
    { name: 'Hendrick Toyota Dallas', type: ['dealership'], address: '6025 LBJ Fwy, Dallas, TX 75240', city: 'Dallas', state: 'TX', country: 'US', lat: 32.9337, lng: -96.7892, currentBatteryCount: 89, maxCapacity: 150, fillRate: 5 },
    { name: 'Penske Chevrolet Indianapolis', type: ['dealership'], address: '2901 W 86th St, Indianapolis, IN 46268', city: 'Indianapolis', state: 'IN', country: 'US', lat: 39.9085, lng: -86.2360, currentBatteryCount: 45, maxCapacity: 120, fillRate: 3 },
    { name: 'Larry H. Miller Denver', type: ['dealership'], address: '8101 W Colfax Ave, Lakewood, CO 80214', city: 'Lakewood', state: 'CO', country: 'US', lat: 39.7401, lng: -105.0712, currentBatteryCount: 178, maxCapacity: 250, fillRate: 12 },
    { name: 'Sewell Lexus Fort Worth', type: ['dealership'], address: '5000 Bryant Irvin Rd, Fort Worth, TX 76132', city: 'Fort Worth', state: 'TX', country: 'US', lat: 32.6687, lng: -97.4111, currentBatteryCount: 67, maxCapacity: 100, fillRate: 4 },
    { name: 'Chapman BMW Phoenix', type: ['dealership'], address: '1144 E Camelback Rd, Phoenix, AZ 85014', city: 'Phoenix', state: 'AZ', country: 'US', lat: 33.5094, lng: -112.0559, currentBatteryCount: 190, maxCapacity: 220, fillRate: 10 },
    { name: 'Galpin Ford Los Angeles', type: ['dealership'], address: '15505 Roscoe Blvd, North Hills, CA 91343', city: 'North Hills', state: 'CA', country: 'US', lat: 34.2290, lng: -118.4881, currentBatteryCount: 30, maxCapacity: 180, fillRate: 2 },
    { name: 'Jim Ellis VW Atlanta', type: ['dealership'], address: '5880 Peachtree Industrial Blvd, Chamblee, GA 30341', city: 'Chamblee', state: 'GA', country: 'US', lat: 33.8912, lng: -84.2998, currentBatteryCount: 110, maxCapacity: 140, fillRate: 7 },
  ]

  const existingNames = (existing || []).map(d => d.name)
  const toInsert = seeds.filter(d => !existingNames.includes(d.name))

  if (toInsert.length === 0) {
    console.log('  All already exist')
  } else {
    const { data: inserted, error: insertErr } = await supabase
      .from('dealerships')
      .insert(toInsert)
      .select()
    if (insertErr) {
      console.error('  Insert error:', insertErr.message)
    } else {
      console.log(`  Inserted ${inserted.length} dealerships`)
    }
  }

  // Final state
  console.log('\n=== Final state ===')
  const { data: final } = await supabase.from('dealerships').select('id, name, type').order('created_at')
  if (final) {
    const r = final.filter(d => d.type === 'recycling')
    const d = final.filter(d => d.type === 'dealership')
    console.log(`  ${r.length} recycling centers:`)
    r.forEach(x => console.log(`    - ${x.name}`))
    console.log(`  ${d.length} dealerships:`)
    d.forEach(x => console.log(`    - ${x.name}`))
  }
}

main().catch(console.error)
