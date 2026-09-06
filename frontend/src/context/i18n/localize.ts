import { Language } from './types';
import { Service } from '../../features/services/types/service';
import { Staff } from '../../features/staff/types/staff';
import { NewsPost } from '../../features/News/types/news';

// Centralized dictionary for standard/legacy services when DB fields are not yet populated
const SERVICE_TRANSLATIONS: Record<string, { am: { name?: string; description?: string; category?: string }; om: { name?: string; description?: string; category?: string } }> = {
  'haircut & styling': {
    am: {
      name: 'የፀጉር አቆራረጥ እና ስታይል',
      description: 'ሙያዊ የፀጉር አቆራረጥ እና የስታይል አገልግሎት።',
      category: 'የፀጉር',
    },
    om: {
      name: 'Qorannoo Rifeensaa fi Miidhagina',
      description: 'Tajaajila qorannoo fi miidhagina rifeensaa ogummaa qabu.',
      category: 'Rifeensa',
    },
  },
  'haircut': {
    am: {
      name: 'የፀጉር አቆራረጥ',
      description: 'ሙያዊ የፀጉር አቆራረጥ አገልግሎት።',
      category: 'የፀጉር',
    },
    om: {
      name: 'Qorannoo Rifeensaa',
      description: 'Tajaajila qorannoo rifeensaa ogummaa qabu.',
      category: 'Rifeensa',
    },
  },
  'hair braiding': {
    am: {
      name: 'የፀጉር ሹሩባ',
      description: 'ባህላዊ እና ዘመናዊ የሹሩባ ስራዎች።',
      category: 'የፀጉር',
    },
    om: {
      name: 'Shurubbaa Rifeensaa',
      description: 'Istaayilii shurubbaa aadaa fi ammayyaa.',
      category: 'Rifeensa',
    },
  },
  'hair styling': {
    am: {
      name: 'የፀጉር ስታይል',
      description: 'ቀላል እና ለተለያዩ ዝግጅቶች የሚሆን የፀጉር ስራ።',
      category: 'የፀጉር',
    },
    om: {
      name: 'Istaayilii Rifeensaa',
      description: 'Miidhagina rifeensaa salphaa sagantaalee guyyaa guyyaaf.',
      category: 'Rifeensa',
    },
  },
  'hair': {
    am: {
      name: 'የፀጉር ስታይል',
      description: 'ምርጥ እና ዘመናዊ የፀጉር ስራ።',
      category: 'የፀጉር',
    },
    om: {
      name: 'Istaayilii Rifeensaa',
      description: 'Tajaajila rifeensaa ammayyaa fi bareedaa.',
      category: 'Rifeensa',
    },
  },
  'bridal makeup': {
    am: {
      name: 'የሙሽራ ሜካፕ',
      description: 'ሙያዊ የሰርግ እና የሙሽራ ሜካፕ አገልግሎት።',
      category: 'ሜካፕ',
    },
    om: {
      name: 'Meekaappii Cidhaa',
      description: 'Tajaajila meekaappii cidhaa fi misirroo ogummaa qabu.',
      category: 'Meekaappii',
    },
  },
  'full makeup': {
    am: {
      name: 'ሙሉ ሜካፕ',
      description: 'ለማንኛውም ዝግጅት የሚሆን ውብና ማራኪ ሜካፕ።',
      category: 'ሜካፕ',
    },
    om: {
      name: 'Meekaappii Guutuu',
      description: 'Meekaappii babbareedaa sagantaalee adda addaaf ta\'u.',
      category: 'Meekaappii',
    },
  },
  'facial treatment': {
    am: {
      name: 'የፊት ህክምና እና እንክብካቤ',
      description: 'የፊት ቆዳ ማጽዳት እና ማደስ።',
      category: 'የፊት',
    },
    om: {
      name: 'Yaala Fuulaa fi Kunuunsa',
      description: 'Fuula qulqulleessuu fi kunuunsa gogaa.',
      category: 'Fuula',
    },
  },
  'deep cleansing facial': {
    am: {
      name: 'ጥልቅ የፊት ማጽዳት ህክምና',
      description: 'የፊት ቆዳን የሚያድስ ልዩ የህክምና አገልግሎት።',
      category: 'የፊት',
    },
    om: {
      name: 'Qulqullina Fuulaa Gad Fageenyaa',
      description: 'Yaala gogaa fuulaa haaromsu fi qulqulleessu.',
      category: 'Fuula',
    },
  },
  'manicure': {
    am: {
      name: 'ማኒኪዩር',
      description: 'ጥራት ያለው የእጅ ጥፍር ማጽዳት እና ማስዋብ።',
      category: 'የጥፍር',
    },
    om: {
      name: 'Maanikiyeerii',
      description: 'Tajaajila qeensa harka qulqulleessuu fi miidhagsuu.',
      category: 'Qeensaa',
    },
  },
  'pedicure': {
    am: {
      name: 'ፔዲኪዩር',
      description: 'የእግር እንክብካቤ እና የጥፍር ማጽዳት።',
      category: 'የጥፍር',
    },
    om: {
      name: 'Pediikiyeerii',
      description: 'Kunuunsa miilaa fi qeensa qulqulleessuu.',
      category: 'Qeensaa',
    },
  },
  'traditional': {
    am: {
      name: 'ባህላዊ የፀጉር አሰራር (ሹሩባ)',
      description: 'ባህላዊ የቁንጅና እና የሹሩባ ስራዎች።',
      category: 'የፀጉር',
    },
    om: {
      name: 'Aadaa Miidhagina Rifeensaa (Shurubbaa)',
      description: 'Tajaajila rifeensaa fi miidhagina aadaa.',
      category: 'Rifeensa',
    },
  },
};

