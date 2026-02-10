"use client";

import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import type { CommandProps } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Custom FontSize Extension
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
          ({ chain }: CommandProps) => {
            return chain().setMark("textStyle", { fontSize }).run();
          },
      unsetFontSize:
        () =>
          ({ chain }: CommandProps) => {
            return chain()
              .setMark("textStyle", { fontSize: null })
              .removeEmptyTextStyle()
              .run();
          },
    };
  },
});

const ResizableImage = ({ node, updateAttributes, selected }: any) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState<number | null>(
    typeof node?.attrs?.width === "number" ? node.attrs.width : null
  );

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

  const imageUrl = src

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
// const CustomImage = Image.extend({
//   addAttributes() {
//     return {
//       ...this.parent?.(),

//       textAlign: {
//         default: null,
//         parseHTML: element => element.style.textAlign || null,
//         renderHTML: attributes => {
//           if (!attributes.textAlign) return {};
//           return { style: `text-align:${attributes.textAlign};` };
//         },
//       },

//       width: {
//         default: null,
//         parseHTML: element => {
//           const w = element.getAttribute("width");
//           return w ? Number(w) : null;
//         },
//         renderHTML: attrs =>
//           attrs.width
//             ? {
//               width: attrs.width,
//               style: `width:${attrs.width}px;height:auto;`,
//             }
//             : {},
//       },
//     };
//   },

//   renderHTML({ HTMLAttributes }) {
//     const { textAlign, style, ...rest } = HTMLAttributes;

//     let alignStyle = "";

//     if (textAlign === "center") {
//       alignStyle = "display:block;margin-left:auto;margin-right:auto;";
//     } else if (textAlign === "right") {
//       alignStyle = "display:block;margin-left:auto;";
//     } else if (textAlign === "left") {
//       alignStyle = "display:block;margin-right:auto;";
//     }

//     return [
//       "img",
//       mergeAttributes(rest, {
//         style: `${style || ""}${alignStyle}`,
//       }),
//     ];
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(ResizableImage);
//   },
// });


const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          // Parse dari attribute width ATAU dari inline style
          const widthAttr = element.getAttribute("width");
          if (widthAttr) {
            const parsed = Number(widthAttr);
            return Number.isFinite(parsed) ? parsed : null;
          }

          // Coba parse dari style="width: 300px"
          const styleWidth = element.style.width;
          if (styleWidth) {
            const parsed = parseInt(styleWidth);
            return Number.isFinite(parsed) ? parsed : null;
          }

          return null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {};

          // ✅ PENTING: Render sebagai inline style DAN attribute
          // Inline style memastikan width bekerja di frontend
          return {
            width: attributes.width,
            style: `width: ${attributes.width}px; height: auto;`
          };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { textAlign, style, ...rest } = HTMLAttributes;

    let alignStyle = "";
    if (textAlign === "center") {
      alignStyle = "display:block;margin-left:auto;margin-right:auto;";
    } else if (textAlign === "right") {
      alignStyle = "display:block;margin-left:auto;";
    } else if (textAlign === "left") {
      alignStyle = "display:block;margin-right:auto;";
    }

    return [
      "img",
      mergeAttributes(rest, {
        style: `${style || ""}${alignStyle}`,
      }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImage);
  },
});

const MenuBar = ({ editor }: any) => {
  if (!editor) return null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fontSize, setFontSize] = useState<string>("16");

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

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    const size = parseInt(value);
    if (size && size >= 8 && size <= 72) {
      editor.chain().focus().setFontSize(`${size}px`).run();
    }
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

      {/* Font Size Input */}
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min="8"
          max="72"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
          className="h-8 w-20 text-sm"
          placeholder={fontSize}
        />
        <span className="text-xs text-muted-foreground">px</span>
      </div>

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
      TextStyle,
      FontSize,
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