/**
 * 配列内の指定されたインデックスの2つの要素を入れ替えた新しい配列を返します。
 *
 * @template T - 配列の要素の型
 * @param array - 元の配列
 * @param indexA - 入れ替える最初の要素のインデックス
 * @param indexB - 入れ替える2番目の要素のインデックス
 * @returns 要素が入れ替わった新しい配列、またはインデックスが無効な場合は元の配列
 *
 * @example
 * ```typescript
 * const arr = [1, 2, 3, 4];
 * const swapped = swap(arr, 0, 2); // [3, 2, 1, 4]
 * ```
 *
 * @example
 * ```typescript
 * const items = [{id: 'a'}, {id: 'b'}, {id: 'c'}];
 * const result = swap(items, 1, 2); // [{id: 'a'}, {id: 'c'}, {id: 'b'}]
 * ```
 */
export function swap<T>(array: T[], indexA: number, indexB: number): T[] {
  if (
    indexA < 0 ||
    indexB < 0 ||
    indexA >= array.length ||
    indexB >= array.length
  ) {
    return array;
  }

  const itemA = array[indexA];
  const itemB = array[indexB];

  if (!itemA || !itemB) return array;

  return array.map((item, index) => {
    if (index === indexA) return itemB;
    if (index === indexB) return itemA;
    return item;
  });
}

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe("swap", () => {
    it("正常なインデックスで要素を入れ替える", () => {
      const array = [1, 2, 3, 4];
      const result = swap(array, 0, 2);
      expect(result).toEqual([3, 2, 1, 4]);
    });

    it("オブジェクト配列で要素を入れ替える", () => {
      const array = [{ id: "a" }, { id: "b" }, { id: "c" }];
      const result = swap(array, 1, 2);
      expect(result).toEqual([{ id: "a" }, { id: "c" }, { id: "b" }]);
    });

    it("同じインデックスを指定した場合、元の配列と同じ結果を返す", () => {
      const array = [1, 2, 3];
      const result = swap(array, 1, 1);
      expect(result).toEqual([1, 2, 3]);
    });

    it("負のインデックスが指定された場合、元の配列を返す", () => {
      const array = [1, 2, 3];
      const result = swap(array, -1, 1);
      expect(result).toBe(array);
    });

    it("範囲外のインデックスが指定された場合、元の配列を返す", () => {
      const array = [1, 2, 3];
      const result = swap(array, 0, 5);
      expect(result).toBe(array);
    });

    it("空の配列の場合、元の配列を返す", () => {
      const array: number[] = [];
      const result = swap(array, 0, 1);
      expect(result).toBe(array);
    });

    it("元の配列を変更しない（immutable）", () => {
      const array = [1, 2, 3];
      const result = swap(array, 0, 2);
      expect(array).toEqual([1, 2, 3]); // 元の配列は変更されない
      expect(result).not.toBe(array); // 新しい配列が返される
    });
  });
}