// Staff position dictionary
const POSITION_TRANSLATIONS: Record<string, { am: string; om: string }> = {
  'senior stylist': { am: 'ዋና የፀጉር ባለሙያ', om: 'Ogeessa Rifeensaa Olaanaa' },
  'therapist': { am: 'የማሳጅ እና የፊት ህክምና ባለሙያ', om: 'Ogeessa Yaala Fuulaa fi Masaajii' },
  'stylist': { am: 'የፀጉር ስታይሊስት', om: 'Istaayiliistii Rifeensaa' },
  'specialist': { am: 'ስፔሻሊስት', om: 'Ispeeshaalistii' },
  'master stylist': { am: 'ከፍተኛ የፀጉር ባለሙያ', om: 'Ogeessa Rifeensaa Sadarkaa Olaanaa' },
  'hair stylist': { am: 'የፀጉር ስታይሊስት', om: 'Istaayiliistii Rifeensaa' },
  'makeup artist': { am: 'የሜካፕ ባለሙያ', om: 'Ogeettii Meekaappii' },
  'full makeup': { am: 'የሜካፕ ስፔሻሊስት', om: 'Ogeettii Meekaappii' },
  'makeup': { am: 'የሜካፕ ባለሙያ', om: 'Ogeettii Meekaappii' },
  'nail technician': { am: 'የጥፍር ባለሙያ', om: 'Ogeessa Qeensaa' },
  'nail artist': { am: 'የጥፍር ባለሙያ', om: 'Ogeessa Qeensaa' },
  'some': { am: 'የውበት ባለሙያ', om: 'Ogeessa Miidhaginaa' },
};

// Staff bio dictionary
const BIO_TRANSLATIONS: Record<string, { am: string; om: string }> = {
  'expert hair stylist with 10 years of experience.': {
    am: 'ከ10 ዓመት በላይ ልምድ ያላት የፀጉር ስታይሊስት።',
    om: 'Ogeettii rifeensaa muuxannoo waggaa 10 olii qabdu.',
  },
  'specialist in massage and facial treatments.': {
    am: 'የማሳጅ እና የፊት ቆዳ እንክብካቤ ስፔሻሊስት።',
    om: 'Ogeessa yaala qorannoo fuulaa fi masaajii.',
  },
  'makeup 4 years': {
    am: 'የ4 ዓመት ልምድ ያላት የሜካፕ ባለሙያ።',
    om: 'Ogeettii meekaappii muuxannoo waggaa 4 qabdu.',
  },
  'makeup 3': {
    am: 'የ3 ዓመት ልምድ ያለው የሜካፕ ባለሙያ።',
    om: 'Ogeessa meekaappii muuxannoo waggaa 3 qabu.',
  },
  'sdds 4 years': {
    am: 'የ4 ዓመት ልምድ ያለው የውበት ባለሙያ።',
    om: 'Ogeessa miidhaginaa muuxannoo waggaa 4 qabu.',
  },
};

