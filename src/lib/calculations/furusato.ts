/**
 * ふるさと納税の控除上限額（自己負担2,000円で寄付できる上限）を計算する。
 * ※地方税法第37条の2（寄附金税額控除）に基づく。
 */
import type { FurusatoInput, FurusatoResult } from "@/types/tax";
import {
  RECONSTRUCTION_TAX_RATE,
  RESIDENT_TAX_ADJUSTMENT,
  RESIDENT_TAX_RATE,
  FURUSATO_SELF_PAYMENT,
} from "./constants";
import {
  calcEmploymentIncome,
  calcIncomeTaxDeductions,
  calcResidentTaxDeductions,
  getMarginalIncomeTaxRate,
  resolveSocialInsurance,
} from "./income";

/**
 * ふるさと納税の控除上限額を求める。
 *
 * 計算の考え方:
 *  住民税の特例分（住民税所得割の20%が上限）をフルに使い切る寄付額を逆算する。
 *  上限額 = 住民税所得割 × 20% ÷ (90% − 所得税率 × 1.021) + 2,000円
 *  ※分母の90%は「住民税基本分10%を引いた残り」を表す。
 */
export function calcFurusatoLimit(input: FurusatoInput): FurusatoResult {
  const employmentIncome = calcEmploymentIncome(input.annualIncome);
  const socialInsurance = resolveSocialInsurance(
    input.annualIncome,
    input.socialInsurance,
  );

  const family = {
    hasSpouse: input.hasSpouse,
    generalDependents: input.generalDependents,
    specificDependents: input.specificDependents,
  };

  // 所得税ベースの課税所得（所得税率の判定に使う）
  const incomeTaxDeductions = calcIncomeTaxDeductions(
    socialInsurance,
    family,
    input.otherDeductions,
  );
  const taxableIncomeForIncomeTax = Math.max(
    0,
    employmentIncome - incomeTaxDeductions,
  );

  // 住民税ベースの課税所得（住民税所得割の計算に使う）
  const residentTaxDeductions = calcResidentTaxDeductions(
    socialInsurance,
    family,
    input.otherDeductions,
  );
  const taxableIncomeForResidentTax = Math.max(
    0,
    employmentIncome - residentTaxDeductions,
  );

  // 住民税所得割 = 課税所得 × 10% − 調整控除
  const residentTaxIncomeLevy = Math.max(
    0,
    taxableIncomeForResidentTax * RESIDENT_TAX_RATE - RESIDENT_TAX_ADJUSTMENT,
  );

  const marginalIncomeTaxRate = getMarginalIncomeTaxRate(
    taxableIncomeForIncomeTax,
  );

  // 課税所得がない（=住民税所得割が0）場合は、自己負担なしで寄付できる枠もない
  if (residentTaxIncomeLevy <= 0) {
    return {
      donationLimit: 0,
      taxableIncomeForIncomeTax,
      residentTaxIncomeLevy: 0,
      marginalIncomeTaxRate,
    };
  }

  // 特例分上限の逆算式
  const denominator = 0.9 - marginalIncomeTaxRate * RECONSTRUCTION_TAX_RATE;
  const donationLimit =
    (residentTaxIncomeLevy * 0.2) / denominator + FURUSATO_SELF_PAYMENT;

  // 端数を整理して100円単位の目安に丸める（実用上の目安として）
  const rounded = Math.floor(donationLimit / 100) * 100;

  return {
    donationLimit: rounded,
    taxableIncomeForIncomeTax,
    residentTaxIncomeLevy,
    marginalIncomeTaxRate,
  };
}
