# バス時刻表アプリ

[![CI](https://github.com/<your-username>/bus-schedule/actions/workflows/ci.yml/badge.svg)](https://github.com/<your-username>/bus-schedule/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/<your-username>/bus-schedule/branch/main/graph/badge.svg)](https://codecov.io/gh/<your-username>/bus-schedule)

シンプルで直感的なバス時刻表Webアプリケーションです。

## 特徴

- 現在時刻から次の発車時刻までの待ち時間を表示
- 平日/土曜/日祝の時刻表に対応
- スマートフォン対応のレスポンシブデザイン
- 30秒ごとの自動更新機能

## セットアップ方法

1. `data.js`ファイル内の`busScheduleData`オブジェクトを実際の時刻表データで更新します。
2. Webサーバーにファイルをアップロードするか、ローカルで開発用サーバーを起動します。

## 開発者向け情報

### テストの実行

```bash
# 通常のテスト実行
npm test

# カバレッジレポート付きでテストを実行
npm run test:coverage
```

カバレッジレポートは `coverage/` ディレクトリに生成されます。
- `coverage/lcov-report/index.html`: HTML形式のカバレッジレポート
- `coverage/lcov.info`: CI/CDで使用されるLCOV形式のレポート

### コード品質

- ESLintによる静的解析
- Jest によるユニットテスト
- 80%以上のコードカバレッジ要件

## データ形式

時刻表データは以下の形式で`data.js`に記述します：

```javascript
{
    routes: [
        {
            id: "route1",
            name: "路線名",
            schedules: {
                weekday: [
                    {hour: 7, minutes: [0, 15, 30, 45]},
                    // ...
                ],
                saturday: [...],
                holiday: [...]
            }
        }
    ],
    holidays: [
        "2025-01-01",  // 祝日をYYYY-MM-DD形式で指定
        // ...
    ]
}
```

## カスタマイズ

- `style.css`: UIのカスタマイズ
- `main.js`: 更新間隔の変更（UPDATE_INTERVAL）
- `data.js`: 時刻表データの更新

## 注意事項

- ブラウザのJavaScriptを有効にする必要があります
- 時刻表データは定期的にメンテナンスしてください

## 路線時刻表システム

## 概要
このシステムは、路線の時刻表を表示し、次の発車時刻と待ち時間を計算するWebアプリケーションです。平日、土曜、日祝の異なるスケジュールに対応し、リアルタイムで時刻表を更新します。

## デモ
![時刻表アプリケーション](./docs/images/app-screenshot.png)

## 機能
- 現在時刻からの次の発車時刻を表示
- 平日・土曜・日祝の時刻表切り替え
- 待ち時間のリアルタイム計算
- 1分ごとの自動更新
- レスポンシブデザイン対応

## 技術スタック
- フロントエンド: Vanilla JavaScript (ES Modules)
- スタイリング: CSS
- テスト: Jest
- ビルドツール: Vite
- パフォーマンステスト: Lighthouse

## 必要要件
- Node.js 18.0.0以上
- npm 9.0.0以上
- モダンブラウザ（Chrome, Firefox, Safari, Edge最新版）

## インストール方法
```bash
# リポジトリのクローン
git clone https://github.com/yourusername/bus-schedule.git
cd bus-schedule

# 依存関係のインストール
npm install
```

## 使用方法
### 開発サーバーの起動
```bash
npm run dev
```
ブラウザで http://localhost:3000 を開いてアプリケーションにアクセスできます。

### テストの実行
```bash
# 全てのテストを実行
npm test

# 特定のテストファイルを実行
npm test js/main.test.js

# テストカバレッジレポートの生成
npm test -- --coverage
```

### ビルド
```bash
npm run build
```
ビルドされたファイルは`dist`ディレクトリに出力されます。

## プロジェクト構造
```
bus-schedule/
├── index.html          # メインのHTMLファイル
├── css/
│   └── style.css      # スタイルシート
├── js/
│   ├── main.js        # メインのアプリケーションロジック
│   ├── data.js        # 時刻表データ
│   ├── main.test.js   # メイン機能のテスト
│   └── performance.test.js # パフォーマンステスト
└── lighthouse.test.js  # Lighthouseテスト
```

## 主要機能の詳細

### 1. 時刻表データ構造 (`data.js`)
```javascript
{
  routes: [{
    id: 'route1',
    name: '埼京線',
    schedules: {
      weekday: [{ hour: 7, minutes: [0, 15, 30, 45] }, ...],
      saturday: [{ hour: 8, minutes: [0, 30] }, ...],
      holiday: [{ hour: 9, minutes: [0, 30] }, ...]
    }
  }],
  holidays: ['2025-01-01', '2025-03-21']
}
```

### 2. コア機能 (`main.js`)
- `formatDate(date)`: 日付を「M/D(曜日)」形式でフォーマット
- `formatTime(date)`: 時刻を「HH:MM」形式でフォーマット
- `calculateWaitingTime(currentTime, departureTime)`: 待ち時間を分単位で計算
- `findNextDepartures(route, currentTime, scheduleType)`: 次の発車時刻を2つまで取得
- `determineScheduleType(date)`: 日付から適切なスケジュールタイプを判定
- `updateDisplay()`: 画面表示を更新
- `handleScheduleTypeClick(event)`: スケジュールタイプ切り替えの処理

### 3. UI機能
- 現在の日付と時刻の表示
- スケジュールタイプの切り替え（平日/土曜/日祝）
- 次の発車時刻と待ち時間の表示
- 1分ごとの自動更新
- 手動更新ボタン

## テスト

### 1. 単体テスト (`main.test.js`)
- ユーティリティ関数のテスト
- スケジュールタイプ判定のテスト
- 次の発車時刻検索のテスト
- DOM更新のテスト

### 2. パフォーマンステスト (`performance.test.js`)
- 大規模データセットでの処理時間測定
- メモリ使用量の確認

### 3. Lighthouseテスト (`lighthouse.test.js`)
- 基本的なサーバーレスポンスのテスト
- 静的ファイル提供の確認

## スタイリング
- レスポンシブデザイン対応
- カードベースのUI
- アクセシビリティに配慮したカラースキーム
- インタラクティブな要素のアニメーション

## 開発ガイドライン

### コーディング規約
1. ES Modulesを使用したモジュール分割
2. 関数は単一責任の原則に従う
3. テストカバレッジの維持
4. CSSカスタムプロパティの活用
5. セマンティックなHTML構造

### 命名規則
- ファイル名: キャメルケース（例: `mainTest.js`）
- 関数名: キャメルケース（例: `calculateWaitingTime`）
- CSSクラス: ケバブケース（例: `schedule-type-btn`）
- 定数: 大文字スネークケース（例: `UPDATE_INTERVAL`）

### コミットメッセージ
```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメントの更新
style: コードスタイルの変更
refactor: リファクタリング
test: テストの追加・修正
chore: ビルドプロセスの変更
```

### パフォーマンス最適化
1. 不要なDOM操作の最小化
2. 効率的なイベントリスナーの使用
3. アニメーションの最適化
4. 適切なキャッシング戦略

## 拡張方法

### 1. 新規路線の追加
`data.js`の`routes`配列に新しい路線オブジェクトを追加：
```javascript
{
  id: 'route2',
  name: '新規路線名',
  schedules: {
    weekday: [/* 平日のスケジュール */],
    saturday: [/* 土曜のスケジュール */],
    holiday: [/* 休日のスケジュール */]
  }
}
```

### 2. スケジュールの変更
`data.js`の各路線の`schedules`オブジェクトを編集：
```javascript
weekday: [
  { hour: 7, minutes: [0, 15, 30, 45] },
  { hour: 8, minutes: [0, 10, 20, 30, 40, 50] }
]
```

### 3. 祝日の更新
`data.js`の`holidays`配列を編集：
```javascript
holidays: [
  '2025-01-01',  // 元日
  '2025-03-21'   // 春分の日
]
```

### 4. 新機能の追加
1. `main.js`に新しい関数を追加
2. 必要に応じて`index.html`にUI要素を追加
3. `style.css`にスタイルを追加
4. テストを`main.test.js`に追加

## トラブルシューティング

### よくある問題
1. 時刻表が表示されない
   - ブラウザのJavaScriptが有効になっているか確認
   - コンソールでエラーメッセージを確認

2. テストが失敗する
   - Node.jsとnpmのバージョンを確認
   - 依存関係が正しくインストールされているか確認

3. スタイルが適用されない
   - CSSファイルが正しくリンクされているか確認
   - ブラウザのキャッシュをクリア

## 今後の改善案
1. 路線検索機能の追加
2. 経路案内の実装
3. お気に入り路線の保存
4. プッシュ通知対応
5. オフライン対応

## 貢献方法
1. このリポジトリをフォーク
2. 新しいブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'feat: Add amazing feature'`）
4. ブランチをプッシュ（`git push origin feature/amazing-feature`）
5. プルリクエストを作成

## ライセンス
このプロジェクトはMITライセンスの下で公開されています。

## 作者
- 作成者: Your Name
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
