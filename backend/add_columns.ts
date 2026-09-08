/**
 * =============================================================
 * Add Columns Migration Script
 * =============================================================
 * This script adds multilingual (Amharic & Oromo) columns to
 * the Service, StaffProfile, and Post tables, then populates
 * them with initial translated content.
 *
 * Tables affected:
 *   - Service: nameAm, nameOm, descriptionAm, descriptionOm, categoryAm, categoryOm
 *   - StaffProfile: bioAm, bioOm, positionAm, positionOm
 *   - Post: titleAm, titleOm, contentAm, contentOm
 *
 * Usage: npx tsx add_columns.ts
 * =============================================================
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Service" 
    ADD COLUMN IF NOT EXISTS "nameAm" TEXT,
    ADD COLUMN IF NOT EXISTS "nameOm" TEXT,
    ADD COLUMN IF NOT EXISTS "descriptionAm" TEXT,
    ADD COLUMN IF NOT EXISTS "descriptionOm" TEXT,
    ADD COLUMN IF NOT EXISTS "categoryAm" TEXT,
    ADD COLUMN IF NOT EXISTS "categoryOm" TEXT;
  `);
  console.log('Service columns added successfully.');

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "StaffProfile" 
    ADD COLUMN IF NOT EXISTS "bioAm" TEXT,
    ADD COLUMN IF NOT EXISTS "bioOm" TEXT,
    ADD COLUMN IF NOT EXISTS "positionAm" TEXT,
    ADD COLUMN IF NOT EXISTS "positionOm" TEXT;
  `);
  console.log('StaffProfile columns added successfully.');

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Post" 
    ADD COLUMN IF NOT EXISTS "titleAm" TEXT,
    ADD COLUMN IF NOT EXISTS "titleOm" TEXT,
    ADD COLUMN IF NOT EXISTS "contentAm" TEXT,
    ADD COLUMN IF NOT EXISTS "contentOm" TEXT;
  `);
  console.log('Post columns added successfully.');

  // Normalize service categories & populate initial translations
  const services = await prisma.service.findMany();
  for (const s of services) {
    const nameLower = s.name.toLowerCase();
    let cat = 'Hair';
    let nameAm = s.name;
    let nameOm = s.name;
    let descAm = s.description || '';
    let descOm = s.description || '';
    let catAm = 'የፀጉር';
    let catOm = 'Rifeensa';

    if (nameLower.includes('haircut') || nameLower.includes('styling') || s.name === 'hair') {
      cat = 'Hair';
      catAm = 'የፀጉር';
      catOm = 'Rifeensa';
      if (nameLower.includes('haircut')) {
        nameAm = 'የፀጉር አቆራረጥ እና ስታይል';
        nameOm = 'Qorannoo Rifeensaa fi Miidhagina';
        descAm = 'ሙያዊ የፀጉር አቆራረጥ እና የስታይል አገልግሎት።';
        descOm = 'Tajaajila qorannoo fi miidhagina rifeensaa ogummaa qabu.';
      } else {
        nameAm = 'የፀጉር ስታይል';
        nameOm = 'Miidhagina Rifeensaa';
        descAm = 'ምርጥ እና ዘመናዊ የፀጉር ስራ።';
        descOm = 'Tajaajila rifeensa ammayyaa fi bareedaa.';
      }
    } else if (nameLower.includes('manicure') || nameLower.includes('pedicure') || nameLower.includes('nail')) {
      cat = 'Nails';
      catAm = 'የጥፍር';
      catOm = 'Qeensaa';
      nameAm = 'ማኒኪዩር እና ፔዲኪዩር';
      nameOm = 'Maanikiyeerii fi Pediikiyeerii';
      descAm = 'ጥራት ያለው የእጅ እና የእግር ጥፍር እንክብካቤ።';
      descOm = 'Tajaajila qeensa harka fi miilaa qulqulleessuu fi miidhagsuu.';
    } else if (nameLower.includes('makeup')) {
      cat = 'Makeup';
      catAm = 'ሜካፕ';
      catOm = 'Meekaappii';
      nameAm = 'ሙሉ ሜካፕ';
      nameOm = 'Meekaappii Guutuu';
      descAm = 'ለተለያዩ ዝግጅቶች የሚሆን ውብና ማራኪ ሜካፕ።';
      descOm = 'Meekaappii babbareedaa sagantaalee adda addaaf ta\'u.';
    } else if (nameLower.includes('traditional')) {
      cat = 'Hair';
      catAm = 'የፀጉር';
      catOm = 'Rifeensa';
      nameAm = 'ባህላዊ የፀጉር አሰራር (ሹሩባ)';
      nameOm = 'Aadaa Miidhagina Rifeensaa (Shurubbaa)';
      descAm = 'ባህላዊ የቁንጅና እና የሹሩባ ስራዎች።';
      descOm = 'Tajaajila rifeensaa fi miidhagina aadaa.';
    }

    await prisma.$executeRawUnsafe(`
      UPDATE "Service"
      SET "category" = $1, "nameAm" = $2, "nameOm" = $3, "descriptionAm" = $4, "descriptionOm" = $5, "categoryAm" = $6, "categoryOm" = $7
      WHERE "id" = $8
    `, cat, nameAm, nameOm, descAm, descOm, catAm, catOm, s.id);
  }
  console.log('Services normalized and localized.');

  // Staff localization
  const staffProfiles = await prisma.staffProfile.findMany();
  for (const sp of staffProfiles) {
    const pos = (sp.position || '').toLowerCase();
    let positionAm = sp.position || 'ስፔሻሊስት';
    let positionOm = sp.position || 'Ispeeshaalistii';
    let bioAm = sp.bio || 'ልምድ ያለው የውበት ሳሎን ባለሙያ።';
    let bioOm = sp.bio || 'Ogeessa/ttii miidhaginaa muuxannoo qabu/du.';

    if (pos.includes('senior') || pos.includes('stylist') || pos.includes('hair')) {
      positionAm = 'ዋና የፀጉር ስታይሊስት';
      positionOm = 'Istaayiliistii Rifeensaa Olaanaa';
      bioAm = 'ከፍተኛ ልምድ ያላት የፀጉር እና የውበት ባለሙያ።';
      bioOm = 'Ogeettii rifeensaa fi miidhaginaa muuxannoo olaanaa qabdu.';
    } else if (pos.includes('therapist') || pos.includes('facial') || pos.includes('massage')) {
      positionAm = 'የፊት እና የሰውነት ህክምና ባለሙያ';
      positionOm = 'Ogeessa Yaala Fuulaa fi Qaamaa';
      bioAm = 'የማሳጅ እና የፊት ቆዳ እንክብካቤ ስፔሻሊስት።';
      bioOm = 'Ogeessa yaala fuulaa fi masaajii qorannoo qabu.';
    } else if (pos.includes('makeup')) {
      positionAm = 'የሜካፕ ባለሙያ';
      positionOm = 'Ogeettii Meekaappii';
      bioAm = 'የተለያዩ ዝግጅቶች ሜካፕ ባለሙያ።';
      bioOm = 'Ogeettii meekaappii sagantaalee adda addaa.';
    }

    await prisma.$executeRawUnsafe(`
      UPDATE "StaffProfile"
      SET "positionAm" = $1, "positionOm" = $2, "bioAm" = $3, "bioOm" = $4
      WHERE "id" = $5
    `, positionAm, positionOm, bioAm, bioOm, sp.id);
  }
  console.log('Staff profiles localized.');

  // Post localization
  const posts = await prisma.post.findMany();
  for (const p of posts) {
    const titleLower = p.title.toLowerCase();
    let titleAm = p.title;
    let titleOm = p.title;
    let contentAm = p.content;
    let contentOm = p.content;

    if (titleLower.includes('welcome')) {
      titleAm = 'ወደ አዲሱ የሳሎን ስርዓታችን እንኳን በደህና መጡ';
      titleOm = 'Gara Sirna Saaloona Keenya Haaraatti Baga Nagaan Dhuftan';
      contentAm = 'አዲሱን የመስመር ላይ የቀጠሮ ማስያዣ ስርዓታችንን ስናስተዋውቅ በታላቅ ደስታ ነው!';
      contentOm = 'Sirna qabannoo toora interneetii keenya isa haaraa beeksisuuf gammachuu guddaatu nutti dhaga\'ama!';
    } else if (titleLower.includes('shuruba') || titleLower.includes('discount')) {
      titleAm = 'ልዩ የ35% የሹሩባ ቅናሽ';
      titleOm = 'Hir\'ina Gatii Shurubbaa Addaa 35%';
      contentAm = 'በዚህ ወቅት የሹሩባ ስራዎችን በ35% ቅናሽ ያግኙ!';
      contentOm = 'Yeroo kanatti tajaajila shurubbaa hunda irratti hir\'ina gatii 35% argadhaa!';
    } else if (titleLower.includes('promo') || titleLower.includes('spring')) {
      titleAm = 'ልዩ የወቅቱ ማስተዋወቂያ';
      titleOm = 'Beeksisa Addaa Yeroo Ammaa';
      contentAm = 'በዚህ ሳምንት በሁሉም የማኒኪዩር አገልግሎቶች ላይ የ20 በመቶ ቅናሽ ያግኙ!';
      contentOm = 'Torbee kana tajaajila maanikiyeerii hunda irratti hir\'ina dhibbeentaa 20 argadhaa!';
    } else if (titleLower.includes('style')) {
      titleAm = 'አዲስ የውበት ስታይል';
      titleOm = 'Istaayilii Miidhaginaa Haaraa';
      contentAm = 'ለአዲሶቹ ደንበኞቻችን የሚሆን ልዩ የቅናሽ እድል!';
      contentOm = 'Maamiltoota keenya haaraaf carraa hir\'ina gatii addaa!';
    } else if (titleLower.includes('london')) {
      titleAm = 'አዲስ ስታይሊስት ከለንደን';
      titleOm = 'Istaayiliistii Haaraa Landan Irraa';
      contentAm = 'አለም አቀፍ ልምድ ያላቸው አዳዲስ ባለሙያዎቻችንን ይቀላቀሉ እና ልዩ አገልግሎት ያግኙ።';
      contentOm = 'Ogeeyyii keenya haaraa muuxannoo addunyaa qaban waliin tajaajila olaanaa argadhaa.';
    }

    await prisma.$executeRawUnsafe(`
      UPDATE "Post"
      SET "titleAm" = $1, "titleOm" = $2, "contentAm" = $3, "contentOm" = $4
      WHERE "id" = $5
    `, titleAm, titleOm, contentAm, contentOm, p.id);
  }
  console.log('Posts localized.');

}

main().catch(console.error).finally(() => prisma.$disconnect());
