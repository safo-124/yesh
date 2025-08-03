import prisma from '@/lib/prisma';
import AboutPageClient from '@/components/customer/AboutPageClient';

async function getAboutData() {
    try {
        const sections = await prisma.aboutSection.findMany({
            orderBy: { order: 'asc' }
        });
        return sections;
    } catch (error) {
        console.error("Failed to fetch about sections:", error);
        return [];
    }
}

export default async function AboutPage() {
    const sections = await getAboutData();
    return <AboutPageClient sections={sections} />;
}