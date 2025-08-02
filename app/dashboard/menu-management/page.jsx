'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
// We will create this component next
import { MenuItemDialog } from '@/components/dashboard/MenuItemDialog';

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch menu items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenuItems(data);
    };
    fetchItems();
  }, []);

  const handleItemAdded = (newItem) => {
    setMenuItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <Card className="m-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Menu Management</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img src={item.imageUrl} alt={item.name} className="h-16 w-16 object-cover rounded-md" />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  {/* Add Edit/Delete buttons here */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <MenuItemDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onItemAdded={handleItemAdded}
      />
    </Card>
  );
}