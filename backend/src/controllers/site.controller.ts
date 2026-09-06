import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';

const SETTINGS_FILE_PATH = path.join(__dirname, '../../uploads/site_settings.json');

const DEFAULT_SETTINGS = {
  salonName: 'BEAUTY SALON',
  tagline: '“Your Beauty, Your Time.”',
  currency: 'ETB',
  heroBadge: '✨ The Premier Luxury Beauty & Hair Studio',
  heroTitle: 'Experience Elegance & Artistry In Every Style',
  heroSubtitle: 'Step into a world of bespoke haircuts, revitalizing facials, and luxury salon treatments tailored by master beauty artists.',
  heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
  aboutTitle: 'Crafting Confidence Through Bespoke Beauty',
  aboutDescription: 'At BEAUTY SALON, we combine state-of-the-art styling with organic luxury care. Our certified specialists craft personalized experiences designed to refresh your body, rejuvenate your mind, and elevate your personal style.',
  aboutImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  showServices: true,
  showStaff: true,
  showPosts: true,
  showStats: true,
  statClients: '2,500+',
  statExperience: '12+ Years',
  statRating: '4.9 / 5.0',
  contactPhone: '+1 (555) 389-7241',
  contactEmail: 'concierge@beautysalon.local',
  contactAddress: '450 Beverly Boulevard, Suite 200, Beverly Hills, CA',
  openingHours: 'Mon - Sat: 9:00 AM - 6:00 PM | Sun: Closed'
};

const getFileSettingsFallback = () => {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const data = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading fallback settings file:', err);
  }
  return DEFAULT_SETTINGS;
};

const saveFileSettingsFallback = (settings: any) => {
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving fallback settings file:', err);
  }
};

export const getSiteSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      // Seed default settings in the database
      const fallback = getFileSettingsFallback();
      settings = await prisma.siteSetting.create({
        data: {
          id: 'default',
          ...DEFAULT_SETTINGS,
          ...fallback
        }
      });
    }

    const merged = {
      ...DEFAULT_SETTINGS,
      ...settings,
      salonName: settings.salonName || DEFAULT_SETTINGS.salonName,
      tagline: settings.tagline || DEFAULT_SETTINGS.tagline,
      currency: settings.currency || DEFAULT_SETTINGS.currency
    };

    return sendSuccess(res, 200, 'Site settings retrieved successfully', merged);
  } catch (error) {
    console.error('Error reading settings from DB, using fallback:', error);
    const fallback = getFileSettingsFallback();
    return sendSuccess(res, 200, 'Site settings retrieved successfully (fallback)', fallback);
  }
};

export const updateSiteSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body || {};
    
    // Prepare data object, stripping any invalid or undefined keys
    const allowedKeys = [
      'salonName',
      'tagline',
      'currency',
      'heroBadge',
      'heroTitle',
      'heroSubtitle',
      'heroImage',
      'aboutTitle',
      'aboutDescription',
      'aboutImage',
      'showServices',
      'showStaff',
      'showPosts',
      'showStats',
      'statClients',
      'statExperience',
      'statRating',
      'contactPhone',
      'contactEmail',
      'contactAddress',
      'openingHours'
    ];

    const dataToUpdate: Record<string, any> = {};
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        dataToUpdate[key] = body[key];
      }
    }

    if (dataToUpdate.salonName !== undefined) {
      dataToUpdate.salonName = String(dataToUpdate.salonName).trim() || DEFAULT_SETTINGS.salonName;
    }
    if (dataToUpdate.tagline !== undefined) {
      dataToUpdate.tagline = String(dataToUpdate.tagline).trim() || DEFAULT_SETTINGS.tagline;
    }
    if (dataToUpdate.currency !== undefined) {
      dataToUpdate.currency = String(dataToUpdate.currency).trim() || DEFAULT_SETTINGS.currency;
    }

    // Persist to Neon PostgreSQL database via Prisma
    const updatedRecord = await prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: dataToUpdate,
      create: {
        id: 'default',
        ...DEFAULT_SETTINGS,
        ...dataToUpdate
      }
    });

    const result = {
      ...DEFAULT_SETTINGS,
      ...updatedRecord,
      salonName: updatedRecord.salonName || DEFAULT_SETTINGS.salonName,
      tagline: updatedRecord.tagline || DEFAULT_SETTINGS.tagline,
      currency: updatedRecord.currency || DEFAULT_SETTINGS.currency
    };

    // Keep fallback file in sync
    saveFileSettingsFallback(result);

    return sendSuccess(res, 200, 'Site settings updated successfully', result);
  } catch (error) {
    console.error('Error updating site settings:', error);
    next(error);
  }
};
