import prisma from '@/lib/prisma';
import MenuItemCard from '@/components/customer/MenuItemCard';

async function getGroupedMenuItems() {
  const menuItems = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    orderBy: [ // <-- The fix is to use an array here
      { category: 'asc' },
      { name: 'asc' },
    ],
  });

  // Group items by category
  const grouped = menuItems.reduce((acc, item) => {
    // Use a default "Featured" category if one isn't provided
    const category = item.category || 'Featured';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return grouped;
}

export default async function MenuPage() {
  const groupedMenuItems = await getGroupedMenuItems();

  return (
    <div className="bg-gray-50/50">
      <div className="container py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Our Menu
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Freshly prepared dishes, crafted with passion and the finest ingredients.
          </p>
        </div>

        <div className="space-y-16">
          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-3xl font-bold border-b-2 border-yellow-500 pb-4 mb-8">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}