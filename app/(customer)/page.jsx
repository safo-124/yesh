import prisma from '@/lib/prisma';
import HomePageClient from '@/components/customer/HomePageClient';

async function getPageData() {
  try {
    const footerSettingKeys = [
      'footer_location', 
      'footer_hours_lunch',
      'footer_hours_dinner', 
      'footer_social_facebook',
      'footer_social_instagram', 
      'footer_social_twitter'
    ];

    const [homepageSections, featuredItems, galleryImages, footerSettingsRaw] = await Promise.all([
      prisma.homepageSection.findMany({ orderBy: { order: 'asc' } }),
      prisma.menuItem.findMany({ where: { isAvailable: true, isFeatured: true }, take: 4 }),
      prisma.galleryImage.findMany({ orderBy: { order: 'asc' }, take: 8 }),
      prisma.siteSettings.findMany({ where: { key: { in: footerSettingKeys } } })
    ]);

    // Convert footer settings array to a simple key-value object
    const footerSettings = footerSettingsRaw.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {});
    
    return { homepageSections, featuredItems, galleryImages, footerSettings };
  } catch (error) {
    console.error("Failed to fetch page data:", error);
    // Return default values to prevent a crash if the database is down
    return {
      homepageSections: [],
      featuredItems: [],
      galleryImages: [],
      footerSettings: {},
    };
  }
}

// Example data for sections that aren't yet in the CMS
const testimonials = [
  {
    quote: "An absolute gem in Aburi! The food was divine, and the atmosphere is perfect for a relaxing evening. We'll be back!",
    name: "Ama Serwaa",
    rating: 5,
  },
  {
    quote: "Gloryland is our go-to spot for celebrations. The staff always make us feel special, and the jollof is the best in the Eastern Region, hands down.",
    name: "Kofi Mensah",
    rating: 5,
  },
];

export default async function HomePage() {
  const { homepageSections, featuredItems, galleryImages, footerSettings } = await getPageData();

  return (
    <HomePageClient
      homepageSections={homepageSections}
      featuredItems={featuredItems}
      galleryImages={galleryImages}
      footerSettings={footerSettings}
      testimonials={testimonials}
    />
  );
}