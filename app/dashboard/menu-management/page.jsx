'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PlusCircle, Edit, Star } from "lucide-react";
import { toast } from 'sonner';
import { MenuItemDialog } from '@/components/dashboard/MenuItemDialog'; // We will update this

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // For editing

  const fetchItems = useCallback(async () => {
    const response = await fetch('/api/menu');
    const data = await response.json();
    setMenuItems(data);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchItems();
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Menu Management</CardTitle>
                <CardDescription>Add, edit, and feature your menu items.</CardDescription>
            </div>
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img src={item.imageUrl} alt={item.name} className="h-12 w-12 object-cover rounded-md" />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(item.price)}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        {item.isAvailable ? <span className="text-green-600">● Available</span> : <span className="text-red-600">● Unavailable</span>}
                        {item.isFeatured && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                    </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <MenuItemDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        item={selectedItem}
        onSuccess={handleSuccess}
      />
    </Card>
  );
}