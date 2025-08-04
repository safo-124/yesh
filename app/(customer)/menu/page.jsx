import MenuItemCard from '@/components/customer/MenuItemCard';

// This function now fetches from our API endpoint
async function getGroupedMenuItems() {
  // Use the full URL for server-side fetching in Next.js
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/menu`, { cache: 'no-store' });
  if (!response.ok) {
    console.error("Failed to fetch menu");
    return {};
  }
  const menuItems = await response.json();

  // Group items by category
  const grouped = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
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
              <h2 className="text-3xl font-bold border-b-2 border-primary pb-4 mb-8">
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