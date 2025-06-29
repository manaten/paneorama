import type { en } from "./en";

export const ja = {
  // Welcome Overlay
  "welcome.subtitle": "ストリーミング向け画面キャプチャマネジメントツール",
  "welcome.step1": "複数の画面やウィンドウをキャプチャ",
  "welcome.step2": "ドラッグ＆リサイズで自由に配置",
  "welcome.step3": "レイヤー制御とソース切り替え",
  "welcome.cta": "+ ボタンをクリックしてキャプチャを開始",
  "welcome.ctaHint": "右上隅の+ボタンを押して始めましょう",
  "welcome.installTip":
    "PaneoramaをPWAアプリとしてインストールすると、より快適に利用できます",
  "welcome.installButton": "インストール",
  "welcome.installTitle": "PaneoramaをPWAアプリとしてインストール",

  // Main Canvas
  "mainCanvas.startCapture": "画面キャプチャを開始",

  // Stream Box
  "streamBox.resize": "リサイズ",
  "streamBox.crop": "クロップ",
  "streamBox.resizeHandle": "リサイズハンドル",
  "streamBox.cropHandle": "クロップハンドル",
  "streamBox.move": "移動",
  "streamBox.panContent": "コンテンツをパン",
} as const satisfies Record<keyof typeof en, string>;
