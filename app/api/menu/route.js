import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all menu items
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: {
        // Include all reviews related to this menu item
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate the average rating for each item
    const menuItemsWithAvgRating = menuItems.map(item => {
      const totalRating = item.reviews.reduce((acc, review) => acc + review.rating, 0);
      const avgRating = item.reviews.length > 0 ? totalRating / item.reviews.length : 0;
      const reviewCount = item.reviews.length;
      
      // We remove the detailed reviews array to keep the payload clean
      const { reviews, ...itemData } = item; 
      
      return {
        ...itemData,
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount,
      };
    });

    return NextResponse.json(menuItemsWithAvgRating);
  } catch (error) {
    console.error("Failed to fetch menu items with ratings:", error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}
// POST a new menu item
export async function POST(request) {
  try {
    const data = await request.json();
    // Add validation here with Zod later
    const newItem = await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        imageUrl: data.imageUrl,
      },
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}