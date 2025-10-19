'use client';

import dynamic from "next/dynamic";
import { useEffect, useId, useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default), { ssr: false });

type EditorProps = {
  title: string;
  content: string;
  onChange: (value: { title?: string; content?: string }) => void;
  onBlurPersist: () => void;
  disabled: boolean;
};

export function Editor({ title, content, onChange, onBlurPersist, disabled }: EditorProps) {
  const editorId = useId();
  const [editorHeight, setEditorHeight] = useState(540);

  useEffect(() => {
    const updateHeight = () => {
      const available = window.innerHeight - 260;
      setEditorHeight(Math.max(360, available));
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="flex h-full flex-col bg-paper-background px-12 py-10">
      <input
        type="text"
        disabled={disabled}
        value={title}
        placeholder="Untitled"
        onChange={(event) => onChange({ title: event.target.value })}
        onBlur={onBlurPersist}
        className="w-full border-none bg-transparent font-serif text-5xl uppercase tracking-[0.2em] text-black placeholder:text-black/30 focus:outline-none"
      />
      <hr className="my-6 border-black/20" />
      <div data-color-mode="light" className="flex-1 overflow-hidden">
        <MDEditor
          key={editorId}
          value={content}
          height={editorHeight}
          preview="edit"
          visibleDragbar={false}
          textareaProps={{
            spellCheck: true,
            placeholder: "Start writing your note…",
            onBlur: onBlurPersist,
            disabled
          }}
          onChange={(next) => onChange({ content: next ?? "" })}
        />
      </div>
    </div>
  );
}
