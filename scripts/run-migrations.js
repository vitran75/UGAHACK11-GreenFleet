/**
 * Run SQL migrations via Supabase REST API.
 * Usage: node scripts/run-migrations.js
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
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('=== Step 1: Check existing dealerships ===')
  const { data: existing, error: fetchErr } = await supabase
    .from('dealerships')
    .select('id, name, type')

  if (fetchErr) {
    console.error('Error fetching dealerships:', fetchErr.message)
    process.exit(1)
  }

  console.log(`Found ${existing.length} existing dealerships`)

  // Step 2: Update existing locations to type='recycling' (if they don't have a type yet)
  console.log('\n=== Step 2: Update existing Cox locations to type=recycling ===')
  const noType = existing.filter(d => !d.type)
  if (noType.length > 0) {
    for (const d of noType) {
      const { error } = await supabase
        .from('dealerships')
        .update({ type: 'recycling' })
        .eq('id', d.id)
      if (error) {
        console.error(`  Error updating ${d.name}:`, error.message)
      } else {
        console.log(`  Updated "${d.name}" -> type=recycling`)
      }
    }
  } else {
    // Check if any are already recycling
    const recycling = existing.filter(d => d.type === 'recycling')
    if (recycling.length > 0) {
      console.log(`  ${recycling.length} already set to recycling, skipping.`)
    } else {
      // Update all existing to recycling
      for (const d of existing) {
        if (d.type !== 'dealership') {
          const { error } = await supabase
            .from('dealerships')
            .update({ type: 'recycling' })
            .eq('id', d.id)
          if (error) {
            console.error(`  Error updating ${d.name}:`, error.message)
          } else {
            console.log(`  Updated "${d.name}" -> type=recycling`)
          }
        }
      }
    }
  }

  // Step 3: Insert sample dealership locations (check if they already exist)
  console.log('\n=== Step 3: Seed dealership locations ===')
  const dealershipSeeds = [
    { name: 'AutoNation Ford Atlanta', type: 'dealership', address: '2400 Peachtree Rd NW, Atlanta, GA 30305', city: 'Atlanta', state: 'GA', country: 'US', lat: 33.8463, lng: -84.3621, currentBatteryCount: 142, maxCapacity: 200, fillRate: 8 },
    { name: 'Hendrick Toyota Dallas', type: 'dealership', address: '6025 LBJ Fwy, Dallas, TX 75240', city: 'Dallas', state: 'TX', country: 'US', lat: 32.9337, lng: -96.7892, currentBatteryCount: 89, maxCapacity: 150, fillRate: 5 },
    { name: 'Penske Chevrolet Indianapolis', type: 'dealership', address: '2901 W 86th St, Indianapolis, IN 46268', city: 'Indianapolis', state: 'IN', country: 'US', lat: 39.9085, lng: -86.2360, currentBatteryCount: 45, maxCapacity: 120, fillRate: 3 },
    { name: 'Larry H. Miller Denver', type: 'dealership', address: '8101 W Colfax Ave, Lakewood, CO 80214', city: 'Lakewood', state: 'CO', country: 'US', lat: 39.7401, lng: -105.0712, currentBatteryCount: 178, maxCapacity: 250, fillRate: 12 },
    { name: 'Sewell Lexus Fort Worth', type: 'dealership', address: '5000 Bryant Irvin Rd, Fort Worth, TX 76132', city: 'Fort Worth', state: 'TX', country: 'US', lat: 32.6687, lng: -97.4111, currentBatteryCount: 67, maxCapacity: 100, fillRate: 4 },
    { name: 'Chapman BMW Phoenix', type: 'dealership', address: '1144 E Camelback Rd, Phoenix, AZ 85014', city: 'Phoenix', state: 'AZ', country: 'US', lat: 33.5094, lng: -112.0559, currentBatteryCount: 190, maxCapacity: 220, fillRate: 10 },
    { name: 'Galpin Ford Los Angeles', type: 'dealership', address: '15505 Roscoe Blvd, North Hills, CA 91343', city: 'North Hills', state: 'CA', country: 'US', lat: 34.2290, lng: -118.4881, currentBatteryCount: 30, maxCapacity: 180, fillRate: 2 },
    { name: 'Jim Ellis VW Atlanta', type: 'dealership', address: '5880 Peachtree Industrial Blvd, Chamblee, GA 30341', city: 'Chamblee', state: 'GA', country: 'US', lat: 33.8912, lng: -84.2998, currentBatteryCount: 110, maxCapacity: 140, fillRate: 7 },
  ]

  // Check which already exist
  const existingNames = existing.map(d => d.name)
  const toInsert = dealershipSeeds.filter(d => !existingNames.includes(d.name))

  if (toInsert.length === 0) {
    console.log('  All sample dealerships already exist, skipping.')
  } else {
    const { data: inserted, error: insertErr } = await supabase
      .from('dealerships')
      .insert(toInsert)
      .select()
    if (insertErr) {
      console.error('  Insert error:', insertErr.message)
    } else {
      console.log(`  Inserted ${inserted.length} dealership locations`)
    }
  }

  // Step 4: Verify final state
  console.log('\n=== Step 4: Final state ===')
  const { data: final } = await supabase
    .from('dealerships')
    .select('id, name, type')
    .order('created_at', { ascending: true })

  if (final) {
    const recycling = final.filter(d => d.type === 'recycling')
    const dealers = final.filter(d => d.type === 'dealership')
    console.log(`  ${recycling.length} recycling centers:`)
    recycling.forEach(d => console.log(`    - ${d.name}`))
    console.log(`  ${dealers.length} dealerships:`)
    dealers.forEach(d => console.log(`    - ${d.name}`))
  }

  console.log('\n=== NOTE ===')
  console.log('The battery_history and pickups tables + RLS policies must be created via')
  console.log('the Supabase Dashboard SQL editor (the anon key cannot run DDL).')
  console.log('See the SQL migration block in the plan.')
}

main().catch(console.error)
