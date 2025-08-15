import mongoose, { Schema, model, models } from 'mongoose';
import { Job } from '../types/job';

const JobSchema = new Schema({
  title: { type: String },
  slug: { 
    type: String,
    unique: true,
    sparse: true,
  },
  description: { type: String, required: true },
  companyName: { type: String },
  type: { type: String },
  salary: { type: Number },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  countryId: { type: String },
  stateId: { type: String },
  cityId: { type: String },
  postalCode: { type: Number },
  street: { type: String },
  jobIcon: { type: String },
  contactName: { type: String },
  contactPhone: { type: String },
  contactEmail: { type: String },
  applyLink: { type: String },
  source: { type: String },
  expiresOn: { type: String },
  seniority: {
    type: String,
    enum: ["intern", "junior", "mid-level", "senior"],
    required: true,
  },
  userWorkosId: { type: String },
  plan: {
    type: String,
    enum: ['pending', 'basic', 'pro', 'recruiter', 'unlimited'],
    default: 'pending',
  },
  blockAIApplications: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export const JobModel = models?.Job || model('Job', JobSchema);

export async function fetchLatestJobs(limit: number = 10): Promise<Job[]> {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    // Validate MongoDB URI format
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error('MONGODB_URI must start with "mongodb://" or "mongodb+srv://"');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Fetch the most recent jobs, excluding eu-institution and eu-rss sources
    const allJobs = await JobModel.find(
      { source: { $nin: ['eu-institution', 'eu-rss'] } },
      {},
      { sort: { createdAt: -1 }, limit }
    );
    console.log(`✅ Fetched ${allJobs.length} jobs from database`);
    
    return allJobs.map(job => job.toObject());
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}
