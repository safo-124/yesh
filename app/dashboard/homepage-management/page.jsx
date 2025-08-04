'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { HomepageSectionDialog } from '@/components/dashboard/HomepageSectionDialog';

function SortableSection({ section, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <button {...attributes} {...listeners} className="cursor-grab p-2 text-muted-foreground hover:bg-slate-100 rounded-md">
        <GripVertical />
      </button>
      <div className="flex-1">
        <p className="font-bold">{section.type.replace('_', ' ')}</p>
        <p className="text-sm text-muted-foreground">{section.title || 'Untitled Section'}</p>
      </div>
      <div>
        <Button variant="outline" size="sm" onClick={() => onEdit(section)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
        <Button variant="destructive" size="sm" className="ml-2" onClick={() => onDelete(section.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
      </div>
    </div>
  );
}

export default function HomepageManagementPage() {
  const [sections, setSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const fetchSections = async () => {
    const response = await fetch('/api/homepage-sections');
    const data = await response.json();
    setSections(data);
  };

  useEffect(() => {
    fetchSections();
  }, []);
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
        await fetch('/api/homepage-sections/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sections)
        });
        toast.success("Homepage layout saved successfully!");
    } catch (error) {
        toast.error("Failed to save layout.");
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleAddNew = () => {
      setSelectedSection(null);
      setIsDialogOpen(true);
  };

  const handleEdit = (section) => {
      setSelectedSection(section);
      setIsDialogOpen(true);
  };

  const handleDelete = async (sectionId) => {
      if (!confirm("Are you sure? This cannot be undone.")) return;
      try {
          await fetch(`/api/homepage-sections/${sectionId}`, { method: 'DELETE' });
          toast.success("Section deleted.");
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
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Homepage Content Management</CardTitle>
                <CardDescription>Drag and drop sections to reorder them on your homepage.</CardDescription>
              </div>
              <div className="flex gap-2">
                  <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add Section</Button>
                  <Button onClick={handleSaveChanges} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Layout Order'}
                  </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {sections.map(section => (
                    <SortableSection key={section.id} section={section} onEdit={handleEdit} onDelete={handleDelete} />
                  ))}
                   {sections.length === 0 && <p className="text-center text-muted-foreground py-8">No homepage sections created yet. Click "Add Section" to begin.</p>}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </div>
      <HomepageSectionDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen}
        section={selectedSection}
        onSuccess={handleSuccess}
      />
    </>
  );
}