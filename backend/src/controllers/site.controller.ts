import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { sendSuccess, sendError } from '../utils/response';

const SETTINGS_FILE_PATH = path.join(__dirname, '../../uploads/site_settings.json');

const DEFAULT_SETTINGS = {
  heroBadge: '✨ The Premier Luxury Beauty & Hair Studio',
  heroTitle: 'Experience Elegance & Artistry In Every Style',
  heroSubtitle: 'Step into a world of bespoke haircuts, revitalizing facials, and luxury salon treatments tailored by master beauty artists.',
  heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
  aboutTitle: 'Crafting Confidence Through Bespoke Beauty',
  aboutDescription: 'At BeautyCare, we combine state-of-the-art styling with organic luxury care. Our certified specialists craft personalized experiences designed to refresh your body, rejuvenate your mind, and elevate your personal style.',
  aboutImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  showServices: true,
  showStaff: true,
  showPosts: true,
  showStats: true,
  statClients: '2,500+',
  statExperience: '12+ Years',
  statRating: '4.9 / 5.0',
  contactPhone: '+1 (555) 389-7241',
  contactEmail: 'concierge@beautycare.local',
  contactAddress: '450 Beverly Boulevard, Suite 200, Beverly Hills, CA',
  openingHours: 'Mon - Sat: 9:00 AM - 6:00 PM | Sun: Closed'
};

const getStoredSettings = () => {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const data = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading site settings file:', err);
  }
  return DEFAULT_SETTINGS;
};

const saveStoredSettings = (settings: any) => {
  const dir = path.dirname(SETTINGS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
};

export const getSiteSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = getStoredSettings();
    return sendSuccess(res, 200, 'Site settings retrieved successfully', settings);
  } catch (error) {
    next(error);
  }
};

export const updateSiteSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const current = getStoredSettings();
    const updated = { ...current, ...req.body };
    saveStoredSettings(updated);
    return sendSuccess(res, 200, 'Site settings updated successfully', updated);
  } catch (error) {
    next(error);
  }
};
