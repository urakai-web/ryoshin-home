# 株式会社RYOSHIN — コーポレートサイト

## Project Overview
- **Name**: 株式会社RYOSHIN 公式ホームページ（リニューアル版）
- **Goal**: 省エネ設備・住宅リフォーム・空き家対策をワンストップで提供する総合生活サポート企業のコーポレートサイト
- **Design**: ライトテーマ × 設計図風グリッド × Monospaceタイポグラフィ（[a_o_i_kogyo](https://github.com/urneis0424-lab/a_o_i_kogyo) をベースに構築）
- **Base site**: https://ryoshin-home.com/ からのリニューアル

## Features (実装済み)
- **スプラッシュスクリーン**: ロゴ → テキスト → フェードアウト のアニメーション
- **FV（ファーストビュー）**: AdobeStock素材から作成したヒーロー動画（作業員→太陽光パネル、クロスフェード結合）+ キャッチコピー
- **事業内容（SERVICE）**: 太陽光発電・蓄電池・エコキュート・セントラル浄水器・住宅リフォーム・空き家対策の6事業を、実写真付きカードの設計図風グリッドで表示（WORKSと同じ画像を流用）。加えてガスの切り替え・携帯電話・ネット回線の見直しを軽量なタグ一覧として併記
- **施工事例（WORKS）**: カテゴリフィルタ + カルーセル（静的データ、全15件すべて実写真）。うち9件はBefore/Afterトグルボタンで施工前後を切り替え可能
- **お問い合わせ（CONTACT）**: 電話（0120-60-4337）・メール（ryoshin.co.ltd@gmail.com）・LINE公式アカウント・住所
- **レスポンシブ対応**: モバイル〜デスクトップ
- **スクロールアニメーション**: IntersectionObserver によるフェードイン
- **固定ヘッダー**: スクロール時にバックドロップブラー付きで表示

## Tech Stack
- **Backend**: Hono (TypeScript) on Cloudflare Pages
- **Frontend**: Vanilla JS + CSS（CDN不要の軽量設計）
- **Fonts**: Inter, Roboto Mono, Noto Sans JP（Google Fonts）
- **Deploy**: Cloudflare Pages

## URI Paths
| Path | Description |
|------|-------------|
| `/` | メインページ（SSR） |
| `/static/*` | 静的ファイル |

## 施工事例データについて
`src/index.tsx` 内の `WORKS` 定数に静的データとして定義しています。microCMS等のCMS連携は行っていません。
`画像素材/施工事例/` フォルダにいただいた実際の施工写真を使用し、全15件を掲載しています。
- 太陽光発電①②・エコキュート①〜④・外壁塗装・基礎シーラー塗装・軒天塗装 (9件): `beforeImage` を設定し、WORKSカードにBefore/Afterトグルボタンを表示
- パワーコンディショナー・蓄電池①②・カーポート・セントラル浄水器・空き家 (6件): After写真のみ

SERVICEセクションのカード画像（太陽光・蓄電池・エコキュート・セントラル浄水器・外壁塗装・空き家）は、WORKSの代表写真（`solar.jpg`, `battery.jpg`, `ecocute.jpg`, `purifier.jpg`, `reform.jpg`, `vacant.jpg`）を個別に流用しています。

なお `画像素材/施工事例/シーラー塗装before.JPG` / `シーラー塗装after.JPG` には実在のお客様名（工事件名ラベル）が写り込んでいたため、掲載用画像（`reform-sealer-before.jpg`, `reform-sealer-after.jpg`）はラベル部分をクロップして除去しています。この2つの元ファイルは個人情報を含むため `.gitignore` で除外しており、ローカルの `画像素材/` フォルダにのみ残っています（GitHubリポジトリには含まれません）。

## 会社理念（PHILOSOPHY）ページについて
カード形式のグリッドではなく、画像とテキストが左右交互に並ぶエディトリアルなレイアウト（`.philosophy-story` / `.philosophy-row`）です。
5つの柱すべてに `画像素材/` フォルダにいただいた実写真を圧縮して使用しています
（`public/static/images/philosophy/hearing.jpg`, `energy.jpg`, `inspection.jpg`, `vacant-house.jpg`, `team.jpg`）。

## 差し替えが必要なプレースホルダー素材
以下は仮のSVGプレースホルダーです。実素材が揃い次第、差し替えてください。
| ファイル | 用途 |
|---------|------|
| `public/static/images/favicon.svg` | ファビコン |
| `public/static/images/ogp-image.svg` | OGP画像（SNSシェア用、本来はjpg/png推奨） |

## Development
```bash
npm install
npm run build          # ビルド
npm run dev:sandbox    # ローカルサーバー起動（http://localhost:3000）
pm2 start ecosystem.config.cjs  # PM2で起動
```

## Deployment
```bash
npm run deploy         # Cloudflare Pagesにデプロイ（要 wrangler ログイン）
```

## 未実装・次ステップ
- [x] 実ロゴ画像への差し替え
- [x] ヒーロー動画の実素材への差し替え
- [x] WORKS/SERVICE全6種・PHILOSOPHY全5種の実施工写真への差し替え
- [ ] Google Analytics (GA4) タグの設置
- [ ] OGP画像をjpg/pngで再生成
- [ ] お問い合わせフォームまたはLINE公式アカウント連携の追加検討
- [ ] favicon各サイズ（PNG/ICO）の生成
- [ ] 独自ドメイン(ryoshin-home.com)のCloudflare Pagesへの接続

## Last Updated
2026-07-13
