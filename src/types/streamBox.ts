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

  // 基準サイズ（初期サイズ）
  baseSize?: Size;

  // 現在の倍率（基準サイズからの変化倍率）
  scale?: { x: number; y: number };
}

export type Mode = "resize" | "crop";
