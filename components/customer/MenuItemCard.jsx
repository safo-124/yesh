'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import StarRating from './StarRating'; // <-- Import StarRating

export default function MenuItemCard({ item }) {
  const addItemToCart = useCartStore((state) => state.addItem);

  const priceFormatted = new Intl.NumberFormat('en-GH', {
    style: 'currency', currency: 'GHS',
  }).format(item.price);

  return (
    <Card className="w-full flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative w-full aspect-video">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        {/* VVV Add StarRating component here VVV */}
        <div className="pt-2">
          <StarRating rating={item.avgRating} totalReviews={item.reviewCount} />
        </div>
        <CardDescription className="pt-2 text-base">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xl font-bold">{priceFormatted}</p>
        <Button onClick={() => addItemToCart(item)}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Order
        </Button>
      </CardFooter>
    </Card>
  );
}