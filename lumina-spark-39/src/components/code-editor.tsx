import { useMemo } from "react";

export const FILE_EXT: Record<string, string> = {
  Java: "java",
  Python: "py",
  C: "c",
  "C++": "cpp",
  JavaScript: "js",
  TypeScript: "ts",
  Go: "go",
  Rust: "rs",
  "C#": "cs",
  Kotlin: "kt",
  Swift: "swift",
  PHP: "php",
};

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  language: string;
  minHeight?: number;
  readOnly?: boolean;
};

export function CodeEditor({
  value,
  onChange,
  language,
  minHeight = 320,
  readOnly = false,
}: EditorProps) {
  const lines = useMemo(() => Math.max(value.split("\n").length, 12), [value]);

  return (
    <div
      className="code-surface relative flex overflow-hidden rounded-b-2xl border border-border/60 bg-[#0b1220] text-[13px]"
      style={{ minHeight }}
    >
      <div
        aria-hidden="true"
        className="select-none border-r border-white/5 bg-white/[0.02] px-3 py-4 text-right font-mono text-[11px] leading-[1.6] text-slate-500"
      >
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
        aria-label={`${language} code editor`}
        className="min-h-full flex-1 resize-none border-0 bg-transparent p-4 font-mono text-[13px] leading-[1.6] text-slate-100 outline-none"
        style={{
          minHeight,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          tabSize: 2,
        }}
      />
    </div>
  );
}
