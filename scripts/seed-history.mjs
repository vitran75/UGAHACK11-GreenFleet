/**
 * Seed battery_history table with 14 days of historical data per dealership.
 * Run once: node scripts/seed-history.js
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
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
  // Fetch all dealerships with type='dealership'
  const { data: dealers, error } = await supabase
    .from('dealerships')
    .select('*')
    .contains('type', ['dealership'])

  if (error) {
    console.error('Error fetching dealerships:', error.message)
    process.exit(1)
  }

  if (!dealers.length) {
    console.log('No dealerships found. Run the SQL seed first.')
    return
  }

  console.log(`Found ${dealers.length} dealerships. Generating history...`)

  const rows = []

  for (const dealer of dealers) {
    let count = dealer.currentBatteryCount || 0
    const rate = dealer.fillRate || 1

    // Walk backwards 14 days from current count
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const date = new Date()
      date.setDate(date.getDate() - dayOffset)
      const dateStr = date.toISOString().split('T')[0]

      rows.push({
        dealership_id: dealer.id,
        recorded_date: dateStr,
        battery_count: Math.max(0, Math.round(count)),
      })

      // Subtract one day's fill rate with +-15% jitter
      const jitter = 1 + (Math.random() * 0.3 - 0.15)
      count -= rate * jitter
    }
  }

  // Insert in batches of 100
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100)
    const { error: insertErr } = await supabase.from('battery_history').insert(batch)
    if (insertErr) {
      console.error('Insert error:', insertErr.message)
      process.exit(1)
    }
  }

  console.log(`Inserted ${rows.length} battery_history rows.`)
}

main()
