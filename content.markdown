@theme:default
@transition: dissolve

# SlideScript

#### jsでmarkdownなスライド作ってみた
###### by [geta6](//github.com/geta6)
&nbsp;

* スライドの移動は「←」「→」
* 「z」キーでHelpを表示



--------------
@transition: dissolve



# アバウトな解説

* markdownな文書からslideを作ります
* 必要なのはjsとブラウザだけ
  1. `git clone https://github.com/slidescript`
  2. `open -a Safari index.html`



--------------
@transition: dissolve
@background: maroon
@color: white



## 主な特徴

* [1ファイルのmarkdown](content.markdown)をスライドにします
  * スライドのページ区切りは「---」

* スライド一枚毎にstyleを変更可能です
  * 「`@property : value`」形式、propertyはcssの属性名です
  * ハイフンは大文字にします　例)「`z-index`」->「`zIndex`」

* トランジション・テーマの独自拡張があります
    * `@transition:transitionType`
    * `@theme:themeName`



---
@transition: dissolve
@backgroundColor: black
@color:maroon



# ![alt](./img/eloo.jpg)

# ショーケース表示

先頭のHeading要素に画像のみを指定すると、その画像がスライドの背景になります

`.image`というクラスが付くので、テーマをカスタムして文字を見やすくしてください



---



# フォルダ

### `./theme`
* テーマcssを入れます
  1. 「`./theme/hoge.css`」を作ります
  2. 先頭スライドで「@theme:hoge」を書きます、そのcssが適応されます
  3. 途中スライドに「@theme:hoge」を書くと、そのスライドが表示された時点でテーマが変更されます
  4. スライド表示後にそれ以前のスライドへ戻ってもテーマは戻りません
### `./trans`
* トランジション関数を入れます
  1. 「`./transition/dissolve.js`」を作ります
  2. 「@transition:dissolve」を書きます
  3. 書いたスライドから移動する時に、そのトランジションが適応されます



---
@transition: dissolve



# トランジション

* 「`@transition: dissolve`」でdissolveになります

* `./trans`フォルダに関数が入ってます
  * 引数1が現在のスライドノード
  * 引数2が次のスライドノード
  * 引数3がアニメーションの時間ミリ秒です
  * 引数4は、進行ならtrue、後退ならfalseが入ります


---



# 要件

* jsが使えるブラウザ
* CSS3が使えるブラウザ
* Safari/Firefoxで確認済み
  * ChromeだとlocalhostにXHRできないので使えない
  * なんとかしたい



---
@fontSize:0.8em



# 特にプレゼンするものが無くて困っている

草でもｗｗｗ生やすｗｗｗ

> マジか
>> マジ生えた
>>> はえたの？
>>>> 草はえた



## ダウンロード

[ダウンロードできる](//github.com/geta6/slidescript)



---



### トゥードゥー

* 使い方をちゃんと説明する
* slideoff的にはフッダーとヘッダーが必要らしい
  * 個人的にはいらないと思ってる
  * いるの？

* jQuery使ったら負け
