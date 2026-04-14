import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useCallback, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Pilcrow,
} from 'lucide-react';
import ImageUploadDialog from './ImageUploadDialog';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const FONT_COLORS = [
  '#000000',
  '#374151',
  '#6B7280',
  '#7c3aed',
  '#9333ea',
  '#2563eb',
  '#059669',
  '#dc2626',
  '#f59e0b',
];

export default function RichTextEditor({ value, onChange }: Props) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: 'img-full' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: 'Scrivi qui il contenuto dell\'articolo…',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sincronizza se il value esterno cambia (es. caricamento dati iniziale)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Inserisci URL', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }, [editor]);

  const handleInsertImage = useCallback(
    (url: string, alignment: 'left' | 'center' | 'right' | 'full', alt: string) => {
      if (!editor) return;
      const className = `img-${alignment}`;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: { src: url, alt, class: className },
        })
        .run();
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 min-h-[500px] bg-gray-50 text-gray-400">
        Caricamento editor…
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      <Toolbar
        editor={editor}
        onImage={() => setImageDialogOpen(true)}
        onLink={handleSetLink}
      />
      <div className="p-4">
        <EditorContent editor={editor} className="tiptap prose max-w-none" />
      </div>

      <ImageUploadDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onInsert={handleInsertImage}
      />
    </div>
  );
}

function Toolbar({
  editor,
  onImage,
  onLink,
}: {
  editor: Editor;
  onImage: () => void;
  onLink: () => void;
}) {
  const btn = (active: boolean) =>
    `p-2 rounded hover:bg-gray-100 transition-colors ${
      active ? 'bg-brand text-white hover:bg-brand' : 'text-gray-700'
    }`;

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap items-center gap-1 sticky top-0 bg-white z-10 rounded-t-lg">
      {/* Undo / Redo */}
      <button
        type="button"
        className={btn(false)}
        onClick={() => editor.chain().focus().undo().run()}
        title="Annulla"
      >
        <Undo size={16} />
      </button>
      <button
        type="button"
        className={btn(false)}
        onClick={() => editor.chain().focus().redo().run()}
        title="Ripristina"
      >
        <Redo size={16} />
      </button>
      <Divider />

      {/* Headings */}
      <button
        type="button"
        className={btn(editor.isActive('paragraph'))}
        onClick={() => editor.chain().focus().setParagraph().run()}
        title="Paragrafo"
      >
        <Pilcrow size={16} />
      </button>
      <button
        type="button"
        className={btn(editor.isActive('heading', { level: 1 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Titolo 1"
      >
        <Heading1 size={16} />
      </button>
      <button
        type="button"
        className={btn(editor.isActive('heading', { level: 2 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Titolo 2"
      >
        <Heading2 size={16} />
      </button>
      <button
        type="button"
        className={btn(editor.isActive('heading', { level: 3 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Titolo 3"
      >
        <Heading3 size={16} />
      </button>
      <Divider />

      {/* Marks */}
      <button
        type="button"
        className={btn(editor.isActive('bold'))}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Grassetto"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        className={btn(editor.isActive('italic'))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Corsivo"
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        className={btn(editor.isActive('underline'))}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Sottolineato"
      >
        <UnderlineIcon size={16} />
      </button>
      <button
        type="button"
        className={btn(editor.isActive('strike'))}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Barrato"
      >
        <Strikethrough size={16} />
      </button>
      <Divider />

      {/* Colors */}
      <div className="flex items-center gap-0.5 px-1">
        {FONT_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => editor.chain().focus().setColor(c).run()}
            className="w-5 h-5 rounded border border-gray-300"
            style={{ backgroundColor: c }}
            title={`Colore ${c}`}
          />
        ))}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="text-xs px-1 text-gray-600"
          title="Rimuovi colore"
        >
          ✕
        </button>
      </div>
      <Divider />

      {/* Alignment */}
      <button
        type="button"
        className={btn(editor.isActive({ textAlign: 'left' }))}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="Allinea a sinistra"
      >
        <AlignLeft size={16} />
      </button>
      <button
        type="button"
        className={btn(editor.isActive({ textAlign: 'center' }))}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="Allinea al centro"
      >
        <AlignCenter size={16} />
      </button>
      <button
        type="button"
        className={btn(editor.isActive({ textAlign: 'right' }))}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="Allinea a destra"
      >
        <AlignRight size={16} />
      </button>
      <button
        type="button"
        className={btn(editor.isActive({ textAlign: 'justify' }))}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        title="Giustifica"
      >
        <AlignJustify size={16} />
      </button>
      <Divider />

      {/* Lists + block */}
      <button
        type="button"
        className={btn(editor.isActive('bulletList'))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Lista puntata"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        className={btn(editor.isActive('orderedList'))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Lista numerata"
      >
        <ListOrdered size={16} />
      </button>
      <button
        type="button"
        className={btn(editor.isActive('blockquote'))}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Citazione"
      >
        <Quote size={16} />
      </button>
      <button
        type="button"
        className={btn(false)}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Linea orizzontale"
      >
        <Minus size={16} />
      </button>
      <Divider />

      {/* Link + Image */}
      <button
        type="button"
        className={btn(editor.isActive('link'))}
        onClick={onLink}
        title="Inserisci link"
      >
        <LinkIcon size={16} />
      </button>
      <button
        type="button"
        className={btn(false)}
        onClick={onImage}
        title="Inserisci immagine"
      >
        <ImageIcon size={16} />
      </button>
    </div>
  );
}

function Divider() {
  return <span className="w-px h-6 bg-gray-200 mx-1" />;
}
