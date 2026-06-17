/**
 * 2025年度（令和7年度）の税制に基づく定数・税率表。
 * ※各数値の根拠は所得税法・地方税法および国税庁の速算表による。
 */

/** 復興特別所得税の係数（所得税額の2.1%を上乗せ）※復興財源確保法 */
export const RECONSTRUCTION_TAX_RATE = 1.021;

/** 住民税所得割の標準税率（10% = 道府県民税4% + 市町村民税6%）※地方税法 */
export const RESIDENT_TAX_RATE = 0.1;

/** ふるさと納税の自己負担額（固定で2,000円）※地方税法第37条の2 */
export const FURUSATO_SELF_PAYMENT = 2000;

/** 基礎控除（所得税）※所得税法第86条。合計所得2,400万円以下の場合 */
export const BASIC_DEDUCTION_INCOME_TAX = 480000;

/** 基礎控除（住民税）※地方税法。合計所得2,400万円以下の場合 */
export const BASIC_DEDUCTION_RESIDENT_TAX = 430000;

/** 配偶者控除（一般・本人所得900万円以下）※所得税法第83条／住民税は33万円 */
export const SPOUSE_DEDUCTION_INCOME_TAX = 380000;
export const SPOUSE_DEDUCTION_RESIDENT_TAX = 330000;

/** 一般の扶養控除（1人あたり）※所得税法第84条／住民税は33万円 */
export const GENERAL_DEPENDENT_DEDUCTION_INCOME_TAX = 380000;
export const GENERAL_DEPENDENT_DEDUCTION_RESIDENT_TAX = 330000;

/** 特定扶養控除（19〜22歳・1人あたり）※所得税法第84条／住民税は45万円 */
export const SPECIFIC_DEPENDENT_DEDUCTION_INCOME_TAX = 630000;
export const SPECIFIC_DEPENDENT_DEDUCTION_RESIDENT_TAX = 450000;

/** 住民税の調整控除（簡易計算では一律2,500円とする）※地方税法 */
export const RESIDENT_TAX_ADJUSTMENT = 2500;

/** 社会保険料の概算率（年収に対する目安。健康保険・厚生年金・雇用保険の合計）*/
export const SOCIAL_INSURANCE_ESTIMATE_RATE = 0.15;

/** 給与所得者の確定申告が不要となる副業所得の上限（これを超えると申告が必要） */
export const SIDE_INCOME_TAX_RETURN_THRESHOLD = 200000;

/**
 * 所得税の速算表（2025年度）※国税庁 No.2260。
 * threshold: 課税所得がこの金額「以下」のとき、その rate（税率）と deduction（控除額）を使う。
 */
export interface IncomeTaxBracket {
  threshold: number;
  rate: number;
  deduction: number;
}

export const INCOME_TAX_BRACKETS: readonly IncomeTaxBracket[] = [
  { threshold: 1_949_000, rate: 0.05, deduction: 0 },
  { threshold: 3_299_000, rate: 0.1, deduction: 97_500 },
  { threshold: 6_949_000, rate: 0.2, deduction: 427_500 },
  { threshold: 8_999_000, rate: 0.23, deduction: 636_000 },
  { threshold: 17_999_000, rate: 0.33, deduction: 1_536_000 },
  { threshold: 39_999_000, rate: 0.4, deduction: 2_796_000 },
  { threshold: Infinity, rate: 0.45, deduction: 4_796_000 },
] as const;