// Category translations
const CATEGORY_TRANSLATIONS: Record<string, { am: string; om: string }> = {
  all: { am: 'ሁሉም', om: 'Hunda' },
  hair: { am: 'የፀጉር', om: 'Rifeensa' },
  makeup: { am: 'ሜካፕ', om: 'Meekaappii' },
  face: { am: 'የፊት', om: 'Fuula' },
  nails: { am: 'የጥፍር', om: 'Qeensaa' },
  traditional: { am: 'ባህላዊ', om: 'Aadaa' },
  'facial beauty👍': { am: 'የፊት ውበት', om: 'Bareedina Fuulaa' },
  'hair style': { am: 'የፀጉር ስታይል', om: 'Istaayilii Rifeensaa' },
};

// Post translations dictionary
const POST_TRANSLATIONS: Record<string, { am: { title: string; content?: string }; om: { title: string; content?: string } }> = {
  'welcome to our new salon system': {
    am: {
      title: 'ወደ አዲሱ የሳሎን ስርዓታችን እንኳን በደህና መጡ',
      content: 'አዲሱን የመስመር ላይ የቀጠሮ ማስያዣ ስርዓታችንን ስናስተዋውቅ በታላቅ ደስታ ነው!',
    },
    om: {
      title: 'Gara Sirna Saaloona Keenya Haaraatti Baga Nagaan Dhuftan',
      content: 'Sirna qabannoo toora interneetii keenya isa haaraa beeksisuuf gammachuu guddaatu nutti dhaga\'ama!',
    },
  },
  'shuruba 35 % discount': {
    am: {
      title: 'ልዩ የ35% የሹሩባ ቅናሽ',
      content: 'በዚህ ወቅት የሹሩባ ስራዎችን በ35% ቅናሽ ያግኙ!',
    },
    om: {
      title: 'Hir\'ina Gatii Shurubbaa Addaa 35%',
      content: 'Yeroo kanatti tajaajila shurubbaa hunda irratti hir\'ina gatii 35% argadhaa!',
    },
  },
  'shuruba': {
    am: {
      title: 'ልዩ የሹሩባ ቅናሽ',
      content: '40% ቅናሽ ለሁሉም የሹሩባ አገልግሎቶች!',
    },
    om: {
      title: 'Hir\'ina Gatii Shurubbaa',
      content: 'Tajaajila shurubbaa hunda irratti hir\'ina gatii 40%!',
    },
  },
  'new style': {
    am: {
      title: 'አዲስ የውበት ስታይል',
      content: 'ለአዲሶቹ ደንበኞቻችን የሚሆን ልዩ የቅናሽ እድል!',
    },
    om: {
      title: 'Istaayilii Miidhaginaa Haaraa',
      content: 'Maamiltoota keenya haaraaf carraa hir\'ina gatii addaa!',
    },
  },
  'special spring promo': {
    am: {
      title: 'ልዩ የወቅቱ ማስተዋወቂያ',
      content: 'በዚህ ሳምንት በሁሉም የማኒኪዩር አገልግሎቶች ላይ የ20 በመቶ ቅናሽ ያግኙ!',
    },
    om: {
      title: 'Beeksisa Addaa Yeroo Ammaa',
      content: 'Torbee kana tajaajila maanikiyeerii hunda irratti hir\'ina dhibbeentaa 20 argadhaa!',
    },
  },
  'my new hair style': {
    am: {
      title: 'የእኔ አዲስ የፀጉር ስታይል',
      content: 'አዲሱን የፀጉር ስታይሌን ይመልከቱ እና ይደሰቱ!',
    },
    om: {
      title: 'Istaayilii Rifeensaa Kiyya Haaraa',
      content: 'Istaayilii rifeensaa kiyya isa haaraa ilaalaa gammadaa!',
    },
  },
  'new stylist from london': {
    am: {
      title: 'አዲስ ስታይሊስት ከለንደን',
      content: 'አለም አቀፍ ልምድ ያላቸው አዳዲስ ባለሙያዎቻችንን ይቀላቀሉ እና ልዩ የሳሎን አገልግሎት ያግኙ።',
    },
    om: {
      title: 'Istaayiliistii Haaraa Landan Irraa',
      content: 'Ogeeyyii keenya haaraa muuxannoo addunyaa qaban waliin tajaajila olaanaa argadhaa.',
    },
  },
};

/**
 * Localize a Service object with safe fallback to English
 */
