import { supabase } from './supabase';
import { Letter } from '../types/letter';

/**
 * Database Activity Service
 * 
 * This service performs various database operations to maintain activity
 * and prevent Supabase from pausing the project due to inactivity.
 * 
 * Supabase free projects are paused after 1 week of "extremely low activity".
 * This service ensures regular database interactions through various queries.
 */

interface ActivityStats {
  totalQueries: number;
  totalRows: number;
  executionTime: number;
  timestamp: string;
}

/**
 * Performs a comprehensive database activity session
 * This includes multiple types of queries to simulate real usage
 */
export async function performDatabaseActivity(): Promise<ActivityStats> {
  const startTime = Date.now();
  let totalQueries = 0;
  let totalRows = 0;

  console.log('🔄 Starting database activity session...');
  console.log('=====================================');

  try {
    // Activity 1: Health check with count
    console.log('🏥 Health check: Counting total letters...');
    const { count: letterCount, error: countError } = await supabase
      .from('letters')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    totalQueries++;
    console.log(`   ✅ Found ${letterCount} letters in database`);

    // Activity 2: Sample recent letters
    console.log('📋 Sampling recent letters...');
    const { data: recentLetters, error: recentError } = await supabase
      .from('letters')
      .select('id, recipient, letter_date, word_count')
      .order('letter_date', { ascending: false })
      .limit(10);
    
    if (recentError) throw recentError;
    totalQueries++;
    totalRows += recentLetters?.length || 0;
    console.log(`   ✅ Retrieved ${recentLetters?.length || 0} recent letters`);

    // Activity 3: Search by recipient patterns
    console.log('👥 Analyzing recipient patterns...');
    const recipients = ['Brahmananda', 'Tamal', 'Ramesvara', 'Jayatirtha', 'Satsvarupa'];
    const randomRecipient = recipients[Math.floor(Math.random() * recipients.length)];
    
    const { data: recipientLetters, error: recipientError } = await supabase
      .from('letters')
      .select('id, recipient, location, word_count')
      .ilike('recipient', `%${randomRecipient}%`)
      .limit(5);
    
    if (recipientError) throw recipientError;
    totalQueries++;
    totalRows += recipientLetters?.length || 0;
    console.log(`   ✅ Found ${recipientLetters?.length || 0} letters to recipients matching "${randomRecipient}"`);

    // Activity 4: Location-based queries
    console.log('🌍 Analyzing location data...');
    const locations = ['Vrindavan', 'Mayapur', 'Los Angeles', 'London', 'Bombay', 'New York'];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    const { data: locationLetters, error: locationError } = await supabase
      .from('letters')
      .select('id, location, recipient, letter_date')
      .ilike('location', `%${randomLocation}%`)
      .limit(8);
    
    if (locationError) throw locationError;
    totalQueries++;
    totalRows += locationLetters?.length || 0;
    console.log(`   ✅ Found ${locationLetters?.length || 0} letters from locations matching "${randomLocation}"`);

    // Activity 5: Word count analysis
    console.log('📊 Performing word count analysis...');
    const { data: shortLetters, error: shortError } = await supabase
      .from('letters')
      .select('id, word_count, recipient')
      .lt('word_count', 100)
      .order('word_count', { ascending: true })
      .limit(5);
    
    const { data: longLetters, error: longError } = await supabase
      .from('letters')
      .select('id, word_count, recipient')
      .gt('word_count', 1000)
      .order('word_count', { ascending: false })
      .limit(5);
    
    if (shortError) throw shortError;
    if (longError) throw longError;
    totalQueries += 2;
    totalRows += (shortLetters?.length || 0) + (longLetters?.length || 0);
    console.log(`   ✅ Found ${shortLetters?.length || 0} short letters, ${longLetters?.length || 0} long letters`);

    // Activity 6: Date range queries
    console.log('📅 Analyzing date patterns...');
    const currentYear = new Date().getFullYear();
    const randomYear = Math.floor(Math.random() * 15) + 1970; // 1970-1985
    
    const { data: yearLetters, error: yearError } = await supabase
      .from('letters')
      .select('id, letter_date, recipient, location')
      .gte('letter_date', `${randomYear}-01-01`)
      .lt('letter_date', `${randomYear + 1}-01-01`)
      .limit(10);
    
    if (yearError) throw yearError;
    totalQueries++;
    totalRows += yearLetters?.length || 0;
    console.log(`   ✅ Found ${yearLetters?.length || 0} letters from year ${randomYear}`);

    // Activity 7: Text search simulation
    console.log('🔍 Performing text search simulation...');
    const searchTerms = ['Krishna', 'devotee', 'temple', 'spiritual', 'service'];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    const { data: searchResults, error: searchError } = await supabase
      .from('letters')
      .select('id, recipient, body')
      .textSearch('body', randomTerm)
      .limit(3);
    
    if (searchError) {
      // Text search might not be available, fallback to ilike
      const { data: fallbackResults, error: fallbackError } = await supabase
        .from('letters')
        .select('id, recipient, body')
        .ilike('body', `%${randomTerm}%`)
        .limit(3);
      
      if (fallbackError) throw fallbackError;
      totalQueries++;
      totalRows += fallbackResults?.length || 0;
      console.log(`   ✅ Found ${fallbackResults?.length || 0} letters containing "${randomTerm}" (fallback search)`);
    } else {
      totalQueries++;
      totalRows += searchResults?.length || 0;
      console.log(`   ✅ Found ${searchResults?.length || 0} letters containing "${randomTerm}"`);
    }

    // Activity 8: Random sampling
    console.log('🎲 Random letter sampling...');
    const { data: randomSample, error: randomError } = await supabase
      .from('letters')
      .select('id, recipient, letter_date, location, word_count')
      .order('id')
      .range(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000) + 5);
    
    if (randomError) throw randomError;
    totalQueries++;
    totalRows += randomSample?.length || 0;
    console.log(`   ✅ Retrieved ${randomSample?.length || 0} random letters`);

    const executionTime = Date.now() - startTime;
    const stats: ActivityStats = {
      totalQueries,
      totalRows,
      executionTime,
      timestamp: new Date().toISOString()
    };

    console.log('\n📈 Activity Session Summary:');
    console.log('============================');
    console.log(`🔢 Total Queries: ${totalQueries}`);
    console.log(`📄 Total Rows Retrieved: ${totalRows}`);
    console.log(`⏱️  Execution Time: ${executionTime}ms`);
    console.log(`🕐 Completed At: ${new Date().toLocaleString()}`);
    console.log('✅ Database activity session completed successfully!\n');

    return stats;

  } catch (error) {
    console.error('❌ Database activity session failed:', error);
    throw error;
  }
}

