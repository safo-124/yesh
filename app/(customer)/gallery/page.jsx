import prisma from '@/lib/prisma';
import GalleryClient from '@/components/customer/GalleryClient';

async function getGalleryImages() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return images;
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="bg-white py-20 md:py-24">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: '#8B4513' }}>
            Our Gallery
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the moments and details that make Gloryland special.
          </p>
        </div>
        
        {images.length > 0 ? (
          <GalleryClient images={images} />
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">The gallery is currently empty. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}