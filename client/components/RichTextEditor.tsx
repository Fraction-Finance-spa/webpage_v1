import { useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Ingresa el contenido del artículo..." }: RichTextEditorProps) {
  const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef) {
      editorRef.focus();
      updateContent();
    }
  };

  const updateContent = () => {
    if (editorRef) {
      onChange(editorRef.innerHTML);
    }
  };

  const handleInput = () => {
    updateContent();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    updateContent();
  };

  return (
    <div className="border border-border/40 rounded-lg overflow-hidden">
      <div className="bg-secondary/30 border-b border-border/40 p-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Negrita (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Cursiva (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Subrayado (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px bg-border/40"></div>
        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Lista sin ordenar"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Lista ordenada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px bg-border/40"></div>
        <button
          type="button"
          onClick={() => executeCommand("undo")}
          className="p-2 hover:bg-secondary rounded transition-colors text-sm"
          title="Deshacer"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => executeCommand("redo")}
          className="p-2 hover:bg-secondary rounded transition-colors text-sm"
          title="Rehacer"
        >
          ↷
        </button>
      </div>
      <div className="relative">
        <div
          ref={setEditorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: value }}
          className="w-full min-h-64 px-4 py-2 focus:outline-none focus:ring-0 prose-sm max-w-none"
          style={{
            outline: "none",
          }}
        />
        {!value && (
          <div className="absolute top-2 left-4 text-foreground/40 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
