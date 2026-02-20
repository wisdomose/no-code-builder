import { useEditorStore } from "@/lib/useEditorStore";
import { Element as EditorElementComponent } from "./Element";

interface ArtboardProps {
  children?: React.ReactNode;
}

export const Artboard: React.FC<ArtboardProps> = ({ children }) => {
  const { artboard, elements } = useEditorStore();

  return (
    <div
      style={{
        width: `${artboard.width}px`,
        height: `${artboard.height}px`,
        backgroundColor: artboard.background,
        left: 0,
        top: 0,
      }}
      className="absolute shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_30px_rgba(0,0,0,0.1)] outline outline-1 outline-black/5"
    >
      {Object.values(elements)
        .filter((el) => !el.parentId)
        .map((el) => (
          <EditorElementComponent key={el.id} element={el} />
        ))}
      {children}
    </div>
  );
};
