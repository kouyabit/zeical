import { Label } from "@/components/ui/label";

interface FieldShellProps {
  /** 入力項目のID（labelとinputの紐付けに使う） */
  htmlFor: string;
  /** 項目名 */
  label: string;
  /** 補足説明（任意） */
  hint?: string;
  /** バリデーションエラーメッセージ（任意） */
  error?: string;
  children: React.ReactNode;
}

/**
 * フォーム1項目分の共通レイアウト（ラベル＋入力欄＋補足＋エラー表示）。
 * 各シミュレーターのフォームを短く保つために切り出している。
 */
export function FieldShell({
  htmlFor,
  label,
  hint,
  error,
  children,
}: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs font-bold text-destructive">{error}</p>}
    </div>
  );
}
