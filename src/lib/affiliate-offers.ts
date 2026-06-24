/**
 * アフィリエイト案件を一元管理する設定ファイル。
 *
 * 【使い方】ASP（A8.net・もしも・バリューコマース等）に登録して取得した
 * 実際のアフィリエイトURLを、各案件の `url` に貼り付けてください。
 * url が空（""）の案件は、サイト上では「準備中」と表示され、リンクは無効になります
 * （まだ取得していないリンクが誤って公開されるのを防ぐため）。
 */

import { FURUNAVI_VC_REFERRAL } from "./affiliate-config";

/** 案件のジャンル */
export type OfferCategory = "furusato" | "tax-software" | "side-job";

/**
 * A8.net のリンクURLをHTML用に正規化する。
 * a8mat の「+」はHTMLではスペース扱いになり、リンク先が壊れるため %2B に変換する。
 */
export function normalizeA8AffiliateUrl(url: string): string {
  if (!url.includes("px.a8.net") || !url.includes("a8mat=")) return url;
  return url.replace(/a8mat=([^&]+)/, (_match, mat: string) => {
    const encodedMat = mat.replace(/\+/g, "%2B");
    return `a8mat=${encodedMat}`;
  });
}

export interface AffiliateOffer {
  /** GA計測・data-aff属性に使う識別子（半角英数） */
  id: string;
  /** サービス名 */
  name: string;
  /** 一言キャッチコピー */
  catch: string;
  /** 補足説明 */
  description: string;
  /** ボタンの文言 */
  ctaLabel: string;
  /** ジャンル */
  category: OfferCategory;
  /** ASPで取得した実際のアフィリエイトURL（未取得なら空文字のまま） */
  url: string;
}

export const affiliateOffers: AffiliateOffer[] = [
  // ── ふるさと納税ポータル ──
  {
    id: "furunavi",
    name: "ふるなび",
    catch: "高還元のふるさと納税サイト",
    description:
      "寄付でふるなびコインがもらえる、人気のふるさと納税ポータル。家電などの返礼品も豊富です。",
    ctaLabel: "ふるなびで返礼品を探す",
    category: "furusato",
    // バリューコマース（pid 先のふるなびトップへ遷移）
    url: FURUNAVI_VC_REFERRAL,
  },
  {
    id: "satofull",
    name: "さとふる",
    catch: "使いやすさで人気",
    description:
      "申し込みから配送状況の確認までわかりやすい、初心者にもおすすめのふるさと納税サイト。",
    ctaLabel: "さとふるで探す",
    category: "furusato",
    url: "",
  },
  {
    id: "rakuten-furusato",
    name: "楽天ふるさと納税",
    catch: "楽天ポイントが貯まる・使える",
    description:
      "普段の楽天での買い物と同じ感覚で寄付ができ、楽天ポイントも貯まるのが魅力です。",
    ctaLabel: "楽天ふるさと納税を見る",
    category: "furusato",
    url: "",
  },

  // ── 会計ソフト・確定申告 ──
  {
    id: "freee",
    name: "freee会計",
    catch: "副業の確定申告をかんたんに",
    description:
      "簿記の知識がなくても、質問に答える形で確定申告書が作れるクラウド会計ソフト。",
    ctaLabel: "freeeを無料で試す",
    category: "tax-software",
    url: "",
  },
  {
    id: "moneyforward",
    name: "マネーフォワード クラウド確定申告",
    catch: "銀行・カードと自動連携",
    description:
      "口座やクレジットカードと連携して、副業の収支を自動で記録・集計できます。",
    ctaLabel: "マネーフォワードを試す",
    category: "tax-software",
    // A8.net（+ は %2B にエンコードして保存）
    url: "https://px.a8.net/svt/ejp?a8mat=4B61WH%2BEPAECA%2B4JGQ%2BC3J0H",
  },
  {
    id: "yayoi",
    name: "やよいの青色申告 オンライン",
    catch: "定番の会計ソフト",
    description:
      "青色申告に対応した定番ソフト。初年度無料プランがあり、副業を始めた人にも始めやすい。",
    ctaLabel: "やよいを見る",
    category: "tax-software",
    // A8.net（+ は %2B にエンコードして保存）
    url: "https://px.a8.net/svt/ejp?a8mat=4B61WH%2BFEW1CQ%2B35XE%2B5YJRM",
  },

  // ── 副業の入口サービス ──
  {
    id: "coconala",
    name: "ココナラ",
    catch: "得意を出品して副収入",
    description:
      "イラスト・ライティング・相談など、自分のスキルを出品して副業収入を得られるサービス。",
    ctaLabel: "ココナラを見る",
    category: "side-job",
    url: "",
  },
  {
    id: "crowdworks",
    name: "クラウドワークス",
    catch: "在宅でできる仕事が豊富",
    description:
      "未経験でも始めやすい在宅ワークが多数。副業の最初の一歩におすすめです。",
    ctaLabel: "クラウドワークスを見る",
    category: "side-job",
    url: "",
  },
];

/** 指定ジャンルの案件だけを取り出す */
export function getOffersByCategory(
  category: OfferCategory,
): AffiliateOffer[] {
  return affiliateOffers.filter((offer) => offer.category === category);
}