export function localizeService(
  service: Service | null | undefined,
  language: Language
): { name: string; description: string; category: string } {
  if (!service) {
    return { name: '', description: '', category: '' };
  }

  const enName = service.name || '';
  const enDesc = service.description || '';
  const enCat = service.category || 'Service';

  if (language === 'en') {
    return {
      name: enName,
      description: enDesc,
      category: enCat,
    };
  }

  const nameKey = enName.trim().toLowerCase();
  const descKey = enDesc.trim().toLowerCase();
  const dict = SERVICE_TRANSLATIONS[nameKey] || SERVICE_TRANSLATIONS[descKey];

  let localizedName = '';
  let localizedDesc = '';
  let localizedCat = '';

  if (language === 'am') {
    localizedName = service.nameAm || dict?.am?.name || '';
    localizedDesc = service.descriptionAm || dict?.am?.description || '';
    localizedCat = service.categoryAm || dict?.am?.category || CATEGORY_TRANSLATIONS[enCat.toLowerCase()]?.am || '';
  } else if (language === 'om') {
    localizedName = service.nameOm || dict?.om?.name || '';
    localizedDesc = service.descriptionOm || dict?.om?.description || '';
    localizedCat = service.categoryOm || dict?.om?.category || CATEGORY_TRANSLATIONS[enCat.toLowerCase()]?.om || '';
  }

  return {
    name: localizedName.trim() || enName,
    description: localizedDesc.trim() || enDesc,
    category: localizedCat.trim() || enCat,
  };
}

/**
 * Localize a Staff object (position, bio, specialty) - preserves personal names as entered
 */
export function localizeStaff(
  staff: Staff | null | undefined,
  language: Language
): { position: string; bio: string; specialty: string } {
  if (!staff) {
    return { position: 'Specialist', bio: '', specialty: '' };
  }

  const rawPosition = staff.staffProfile?.position || staff.position || 'Specialist';
  const rawBio = staff.staffProfile?.bio || staff.bio || '';
  const rawSpecialty = staff.specialty || '';

  if (language === 'en') {
    return {
      position: rawPosition,
      bio: rawBio || 'No biography provided.',
      specialty: rawSpecialty,
    };
  }

  const posKey = rawPosition.trim().toLowerCase();
  const bioKey = rawBio.trim().toLowerCase();

  let localizedPos = '';
  let localizedBio = '';
  let localizedSpecialty = '';

  if (language === 'am') {
    localizedPos =
      staff.staffProfile?.positionAm ||
      staff.positionAm ||
      POSITION_TRANSLATIONS[posKey]?.am ||
      (posKey.includes('senior') ? 'ዋና የፀጉር ባለሙያ' : posKey.includes('stylist') ? 'የፀጉር ስታይሊስት' : posKey.includes('makeup') ? 'የሜካፕ ባለሙያ' : posKey.includes('therapist') ? 'የህክምና ባለሙያ' : '');
    localizedBio =
      staff.staffProfile?.bioAm ||
      staff.bioAm ||
      BIO_TRANSLATIONS[bioKey]?.am ||
      '';
    localizedSpecialty = staff.specialtyAm || localizedPos;
  } else if (language === 'om') {
    localizedPos =
      staff.staffProfile?.positionOm ||
      staff.positionOm ||
      POSITION_TRANSLATIONS[posKey]?.om ||
      (posKey.includes('senior') ? 'Ogeessa Rifeensaa Olaanaa' : posKey.includes('stylist') ? 'Istaayiliistii Rifeensaa' : posKey.includes('makeup') ? 'Ogeettii Meekaappii' : posKey.includes('therapist') ? 'Ogeessa Yaala Fuulaa' : '');
    localizedBio =
      staff.staffProfile?.bioOm ||
      staff.bioOm ||
      BIO_TRANSLATIONS[bioKey]?.om ||
      '';
    localizedSpecialty = staff.specialtyOm || localizedPos;
  }

  return {
    position: localizedPos.trim() || rawPosition,
    bio: localizedBio.trim() || rawBio || (language === 'am' ? 'ምንም መረጃ አልተሰጠም።' : language === 'om' ? 'Ibsi hin kennamne.' : 'No biography provided.'),
    specialty: localizedSpecialty.trim() || rawSpecialty || localizedPos.trim() || rawPosition,
  };
}

/**
 * Localize a News/Post object
 */
