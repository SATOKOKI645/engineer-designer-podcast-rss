# <img src="src/site/images/icon-transparent.png" height=26> IT企業のポッドキャスト更新まとめ

IT企業が運営しているポッドキャストの更新をまとめたRSSフィードを配信しています。

@yamadashyさんの作成された[yamadashy/tech-blog-rss-feed](https://yamadashy.github.io/tech-blog-rss-feed/)をフォークして作成しました。


## 番組追加の方針

以下の条件を満たした番組を追加しています。

- IT企業が運営していること

個人のエンジニアやデザイナーが運営しているポッドキャスト番組については[it-trio/engineer-designer-podcast-rss](https://github.com/it-trio/engineer-designer-podcast-rss)で管理しています。

## 番組の追加方法
[src/resources/feed-info-list.ts](https://github.com/it-trio/it-company-podcast-rss-feed/blob/main/src/resources/feed-info-list.ts) で管理しており、その一覧にない場合 issue を作っていただければ対応します。  

### プルリクでの送り方
もしプルリクを送っていただける場合は以下のように作成できます。

1. このリポジトリをフォーク
2. ブランチ作成  
   `git checkout -b new-blog-feed-xxx`
3. フィードを追加  
   `src/resources/feed-info-list.ts` の `FEED_INFO_LIST` を更新
4. コミット  
   `git commit -am 'add: 新規フィード追加`
5. プッシュ  
   `git push origin new-blog-feed-xxx`
6. プルリクを作成

## 開発

### 仕組み
GitHub Actions で定期的に更新されており、サイトの生成は [Eleventy](https://www.11ty.dev/) を使用しています。

更新は多少遅延ありますが以下のタイミングで行います。
- 平日 6時、12時、20時

### 開発環境とコマンド
環境
- Node.js >= 20

パッケージのインストール
```bash
$ yarn
```

フィード生成とサイト立ち上げ
```bash
$ # フィードを取得して作成
$ yarn feed-generate

$ # localhost:8080 で確認
$ yarn site-serve
```

コードのチェック
```bash
$ # lint
$ yarn lint

$ # TypeScript のチェック
$ yarn type-check

$ # テスト
$ yarn test
```

## ライセンス
MIT
