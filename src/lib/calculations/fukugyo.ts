/**
 * 副業によって増える税金（所得税・住民税）を計算する。
 * ※所得税法・地方税法に基づく。給与所得者が副業をするケースを想定。
 */
import type { FukugyoInput, FukugyoResult } from "@/types/tax";
import {
  RESIDENT_TAX_RATE,
  SIDE_INCOME_TAX_RETURN_THRESHOLD,
} from "./constants";
import {
  calcEmploymentIncome,
  calcIncomeTax,
  calcIncomeTaxDeductions,
  resolveSocialInsurance,
  withReconstructionTax,
} from "./income";

/**
 * 副業の税金を求める。
 *
 * 計算の考え方:
 *  本業だけのときの所得税と、副業所得を上乗せしたときの所得税の「差額」を、
 *  副業によって増える所得税とみなす（累進課税の段階をまたぐ場合も正しく計算できる）。
 *  住民税は所得割10%が比例課税のため、副業所得 × 10% で増える。
 */
export function calcFukugyoTax(input: FukugyoInput): FukugyoResult {
  // 副業所得（収入から経費を引いた利益）。マイナスにはしない
  const sideIncome = Math.max(0, input.sideRevenue - input.sideExpenses);

  const employmentIncome = calcEmploymentIncome(input.mainAnnualIncome);
  const socialInsurance = resolveSocialInsurance(
    input.mainAnnualIncome,
    input.mainSocialInsurance,
  );

  // 副業税金シミュレーターでは家族構成の入力を省略しているため、
  // 本人の基礎控除と社会保険料控除のみを所得控除として扱う
  const baseDeductions = calcIncomeTaxDeductions(
    socialInsurance,
    { hasSpouse: false, generalDependents: 0, specificDependents: 0 },
    0,
  );

  // 本業のみの課税所得と所得税
  const taxableMainOnly = Math.max(0, employmentIncome - baseDeductions);
  const incomeTaxMainOnly = calcIncomeTax(taxableMainOnly);

  // 副業所得を上乗せした課税所得と所得税
  const taxableWithSide = Math.max(0, taxableMainOnly + sideIncome);
  const incomeTaxWithSide = calcIncomeTax(taxableWithSide);

  // 差額に復興特別所得税（2.1%）を加える
  const additionalIncomeTax = withReconstructionTax(
    incomeTaxWithSide - incomeTaxMainOnly,
  );

  // 住民税は比例課税なので、副業所得にそのまま10%をかける
  const additionalResidentTax = sideIncome * RESIDENT_TAX_RATE;

  const totalAdditionalTax = additionalIncomeTax + additionalResidentTax;
  const netSideIncome = sideIncome - totalAdditionalTax;

  // 給与所得者は副業所得が20万円を超えると所得税の確定申告が必要
  const needsTaxReturn = sideIncome > SIDE_INCOME_TAX_RETURN_THRESHOLD;

  return {
    sideIncome,
    additionalIncomeTax,
    additionalResidentTax,
    totalAdditionalTax,
    netSideIncome,
    needsTaxReturn,
  };
}
