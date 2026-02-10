"use client";

import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { Button } from "@/components/ui/button";
import Image from "@tiptap/extension-image";
import { toast } from "sonner";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Undo,
  Redo,
  Minus,
  Scaling,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const ResizableImage = ({ node, updateAttributes, selected }: any) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState<number | null>(
    typeof node?.attrs?.width === "number" ? node.attrs.width : null
  );

  // 🔑 REF untuk nilai live (anti stale)
  const widthRef = useRef<number | null>(width);

  useEffect(() => {
    const w =
      typeof node?.attrs?.width === "number" ? node.attrs.width : null;
    setWidth(w);
    widthRef.current = w;
  }, [node?.attrs?.width]);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;

    const startWidth =
      widthRef.current ??
      containerRef.current?.getBoundingClientRect().width ??
      300;

    // ✅ ambil width dari editor (lebih stabil)
    const editorEl = containerRef.current?.closest(".ProseMirror");
    const parentWidth =
      editorEl?.getBoundingClientRect().width ?? window.innerWidth;

    const onMove = (ev: MouseEvent) => {
      const next = clamp(
        startWidth + (ev.clientX - startX),
        80,
        parentWidth
      );

      widthRef.current = next;
      setWidth(next);
    };

    const onUp = () => {
      const finalWidth = Math.round(
        widthRef.current ??
        containerRef.current?.getBoundingClientRect().width ??
        startWidth
      );

      updateAttributes({ width: finalWidth });

      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const { textAlign, src } = node.attrs;

  const alignClass = {
    left: "mr-auto",
    right: "ml-auto",
    center: "mx-auto",
    justify: "mx-auto",
  }[textAlign as string] || "";

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const imageUrl =
    src?.startsWith("http") || src?.startsWith("data:")
      ? src
      : `${backendUrl}${src}`;

  return (
    <NodeViewWrapper
      ref={containerRef}
      contentEditable={false}
      className={`relative my-4 max-w-full block ${alignClass}`}
      data-selected={selected ? "true" : "false"}
      style={{
        width: typeof width === "number" ? `${width}px` : undefined,
      }}
    >
      <img
        src={imageUrl}
        alt={node.attrs.alt || ""}
        title={node.attrs.title || ""}
        className="max-w-full h-auto rounded-lg block"
        draggable={false}
      />

      {selected && (
        <Scaling
          size={25}
          role="button"
          aria-label="Resize image"
          tabIndex={-1}
          onMouseDown={startResize}
          className="absolute right-1 bottom-1 rotate-90 text-sky-500  cursor-se-resize
                     rounded-sm bg-white m-2 border shadow opacity-90 hover:opacity-100"
        />
      )}
    </NodeViewWrapper>
  );
};

// const ResizableImage = ({ node, updateAttributes, selected }: any) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [width, setWidth] = useState<number | null>(
//     typeof node?.attrs?.width === "number" ? node.attrs.width : null,
//   );

//   useEffect(() => {
//     setWidth(typeof node?.attrs?.width === "number" ? node.attrs.width : null);
//   }, [node?.attrs?.width]);

//   const startResize = (e: any) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const startX = e.clientX;
//     const startWidth =
//       typeof width === "number"
//         ? width
//         : containerRef.current?.getBoundingClientRect().width ?? 300;

//     const parentWidth =
//       containerRef.current?.parentElement?.getBoundingClientRect().width ?? 1200;

//     const onMove = (ev: any) => {
//       const next = clamp(startWidth + (ev.clientX - startX), 80, parentWidth);
//       setWidth(next);
//     };

//     const onUp = () => {
//       const finalWidth =
//         typeof width === "number"
//           ? Math.round(width)
//           : Math.round(
//             containerRef.current?.getBoundingClientRect().width ?? startWidth,
//           );
//       updateAttributes({ width: finalWidth });
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup", onUp);
//     };

//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseup", onUp);
//   };

//   const { textAlign, src } = node.attrs;

//   const alignClass = {
//     left: "mr-auto",
//     right: "ml-auto",
//     center: "mx-auto",
//     justify: "mx-auto",
//   }[textAlign as string] || "";

//   const backendUrl = process.env.NEXT_PUBLIC_BASE_BACKEND_API_URL
//   const imageUrl =
//     src?.startsWith("http") || src?.startsWith("data:")
//       ? src
//       : `${backendUrl}${src}`;

//   return (
//     <NodeViewWrapper
//       ref={containerRef}
//       className={`relative my-4 max-w-full ${textAlign ? "block" : "inline-block"} ${alignClass}`}
//       contentEditable={false}
//       data-selected={selected ? "true" : "false"}
//       style={{ width: typeof width === "number" ? `${width}px` : undefined }}
//     >
//       <img
//         src={imageUrl}
//         alt={node.attrs.alt || ""}
//         title={node.attrs.title || ""}
//         className="max-w-full h-auto rounded-lg block"
//         draggable={false}
//       />
//       <Scaling
//         role="button"
//         tabIndex={-1}
//         aria-label="Resize image"
//         onMouseDown={startResize}
//         className={[
//           "absolute right-1 bottom-1 rotate-90 h-5 w-5 cursor-se-resize rounded-sm",
//           "bg-white border border-background shadow",
//           selected ? "opacity-100" : "opacity-70 hover:opacity-100",
//         ].join(" ")}
//       />
//     </NodeViewWrapper>
//   );
// };

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const raw = element.getAttribute("width");
          if (!raw) return null;
          const parsed = Number(raw);
          return Number.isFinite(parsed) ? parsed : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImage);
  },
});

const MenuBar = ({ editor }: any) => {
  if (!editor) return null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("Ukuran gambar terlalu besar (max 1MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        editor.chain().focus().setImage({ src: result }).run();
        toast.success("Gambar berhasil ditambahkan");
      }
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <div className="border-b border-border p-2 flex flex-wrap gap-1 bg-muted/30">
      {/* Undo/Redo */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="w-4 h-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      {/* Headings */}
      <Button
        type="button"
        variant={
          editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
        }
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
        }
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
        }
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      {/* Text formatting */}
      <Button
        type="button"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("underline") ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("strike") ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("highlight") ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("code") ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="w-4 h-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      {/* Lists */}
      <Button
        type="button"
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="w-4 h-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      {/* Alignment */}
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
        }
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
        }
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "justify" }) ? "secondary" : "ghost"
        }
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="w-4 h-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />



      {/* Links & Images */}
      <Button
        type="button"
        variant={editor.isActive("link") ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={addLink}
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
      <div className="w-px h-8 bg-border mx-1" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon className="w-4 h-4" />
      </Button>

      {/* Horizontal Rule */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Write your article content here...",
}: any) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      CustomImage.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      Highlight.configure({
        multicolor: false,
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px]  p-4",
      },
    },
  });
  useEffect(() => {
    if (!editor) return;
    if (editor.isFocused) return;

    if (content !== editor.getHTML()) {
      queueMicrotask(() => {
        editor.commands.setContent(content || "", { emitUpdate: false });
      });
    }
  }, [content, editor]);
  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
