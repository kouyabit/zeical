/**
 * 給与所得・課税所得・所得税額など、税金計算の土台となる共通ロジック。
 */
import {
  BASIC_DEDUCTION_INCOME_TAX,
  BASIC_DEDUCTION_RESIDENT_TAX,
  GENERAL_DEPENDENT_DEDUCTION_INCOME_TAX,
  GENERAL_DEPENDENT_DEDUCTION_RESIDENT_TAX,
  INCOME_TAX_BRACKETS,
  RECONSTRUCTION_TAX_RATE,
  SOCIAL_INSURANCE_ESTIMATE_RATE,
  SPECIFIC_DEPENDENT_DEDUCTION_INCOME_TAX,
  SPECIFIC_DEPENDENT_DEDUCTION_RESIDENT_TAX,
  SPOUSE_DEDUCTION_INCOME_TAX,
  SPOUSE_DEDUCTION_RESIDENT_TAX,
} from "./constants";

/**
 * 給与所得控除を計算する（2020年分以降・2025年度も同様）。
 * ※所得税法第28条。給与収入から差し引ける「みなし経費」。
 */
export function calcEmploymentIncomeDeduction(annualIncome: number): number {
  if (annualIncome <= 1_625_000) return 550_000;
  if (annualIncome <= 1_800_000) return annualIncome * 0.4 - 100_000;
  if (annualIncome <= 3_600_000) return annualIncome * 0.3 + 80_000;
  if (annualIncome <= 6_600_000) return annualIncome * 0.2 + 440_000;
  if (annualIncome <= 8_500_000) return annualIncome * 0.1 + 1_100_000;
  // 850万円超は上限195万円で頭打ち
  return 1_950_000;
}

/**
 * 給与収入から給与所得（給与所得控除後の金額）を求める。
 */
export function calcEmploymentIncome(annualIncome: number): number {
  const deduction = calcEmploymentIncomeDeduction(annualIncome);
  return Math.max(0, annualIncome - deduction);
}

/**
 * 社会保険料を求める。入力があればその値、なければ年収からの概算を返す。
 */
export function resolveSocialInsurance(
  annualIncome: number,
  provided?: number,
): number {
  if (provided !== undefined && provided >= 0) return provided;
  return annualIncome * SOCIAL_INSURANCE_ESTIMATE_RATE;
}

/** 人的控除など、所得控除の計算に必要な家族構成 */
export interface FamilyDeductionInput {
  hasSpouse: boolean;
  generalDependents: number;
  specificDependents: number;
}

/**
 * 所得税ベースの所得控除合計を求める。
 * 内訳: 基礎控除 + 社会保険料控除 + 配偶者控除 + 扶養控除 + その他控除
 */
export function calcIncomeTaxDeductions(
  socialInsurance: number,
  family: FamilyDeductionInput,
  otherDeductions: number,
): number {
  let total = BASIC_DEDUCTION_INCOME_TAX + socialInsurance + otherDeductions;
  if (family.hasSpouse) total += SPOUSE_DEDUCTION_INCOME_TAX;
  total += family.generalDependents * GENERAL_DEPENDENT_DEDUCTION_INCOME_TAX;
  total += family.specificDependents * SPECIFIC_DEPENDENT_DEDUCTION_INCOME_TAX;
  return total;
}

/**
 * 住民税ベースの所得控除合計を求める。
 * 住民税は基礎控除・人的控除の額が所得税より小さい点に注意。
 */
export function calcResidentTaxDeductions(
  socialInsurance: number,
  family: FamilyDeductionInput,
  otherDeductions: number,
): number {
  let total = BASIC_DEDUCTION_RESIDENT_TAX + socialInsurance + otherDeductions;
  if (family.hasSpouse) total += SPOUSE_DEDUCTION_RESIDENT_TAX;
  total += family.generalDependents * GENERAL_DEPENDENT_DEDUCTION_RESIDENT_TAX;
  total += family.specificDependents * SPECIFIC_DEPENDENT_DEDUCTION_RESIDENT_TAX;
  return total;
}

/**
 * 課税所得から所得税額を計算する（速算表を使用）。
 * ※国税庁 No.2260 の速算表。復興特別所得税は含めない。
 */
export function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  // 1,000円未満は切り捨てて課税標準とする
  const base = Math.floor(taxableIncome / 1000) * 1000;
  const bracket =
    INCOME_TAX_BRACKETS.find((b) => base <= b.threshold) ??
    INCOME_TAX_BRACKETS[INCOME_TAX_BRACKETS.length - 1];
  return base * bracket.rate - bracket.deduction;
}

/**
 * 課税所得に対応する所得税の限界税率（その所得に適用される最も高い税率）を返す。
 */
export function getMarginalIncomeTaxRate(taxableIncome: number): number {
  const base = Math.max(0, taxableIncome);
  const bracket =
    INCOME_TAX_BRACKETS.find((b) => base <= b.threshold) ??
    INCOME_TAX_BRACKETS[INCOME_TAX_BRACKETS.length - 1];
  return bracket.rate;
}

/**
 * 復興特別所得税を含めた所得税額を返す（所得税額 × 1.021）。
 */
export function withReconstructionTax(incomeTax: number): number {
  return incomeTax * RECONSTRUCTION_TAX_RATE;
}
