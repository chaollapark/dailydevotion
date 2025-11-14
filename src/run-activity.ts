#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { performDatabaseActivity, performLightActivity, gatherDatabaseStats } from './services/database-activity';

// Load environment variables
dotenv.config();

/**
 * Standalone script to run database activity
 * This can be run independently or as part of the main cron job
 */

async function runDatabaseActivity() {
  console.log('🚀 Starting Supabase Database Activity Script');
  console.log('==============================================');
  console.log(`📅 Started at: ${new Date().toLocaleString()}\n`);

  try {
    // Check if we have required environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error('Missing required environment variables: SUPABASE_URL, SUPABASE_ANON_KEY');
    }

    // Determine activity level based on command line argument
    const activityLevel = process.argv[2] || 'full';

    switch (activityLevel.toLowerCase()) {
      case 'light':
        console.log('⚡ Running LIGHT activity mode...\n');
        await performLightActivity();
        break;
        
      case 'stats':
        console.log('📊 Running STATISTICS gathering mode...\n');
        await gatherDatabaseStats();
        break;
        
      case 'full':
      default:
        console.log('🔄 Running FULL activity mode...\n');
        const stats = await performDatabaseActivity();
        
        // Additional stats gathering
        console.log('📊 Gathering additional statistics...');
        await gatherDatabaseStats();
        
        console.log('\n🎯 Final Activity Summary:');
        console.log('==========================');
        console.log(`✅ Activity Level: FULL`);
        console.log(`🔢 Database Queries: ${stats.totalQueries}`);
        console.log(`📄 Rows Retrieved: ${stats.totalRows}`);
        console.log(`⏱️  Total Time: ${stats.executionTime}ms`);
        break;
    }

    console.log('\n🎉 Database activity completed successfully!');
    console.log('💡 Your Supabase database should now show recent activity.');
    console.log(`🕐 Completed at: ${new Date().toLocaleString()}`);

  } catch (error) {
    console.error('\n❌ Database activity failed:', error);
    console.error('💡 Make sure your Supabase credentials are correct and the database is accessible.');
    process.exit(1);
  }
}

// Handle different execution contexts
if (require.main === module) {
  // Direct execution
  runDatabaseActivity()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Script execution failed:', error);
      process.exit(1);
    });
} else {
  // Module import
  console.log('Database activity module loaded');
}

export { runDatabaseActivity };
