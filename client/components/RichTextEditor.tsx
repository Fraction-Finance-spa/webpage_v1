import { useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Quote } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Ingresa el contenido del artículo..." }: RichTextEditorProps) {
  const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  const textColors = [
    "#000000", // Negro
    "#ffffff", // Blanco
    "#ef4444", // Rojo
    "#f97316", // Naranja
    "#eab308", // Amarillo
    "#22c55e", // Verde
    "#06b6d4", // Cyan
    "#3b82f6", // Azul
    "#8b5cf6", // Púrpura
    "#ec4899", // Rosado
  ];

  const bgColors = [
    "#ffffff", // Blanco
    "#f5f5f4", // Gris claro
    "#fef2f2", // Rojo claro
    "#fffbeb", // Amarillo claro
    "#f0fdf4", // Verde claro
    "#f0f9ff", // Azul claro
    "#fdf2f8", // Rosado claro
    "#f3f4f6", // Gris oscuro
  ];

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

  const applyTextColor = (color: string) => {
    executeCommand("foreColor", color);
    setShowTextColorPicker(false);
  };

  const applyBgColor = (color: string) => {
    executeCommand("backColor", color);
    setShowBgColorPicker(false);
  };

  return (
    <div className="border border-border/40 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-secondary/30 border-b border-border/40 p-3 flex flex-wrap gap-2">
        {/* Formatting */}
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

        {/* Colors */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTextColorPicker(!showTextColorPicker)}
            className="p-2 hover:bg-secondary rounded transition-colors flex items-center gap-1"
            title="Color de texto"
          >
            <span className="text-sm font-bold">A</span>
            <div className="w-3 h-3 bg-black rounded-sm"></div>
          </button>
          {showTextColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-border/40 rounded-lg p-3 shadow-lg z-10 grid grid-cols-5 gap-2">
              {textColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => applyTextColor(color)}
                  className="w-6 h-6 rounded border border-border/40 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
            className="p-2 hover:bg-secondary rounded transition-colors flex items-center gap-1"
            title="Color de fondo"
          >
            <span className="text-sm font-bold">◼</span>
            <div className="w-3 h-3 bg-yellow-300 rounded-sm border border-border/40"></div>
          </button>
          {showBgColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-border/40 rounded-lg p-3 shadow-lg z-10 grid grid-cols-4 gap-2">
              {bgColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => applyBgColor(color)}
                  className="w-6 h-6 rounded border-2 border-border/40 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-px bg-border/40"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Lista con viñetas"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px bg-border/40"></div>

        {/* Alignment */}
        <button
          type="button"
          onClick={() => executeCommand("justifyLeft")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Alinear a la izquierda"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyCenter")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Centrar"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyRight")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Alinear a la derecha"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyFull")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Justificado"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="w-px bg-border/40"></div>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => executeCommand("formatBlock", "<blockquote>")}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Cuadro de cita"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px bg-border/40"></div>

        {/* Undo/Redo */}
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

      {/* Editor */}
      <div className="relative">
        <div
          ref={setEditorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: value }}
          className="w-full min-h-64 px-4 py-3 focus:outline-none focus:ring-0 prose-sm max-w-none"
          style={{
            outline: "none",
          }}
        />
        {!value && (
          <div className="absolute top-3 left-4 text-foreground/40 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Styles for blockquotes */}
      <style>{`
        [contenteditable] blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          color: #64748b;
          font-style: italic;
        }
        
        [contenteditable] ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        [contenteditable] ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
}
