export interface StreamBoxTransform {
  // ボックスの表示位置とサイズ（クロップ後）
  crop: {
    x: number; // content内の左上のx（クロップ開始）
    y: number; // content内の上端y
    width: number; // 表示する幅
    height: number; // 表示する高さ
  };

  // 表示上のスケーリング倍率（リサイズ）
  scale: number;

  // 表示上の位置（画面上の位置）
  screenPosition: {
    x: number;
    y: number;
  };
}

export type Mode = "resize" | "crop";
