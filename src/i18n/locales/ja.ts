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
  "mainCanvas.addClock": "時計を追加",
  "mainCanvas.addTimer": "タイマーを追加",

  // Stream Box
  "streamBox.resize": "リサイズ",
  "streamBox.crop": "クロップ",
  "streamBox.resizeHandle": "リサイズハンドル",
  "streamBox.cropHandle": "クロップハンドル",
  "streamBox.move": "移動",
  "streamBox.panContent": "コンテンツをパン",
  "streamBox.switchToCrop": "クロップモードに切り替え",
  "streamBox.switchToResize": "リサイズモードに切り替え",
  "streamBox.switchVideo": "別の画面/ウィンドウに切り替え",
  "streamBox.bringToFront": "前面に移動",
  "streamBox.sendToBack": "背面に移動",
  "streamBox.closeStream": "閉じる",
} as const satisfies Record<keyof typeof en, string>;
