'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { AboutSectionDialog } from '@/components/dashboard/AboutSectionDialog';
import Image from 'next/image';

export default function AboutManagementPage() {
    const [sections, setSections] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);

    const fetchSections = async () => {
        try {
            const response = await fetch('/api/about-sections');
            const data = await response.json();
            setSections(data);
        } catch (error) {
            toast.error("Failed to load sections.");
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const handleAddNew = () => {
        setSelectedSection(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (section) => {
        setSelectedSection(section);
        setIsDialogOpen(true);
    };
    
    const handleDelete = async (sectionId) => {
        if (!confirm("Are you sure you want to delete this section?")) return;
        
        try {
            await fetch(`/api/about-sections/${sectionId}`, { method: 'DELETE' });
            toast.success("Section deleted successfully.");
            fetchSections();
        } catch (error) {
            toast.error("Failed to delete section.");
        }
    };

    const handleSuccess = () => {
        setIsDialogOpen(false);
        fetchSections();
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>About Page Management</CardTitle>
                            <CardDescription>Manage the content sections of your "Our Story" page.</CardDescription>
                        </div>
                        <Button onClick={handleAddNew}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Section
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {sections.length > 0 ? sections.map(section => (
                        <div key={section.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Image src={section.imageUrl} alt={section.title} width={80} height={100} className="rounded-md object-cover aspect-[4/5]" />
                                <div>
                                    <h3 className="font-bold">{section.title}</h3>
                                    <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 self-end sm:self-center">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(section)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(section.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-muted-foreground py-8">No sections created yet. Add one to get started!</p>
                    )}
                </CardContent>
            </Card>

            <AboutSectionDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                section={selectedSection}
                onSuccess={handleSuccess}
            />
        </>
    );
}