/**
 * 見やすく鮮やかな色の配列
 * Tailwind CSS風の鮮やかな色を使用し、寒色からスタート
 */
export const PASTEL_COLORS = [
  "#3b82f6", // ブルー（寒色スタート）
  "#10b981", // エメラルド
  "#06b6d4", // シアン
  "#8b5cf6", // バイオレット
  "#84cc16", // ライム
  "#22c55e", // グリーン
  "#f59e0b", // アンバー
  "#f97316", // オレンジ
  "#ef4444", // レッド
  "#ec4899", // ピンク
  "#be185d", // ローズ
  "#6366f1", // インディゴ
] as const;

/**
 * 指定されたインデックスに基づいて鮮やかな色を取得します。
 * インデックスが配列の範囲を超える場合は、モジュロ演算で循環します。
 *
 * @param index - カラーインデックス
 * @returns HEX形式の色文字列
 *
 * @example
 * ```typescript
 * const color1 = getPastelColor(0);  // "#3b82f6"
 * const color2 = getPastelColor(12); // "#3b82f6" (循環)
 * ```
 */
export function getPastelColor(index: number): string {
  const color = PASTEL_COLORS[index % PASTEL_COLORS.length];
  if (!color) {
    return PASTEL_COLORS[0];
  }
  return color;
}

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe("getPastelColor", () => {
    it("正しいインデックスでパステルカラーを取得する", () => {
      expect(getPastelColor(0)).toBe("#3b82f6");
      expect(getPastelColor(1)).toBe("#10b981");
      expect(getPastelColor(11)).toBe("#6366f1");
    });

    it("インデックスが配列の範囲を超える場合、循環する", () => {
      expect(getPastelColor(12)).toBe("#3b82f6");
      expect(getPastelColor(13)).toBe("#10b981");
      expect(getPastelColor(24)).toBe("#3b82f6");
    });

    it("負のインデックスでも適切に動作する", () => {
      expect(getPastelColor(-1)).toBe("#3b82f6");
      expect(getPastelColor(-12)).toBe("#3b82f6");
    });

    it("全ての色がHEX形式である", () => {
      for (const [index] of PASTEL_COLORS.entries()) {
        const color = getPastelColor(index);
        expect(color).toMatch(/^#[0-9a-f]{6}$/);
      }
    });
  });
}
