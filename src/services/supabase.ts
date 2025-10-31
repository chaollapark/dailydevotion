import { createClient } from '@supabase/supabase-js';
import { Letter } from '../types/letter';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get today's letter based on month and day (ignoring year)
 */
export async function getTodaysLetter(): Promise<Letter | null> {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const monthDay = `${month}-${day}`;

  console.log(`📅 Fetching letter for ${monthDay}`);

  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('month_day', monthDay)
    .limit(1)
    .single();

  if (error) {
    console.error('❌ Error fetching letter:', error);
    throw new Error(`Failed to fetch letter for ${monthDay}: ${error.message}`);
  }

  if (!data) {
    console.log(`⚠️ No letter found for ${monthDay}`);
    return null;
  }

  console.log(`✅ Found letter to ${data.recipient} from ${data.letter_date}`);
  return data as Letter;
}

/**
 * Get a specific letter by month-day (for testing)
 */
export async function getLetterByMonthDay(monthDay: string): Promise<Letter | null> {
  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('month_day', monthDay)
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Letter;
}