/**
 * Lightweight activity check - performs minimal queries to maintain connection
 */
export async function performLightActivity(): Promise<void> {
  console.log('⚡ Performing lightweight database activity...');
  
  try {
    // Simple count query
    const { count } = await supabase
      .from('letters')
      .select('*', { count: 'exact', head: true });
    
    // Simple select query
    const { data } = await supabase
      .from('letters')
      .select('id')
      .limit(1);
    
    console.log(`✅ Light activity completed - ${count} letters in database`);
    
  } catch (error) {
    console.error('❌ Light activity failed:', error);
    throw error;
  }
}

/**
 * Get upcoming letters for preview (generates activity)
 */
export async function getUpcomingLettersActivity(days: number = 7): Promise<Letter[]> {
  console.log(`📅 Fetching upcoming letters for next ${days} days...`);
  
  const dates = [];
  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    dates.push(monthDay);
  }
  
  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .in('month_day', dates)
    .order('month_day');
  
  if (error) {
    console.error('❌ Error fetching upcoming letters:', error);
    throw error;
  }
  
  console.log(`✅ Found ${data?.length || 0} upcoming letters`);
  return data || [];
}

/**
 * Database statistics gathering (generates multiple queries)
 */
export async function gatherDatabaseStats(): Promise<{
  totalLetters: number;
  uniqueRecipients: number;
  avgWordCount: number;
  dateRange: { earliest: string; latest: string };
}> {
  console.log('📊 Gathering comprehensive database statistics...');
  
  // Count total letters
  const { count: totalLetters } = await supabase
    .from('letters')
    .select('*', { count: 'exact', head: true });
  
  // Get all recipients for uniqueness calculation
  const { data: recipients } = await supabase
    .from('letters')
    .select('recipient');
  
  const uniqueRecipients = new Set(recipients?.map(r => r.recipient)).size;
  
  // Get word count data
  const { data: wordCounts } = await supabase
    .from('letters')
    .select('word_count');
  
  const totalWordCount = wordCounts?.reduce((sum, l) => sum + (l.word_count || 0), 0) || 0;
  const avgWordCount = wordCounts && wordCounts.length > 0 ? totalWordCount / wordCounts.length : 0;
  
  // Get date range
  const { data: dateRange } = await supabase
    .from('letters')
    .select('letter_date')
    .order('letter_date', { ascending: true })
    .limit(1);
  
  const { data: latestDate } = await supabase
    .from('letters')
    .select('letter_date')
    .order('letter_date', { ascending: false })
    .limit(1);
  
  const stats = {
    totalLetters: totalLetters || 0,
    uniqueRecipients,
    avgWordCount: Math.round(avgWordCount || 0),
    dateRange: {
      earliest: dateRange?.[0]?.letter_date || 'Unknown',
      latest: latestDate?.[0]?.letter_date || 'Unknown'
    }
  };
  
  console.log(`📈 Database Stats: ${stats.totalLetters} letters, ${stats.uniqueRecipients} recipients, ${stats.avgWordCount} avg words`);
  console.log(`📅 Date Range: ${stats.dateRange.earliest} to ${stats.dateRange.latest}`);
  
  return stats;
}
