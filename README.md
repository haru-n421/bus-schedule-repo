# バス時刻表アプリケーション

リアルタイムでバスの時刻表を表示するWebアプリケーションです。平日、土曜、休日の時刻表に対応し、次の出発時刻を自動的に表示します。

## 機能

- 路線選択
  - 複数路線の時刻表表示
  - 路線ごとの時刻表データ管理

- スケジュール表示
  - 平日/土曜/休日の自動判定
  - 祝日対応
  - 次の出発時刻を3つまで表示
  - 1分ごとの自動更新

- データベース管理
  - PostgreSQLによるデータ管理
  - RESTful API
  - 路線、時刻表、祝日データの一元管理

## 技術スタック

- フロントエンド
  - Vanilla JavaScript (ES Modules)
  - HTML5
  - CSS3

- バックエンド
  - Node.js
  - Express.js
  - PostgreSQL

- 開発環境
  - Vite
  - dotenv
  - ESLint

## セットアップ

1. リポジトリのクローン
```bash
git clone <repository-url>
cd bus-schedule
```

2. 依存関係のインストール
```bash
npm install
```

3. データベースのセットアップ
```bash
# PostgreSQLユーザーの作成
createuser -s postgres

# データベースの作成
createdb bus_schedule

# テーブルとサンプルデータの作成
psql -d bus_schedule -f db/migrations/001_create_tables.sql
```

4. 環境変数の設定
```bash
# 設定例をコピー
cp .env.example .env

# .envファイルを編集して必要な設定を行う
# - DB_USER: データベースユーザー名
# - DB_PASSWORD: データベースパスワード
# - DB_HOST: データベースホスト
# - DB_PORT: データベースポート
# - DB_NAME: データベース名
# - PORT: サーバーポート
```

5. アプリケーションの起動
```bash
# 開発サーバーの起動
npm run dev
```

## 開発規約

- コードスタイル
  - ES Modulesベースの開発
  - 単一責任の原則に従う
  - セマンティックなHTML構造
  - レスポンシブデザイン対応

- パフォーマンス
  - 最小限のDOM操作
  - 効率的なイベントハンドリング
  - 最適化されたアニメーション

## テスト

```bash
# テストの実行
npm test

# カバレッジレポートの生成
npm run test:coverage
```

## API仕様

### GET /api/routes
全路線の一覧を取得します。

```json
[
  {
    "id": 1,
    "name": "埼京線",
    "created_at": "2025-03-14T08:22:20.978Z"
  }
]
```

### GET /api/schedules/:routeId
指定した路線の時刻表を取得します。

```json
{
  "weekday": [
    {
      "hour": 7,
      "minutes": [0, 15, 30, 45]
    }
  ],
  "saturday": [
    {
      "hour": 8,
      "minutes": [0, 30]
    }
  ],
  "holiday": [
    {
      "hour": 9,
      "minutes": [0, 30]
    }
  ]
}
```

### GET /api/holidays
祝日の一覧を取得します。

```json
["2025-01-01", "2025-03-21"]
```

## ライセンス

MIT License