export function localizePost(
  post: NewsPost | null | undefined,
  language: Language
): { title: string; content: string } {
  if (!post) {
    return { title: '', content: '' };
  }

  const enTitle = post.title || '';
  const enContent = post.content || '';

  if (language === 'en') {
    return { title: enTitle, content: enContent };
  }

  const titleKey = enTitle.trim().toLowerCase();
  const dict = POST_TRANSLATIONS[titleKey];

  let localizedTitle = '';
  let localizedContent = '';

  if (language === 'am') {
    localizedTitle = post.titleAm || dict?.am?.title || '';
    localizedContent = post.contentAm || dict?.am?.content || '';
  } else if (language === 'om') {
    localizedTitle = post.titleOm || dict?.om?.title || '';
    localizedContent = post.contentOm || dict?.om?.content || '';
  }

  return {
    title: localizedTitle.trim() || enTitle,
    content: localizedContent.trim() || enContent,
  };
}

/**
 * Localize category name
 */
export function localizeCategory(category: string, language: Language): string {
  if (!category) return '';
  if (language === 'en') return category;

  const key = category.trim().toLowerCase();
  const entry = CATEGORY_TRANSLATIONS[key];
  if (entry && entry[language]) {
    return entry[language];
  }
  return category;
}

/**
 * Robust category filter matching:
 * Matches "Hair" to "Hair", "hair style", "Haircut & Styling", "traditional", etc.
 */
export function matchServiceCategory(
  serviceCategory: string | null | undefined,
  selectedCategory: string,
  serviceName?: string
): boolean {
  if (!selectedCategory || selectedCategory === 'All' || selectedCategory === 'ሁሉም' || selectedCategory === 'Hunda') {
    return true;
  }

  const sel = selectedCategory.trim().toLowerCase();
  const rawCat = (serviceCategory || '').trim().toLowerCase();
  const name = (serviceName || '').trim().toLowerCase();

  // Direct match
  if (rawCat === sel) return true;

  // Hair matching
  if (sel === 'hair' || sel === 'የፀጉር' || sel === 'rifeensa') {
    if (
      rawCat === 'hair' ||
      rawCat.includes('hair') ||
      rawCat.includes('style') ||
      rawCat.includes('traditional') ||
      rawCat.includes('shuruba') ||
      rawCat.includes('braid') ||
      rawCat === 'የፀጉር' ||
      rawCat === 'rifeensa'
    ) {
      return true;
    }
    if (
      name.includes('hair') ||
      name.includes('braid') ||
      name.includes('styling') ||
      name.includes('cut') ||
      name.includes('shuruba') ||
      name.includes('traditional')
    ) {
      return true;
    }
    return false;
  }

  // Makeup matching
  if (sel === 'makeup' || sel === 'ሜካፕ' || sel === 'meekaappii') {
    if (
      rawCat === 'makeup' ||
      rawCat.includes('makeup') ||
      rawCat === 'ሜካፕ' ||
      rawCat === 'meekaappii'
    ) {
      return true;
    }
    if (name.includes('makeup') || name.includes('cosmetic') || name.includes('bridal')) {
      return true;
    }
    return false;
  }

  // Face matching
  if (sel === 'face' || sel === 'facial' || sel === 'የፊት' || sel === 'fuula') {
    if (
      rawCat === 'face' ||
      rawCat.includes('face') ||
      rawCat.includes('facial') ||
      rawCat.includes('skin') ||
      rawCat === 'የፊት' ||
      rawCat === 'fuula'
    ) {
      return true;
    }
    if (name.includes('face') || name.includes('facial') || name.includes('cleansing') || name.includes('skin')) {
      return true;
    }
    return false;
  }

  // Nails matching
  if (sel === 'nails' || sel === 'nail' || sel === 'የጥፍር' || sel === 'qeensaa') {
    if (
      rawCat === 'nails' ||
      rawCat === 'nail' ||
      rawCat.includes('nail') ||
      rawCat.includes('manicure') ||
      rawCat.includes('pedicure') ||
      rawCat === 'የጥፍር' ||
      rawCat === 'qeensaa'
    ) {
      return true;
    }
    if (name.includes('nail') || name.includes('manicure') || name.includes('pedicure')) {
      return true;
    }
    return false;
  }

  // Traditional matching
  if (sel === 'traditional' || sel === 'ባህላዊ' || sel === 'aadaa') {
    if (rawCat.includes('traditional') || rawCat.includes('ባህላዊ') || rawCat.includes('aadaa')) return true;
    if (name.includes('traditional') || name.includes('ባህላዊ') || name.includes('shuruba')) return true;
    return false;
  }

  return rawCat.includes(sel) || sel.includes(rawCat);
}
