export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StreamBoxData {
  // コンテナ（表示枠）の絶対位置
  containerPosition: Position;

  // コンテナのサイズ
  containerSize: Size;

  // クロッピング設定（ソースビデオ上の切り取り範囲）
  cropRect: CropRect;
}

export type Mode = "resize" | "crop";
