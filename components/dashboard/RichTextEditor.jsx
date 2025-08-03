'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, Heading2, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TipTapEditor = ({ content, onContentChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none min-h-[150px] border rounded-md p-4',
      },
    },
    immediatelyRender: false, // <-- ADD THIS LINE TO FIX THE ERROR
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 border rounded-t-md p-2 bg-muted">
         <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            variant={editor.isActive('bold') ? 'secondary' : 'ghost'} size="sm" type="button"
        >
            <Bold className="h-4 w-4" />
        </Button>
         <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            variant={editor.isActive('italic') ? 'secondary' : 'ghost'} size="sm" type="button"
        >
            <Italic className="h-4 w-4" />
        </Button>
        <Button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            variant={editor.isActive('strike') ? 'secondary' : 'ghost'} size="sm" type="button"
        >
            <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'} size="sm" type="button"
        >
            <Heading2 className="h-4 w-4" />
        </Button>
         <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'} size="sm" type="button"
        >
            <List className="h-4 w-4" />
        </Button>
        <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'} size="sm" type="button"
        >
            <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;