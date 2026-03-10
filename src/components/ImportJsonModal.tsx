import React from "react";
import { Download, FileJson, X, AlertCircle } from "lucide-react";
import { validateImportJson } from "@/lib/importSchema";
import { useEditorStore } from "@/lib/useEditorStore";
import { toast } from "sonner";

interface ImportJsonModalProps {
  open: boolean;
  onClose: () => void;
}

export const ImportJsonModal: React.FC<ImportJsonModalProps> = ({
  open,
  onClose,
}) => {
  const [jsonText, setJsonText] = React.useState("");
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const importProject = useEditorStore((s) => s.importProject);

  if (!open) return null;

  const handleFileRead = (file: File) => {
    if (!file.name.endsWith(".json")) {
      toast.error("Please select a .json file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setJsonText(text);
        setErrors([]);
      }
    };
    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileRead(file);
  };

  const handleImport = () => {
    if (!jsonText.trim()) {
      setErrors(["Please paste JSON or upload a file."]);
      return;
    }

    const result = validateImportJson(jsonText);
    if (!result.success) {
      setErrors(result.errors || ["Unknown validation error."]);
      return;
    }

    importProject(result.data!);
    toast.success("Project imported successfully!");
    setJsonText("");
    setErrors([]);
    onClose();
  };

  const handleClose = () => {
    setJsonText("");
    setErrors([]);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-160 mx-4 bg-surface border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileJson size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-text-main">
                Import JSON
              </h2>
              <p className="text-[11px] text-text-muted mt-0.5">
                Load a project from a JSON file
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-background rounded-lg text-text-muted hover:text-text-main transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Drop Zone / File Upload */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-4 transition-colors text-center ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-text-muted/40"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <Download
              size={20}
              className="mx-auto mb-2 text-text-muted opacity-60"
            />
            <p className="text-[12px] text-text-muted">
              Drag & drop a{" "}
              <span className="font-semibold text-text-main">.json</span> file
              here, or{" "}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                browse
              </button>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
              Or paste JSON directly
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setErrors([]);
              }}
              placeholder='{"elements": {...}, "rootElements": [...], "artboard": {...}}'
              className="w-full h-48 bg-background border border-border rounded-xl px-4 py-3 text-[13px] font-mono text-text-main placeholder:text-text-muted/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              spellCheck={false}
            />
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 space-y-1.5">
              <div className="flex items-center gap-2 text-red-400 text-[12px] font-bold">
                <AlertCircle size={14} />
                Validation Errors
              </div>
              <ul className="space-y-0.5">
                {errors.map((err, i) => (
                  <li
                    key={i}
                    className="text-[11px] text-red-400/80 font-mono pl-5"
                  >
                    • {err}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-[13px] font-semibold text-text-muted hover:text-text-main hover:bg-background rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-[13px] font-bold rounded-lg hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
          >
            <Download size={14} />
            Import Project
          </button>
        </div>
      </div>
    </div>
  );
};
