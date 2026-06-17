/**
 * 税金計算に関する共通の型定義。
 * 金額はすべて「円」単位の数値（number）で扱う。
 */

/** ふるさと納税シミュレーターの入力値 */
export interface FurusatoInput {
  /** 給与収入（年収・額面） */
  annualIncome: number;
  /** 年間の社会保険料。未入力（undefined）の場合は年収から推定する */
  socialInsurance?: number;
  /** 配偶者控除の対象となる配偶者がいるか */
  hasSpouse: boolean;
  /** 一般の扶養親族の人数（16〜18歳・23〜69歳など） */
  generalDependents: number;
  /** 特定扶養親族の人数（19〜22歳） */
  specificDependents: number;
  /** 医療費控除・生命保険料控除などその他の所得控除の合計 */
  otherDeductions: number;
}

/** ふるさと納税シミュレーターの計算結果 */
export interface FurusatoResult {
  /** 自己負担2,000円で寄付できる控除上限額の目安 */
  donationLimit: number;
  /** 課税所得（所得税ベース） */
  taxableIncomeForIncomeTax: number;
  /** 住民税の所得割額 */
  residentTaxIncomeLevy: number;
  /** 適用される所得税の限界税率（例: 0.2 = 20%） */
  marginalIncomeTaxRate: number;
}

/** 副業の所得区分 */
export type SideIncomeType = "miscellaneous" | "business";

/** 副業税金シミュレーターの入力値 */
export interface FukugyoInput {
  /** 本業の給与収入（年収・額面） */
  mainAnnualIncome: number;
  /** 本業の年間社会保険料。未入力なら年収から推定する */
  mainSocialInsurance?: number;
  /** 副業の年間収入（売上） */
  sideRevenue: number;
  /** 副業にかかった年間の必要経費 */
  sideExpenses: number;
  /** 副業の所得区分 */
  sideIncomeType: SideIncomeType;
}

/** 副業税金シミュレーターの計算結果 */
export interface FukugyoResult {
  /** 副業の所得（収入 − 経費） */
  sideIncome: number;
  /** 副業によって増える所得税（復興特別所得税込み） */
  additionalIncomeTax: number;
  /** 副業によって増える住民税 */
  additionalResidentTax: number;
  /** 増える税金の合計 */
  totalAdditionalTax: number;
  /** 副業所得から税金を引いた手取り */
  netSideIncome: number;
  /** 所得税の確定申告が必要か（給与所得者で副業所得が20万円超） */
  needsTaxReturn: boolean;
}
