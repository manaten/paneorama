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
  "mainCanvas.help": "ヘルプ・ドキュメント",

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

  // Help Panel
  "help.title": "ヘルプ・ドキュメント",
  "help.close": "ヘルプを閉じる",
  "help.gettingStarted": "はじめに",
  "help.streamControls": "ストリーム操作",
  "help.proTips": "プロのコツ",
  "help.troubleshooting": "トラブルシューティング",

  "help.startFirstCapture": "初回キャプチャの開始",
  "help.startFirstCaptureDesc":
    "右上の+ボタンをクリックして、画面またはウィンドウのキャプチャを開始します。",
  "help.startFirstCaptureTip1": "キャプチャしたい画面/ウィンドウを選択",
  "help.startFirstCaptureTip2": "ブラウザから権限を求められたら許可する",

  "help.positionWindows": "ウィンドウの配置",
  "help.positionWindowsDesc":
    "キャプチャしたウィンドウをドラッグ＆リサイズして、プレゼンテーションに最適な配置にします。",
  "help.positionWindowsTip1": "クリック＆ドラッグでウィンドウを移動",
  "help.positionWindowsTip2": "角をドラッグしてリサイズ",
  "help.positionWindowsTip3":
    "レイヤーコントロールでウィンドウの前後関係を調整",

  "help.windowControls": "ウィンドウコントロール",
  "help.windowControlsDesc":
    "各キャプチャウィンドウには、ホバー時に表示される独自のコントロールがあります：",
  "help.windowControlsTip1":
    "🔄 ビデオ切り替え：別の画面/ウィンドウにソースを変更",
  "help.windowControlsTip2":
    "⬆️ 前面に移動：このウィンドウを他のウィンドウの前に移動",
  "help.windowControlsTip3":
    "⬇️ 背面に移動：このウィンドウを他のウィンドウの後ろに移動",
  "help.windowControlsTip4":
    "✂️ クロップ/リサイズ：クロップモードとリサイズモードを切り替え",
  "help.windowControlsTip5": "❌ 閉じる：キャプチャを停止してウィンドウを削除",

  "help.resizeVsCrop": "リサイズ vs クロップモード",
  "help.resizeVsCropDesc": "キャプチャしたコンテンツの調整方法を選択：",
  "help.resizeVsCropTip1":
    "リサイズモード：アスペクト比を維持してコンテンツ全体をスケール",
  "help.resizeVsCropTip2":
    "クロップモード：フル解像度でコンテンツの一部のみを表示",
  "help.resizeVsCropTip3":
    "クロップ/リサイズボタンをクリックしてモードを切り替え",

  "help.presentationBestPractices": "プレゼンテーションのベストプラクティス",
  "help.presentationBestPracticesDesc":
    "より魅力的なプレゼンテーションにするために：",
  "help.presentationBestPracticesTip1":
    "複数の画面を使用して異なるアプリケーションを同時に表示",
  "help.presentationBestPracticesTip2":
    "プレゼンテーションの論理的な流れに沿ってウィンドウを配置",
  "help.presentationBestPracticesTip3": "本番前にセットアップをテスト",
  "help.presentationBestPracticesTip4":
    "アプリケーションの特定部分に焦点を当てるためクロップモードを使用",

  "help.performanceOptimization": "パフォーマンス最適化",
  "help.performanceOptimizationDesc":
    "Paneoramaから最高のパフォーマンスを得るために：",
  "help.performanceOptimizationTip1":
    "システムリソースを解放するため不要なアプリケーションを閉じる",
  "help.performanceOptimizationTip2":
    "パフォーマンス向上のため低解像度キャプチャを使用",
  "help.performanceOptimizationTip3":
    "遅延を感じる場合は同時キャプチャ数を制限",
  "help.performanceOptimizationTip4":
    "より良いパフォーマンスとオフラインアクセスのためPWAとしてインストール",

  "help.commonIssues": "よくある問題",
  "help.commonIssuesDesc": "よく遭遇する問題の解決方法：",
  "help.commonIssuesTip1":
    "キャプチャボタンが見えない：モダンブラウザ（Chrome、Edge、Firefox）を使用していることを確認",
  "help.commonIssuesTip2":
    "権限が拒否される：ブラウザ設定を確認し、画面キャプチャ権限を許可",
  "help.commonIssuesTip3":
    "パフォーマンスが悪い：アクティブキャプチャ数を減らすか解像度を下げる",
  "help.commonIssuesTip4":
    "音声が機能しない：プライバシーのため音声キャプチャはデフォルトで無効",

  "help.browserCompatibility": "ブラウザ対応",
  "help.browserCompatibilityDesc": "Paneoramaが最も良く動作するブラウザ：",
  "help.browserCompatibilityTip1": "✅ Chrome 72+",
  "help.browserCompatibilityTip2": "✅ Edge 79+",
  "help.browserCompatibilityTip3": "✅ Firefox 66+",
  "help.browserCompatibilityTip4": "✅ Safari 13+（限定サポート）",
  "help.browserCompatibilityTip5": "❌ Internet Explorer（サポート対象外）",

  // Interactive Tutorial
  "tutorial.welcome": "Paneoramaへようこそ！🎉",
  "tutorial.welcomeDesc": "画面キャプチャ管理の使い方を簡単にご紹介します。",
  "tutorial.startFirstCapture": "初回キャプチャの開始",
  "tutorial.startFirstCaptureDesc":
    "右上の+ボタンをクリックして、画面またはウィンドウのキャプチャを開始します。",
  "tutorial.grantPermissions": "権限の許可",
  "tutorial.grantPermissionsDesc":
    "ブラウザが画面キャプチャの権限を求めます。「許可」をクリックして続行してください。",
  "tutorial.chooseSource": "キャプチャ対象の選択",
  "tutorial.chooseSourceDesc":
    "ブラウザの選択ダイアログから、キャプチャしたい画面、ウィンドウ、またはタブを選択します。",
  "tutorial.hoverControls": "ホバーでコントロール表示",
  "tutorial.hoverControlsDesc":
    "キャプチャしたウィンドウにホバーすると、コントロールボタンが表示されます。ドラッグして移動したり、角をリサイズしてみましょう！",
  "tutorial.complete": "準備完了！🚀",
  "tutorial.completeDesc":
    "基本操作を覚えました！詳細なドキュメントはいつでもヘルプボタンから確認できます。",
  "tutorial.startTutorial": "チュートリアル開始",
  "tutorial.skipForNow": "今はスキップ",
  "tutorial.previous": "前へ",
  "tutorial.next": "次へ",
  "tutorial.finish": "完了",
  "tutorial.skipTutorial": "チュートリアルをスキップ",
  "tutorial.step": "ステップ",
  "tutorial.of": "/",

  // Keyboard Shortcuts
  "shortcuts.title": "キーボードショートカット",
  "shortcuts.close": "ショートカットを閉じる",
  "shortcuts.general": "一般",
  "shortcuts.streamControls": "ストリーム操作",
  "shortcuts.navigation": "ナビゲーション",
  "shortcuts.showShortcuts": "キーボードショートカットを表示",
  "shortcuts.showHelp": "ヘルプパネルを表示",
  "shortcuts.closePanels": "パネル/ダイアログを閉じる",
  "shortcuts.addCapture": "新しいキャプチャを追加",
  "shortcuts.closeStream": "選択したストリームを閉じる",
  "shortcuts.bringToFront": "ストリームを前面に移動",
  "shortcuts.sendToBack": "ストリームを背面に移動",
  "shortcuts.switchSource": "ストリームソースを切り替え",
  "shortcuts.toggleMode": "リサイズ/クロップモードを切り替え",
  "shortcuts.selectNext": "次のストリームを選択",
  "shortcuts.selectPrevious": "前のストリームを選択",
  "shortcuts.selectByNumber": "番号でストリームを選択",
  "shortcuts.tip": "ヒント：",
  "shortcuts.tipDesc": "でこのショートカットをいつでも表示",

  // Status Indicator
  "status.capturing": "キャプチャ中",
  "status.paused": "停止中",
} as const satisfies Record<keyof typeof en, string>;
