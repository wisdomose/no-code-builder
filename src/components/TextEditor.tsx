import React from "react";

export const TextEditor = React.memo(
  ({
    initialText,
    style,
    className,
    onSave,
    onCancel,
  }: {
    initialText: string;
    style: React.CSSProperties;
    className: string;
    onSave: (text: string) => void;
    onCancel: () => void;
  }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (ref.current) {
        ref.current.innerText = initialText || "";
        ref.current.focus();
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, [initialText]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        ref.current?.blur();
      }
      if (e.key === "Escape") {
        onCancel();
      }
    };

    const handleBlur = () => {
      if (ref.current) {
        onSave(ref.current.innerText);
      }
    };

    return (
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className={`${className} outline-none cursor-text ring-1 ring-primary ring-offset-2 ring-offset-background`}
        style={style}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      />
    );
  },
);

TextEditor.displayName = "TextEditor";
