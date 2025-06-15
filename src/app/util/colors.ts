/**
 * カラフルなパステルカラーの配列
 * HSL色空間でSaturation 60%, Lightness 80%に統一されたパステルカラー
 */
export const PASTEL_COLORS = [
  "hsl(0, 60%, 80%)", // パステルレッド
  "hsl(30, 60%, 80%)", // パステルオレンジ
  "hsl(60, 60%, 80%)", // パステルイエロー
  "hsl(90, 60%, 80%)", // パステルライム
  "hsl(120, 60%, 80%)", // パステルグリーン
  "hsl(150, 60%, 80%)", // パステルエメラルド
  "hsl(180, 60%, 80%)", // パステルシアン
  "hsl(210, 60%, 80%)", // パステルスカイブルー
  "hsl(240, 60%, 80%)", // パステルブルー
  "hsl(270, 60%, 80%)", // パステルパープル
  "hsl(300, 60%, 80%)", // パステルマゼンタ
  "hsl(330, 60%, 80%)", // パステルピンク
] as const;

/**
 * 指定されたインデックスに基づいてパステルカラーを取得します。
 * インデックスが配列の範囲を超える場合は、モジュロ演算で循環します。
 *
 * @param index - カラーインデックス
 * @returns HSL形式のパステルカラー文字列
 *
 * @example
 * ```typescript
 * const color1 = getPastelColor(0);  // "hsl(0, 60%, 80%)"
 * const color2 = getPastelColor(12); // "hsl(0, 60%, 80%)" (循環)
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
      expect(getPastelColor(0)).toBe("hsl(0, 60%, 80%)");
      expect(getPastelColor(1)).toBe("hsl(30, 60%, 80%)");
      expect(getPastelColor(11)).toBe("hsl(330, 60%, 80%)");
    });

    it("インデックスが配列の範囲を超える場合、循環する", () => {
      expect(getPastelColor(12)).toBe("hsl(0, 60%, 80%)");
      expect(getPastelColor(13)).toBe("hsl(30, 60%, 80%)");
      expect(getPastelColor(24)).toBe("hsl(0, 60%, 80%)");
    });

    it("負のインデックスでも適切に動作する", () => {
      expect(getPastelColor(-1)).toBe("hsl(0, 60%, 80%)");
      expect(getPastelColor(-12)).toBe("hsl(0, 60%, 80%)");
    });

    it("全ての色がHSL形式である", () => {
      for (const [index] of PASTEL_COLORS.entries()) {
        const color = getPastelColor(index);
        expect(color).toMatch(/^hsl\(\d+, 60%, 80%\)$/);
      }
    });
  });
}
