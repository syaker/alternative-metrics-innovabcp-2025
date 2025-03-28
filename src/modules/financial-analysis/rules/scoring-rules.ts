import { CreditEvaluationCategory } from '@prisma/client';
import { WEEK_IN_MILLISECONDS } from '../../../constants/numbers';

export const RE_COMPUTE_ELIGIBILITY_PERIOD_IN_MS = 1 * WEEK_IN_MILLISECONDS;

export const SCORE_BY_CATEGORY = {
  [CreditEvaluationCategory.BANK_TRANSACTIONS]: 0.2,
  [CreditEvaluationCategory.BILL_PAYMENT]: 0.2,
  [CreditEvaluationCategory.RESIDENCE_AGE]: 0.2,
  [CreditEvaluationCategory.SOCIAL_MEDIA]: 0.1,
  [CreditEvaluationCategory.STABILITY_EMPLOYMENT]: 0.3,
};

export const MONTHS_IN_YEAR = 12;

// Rules to evaluate
export const MIN_TRANSACTIONS_SINCE_LAST_EVALUATION = 1;
export const MIN_INCOME_TRANSACTION_AMOUNT = 10000;
export const MIN_MONTHLY_INCOME_AMOUNT = 10000;
export const MIN_EXPENSES_BY_PAYMENT_TYPE = {
  rent: 3,
  water: 3 * MONTHS_IN_YEAR,
  electricity: 3 * MONTHS_IN_YEAR,
  telephony: 3 * MONTHS_IN_YEAR,
  internet: 3 * MONTHS_IN_YEAR,
  college: 3 * MONTHS_IN_YEAR,
  certifications: 1,
  university: 1 * MONTHS_IN_YEAR,
  onlineShopping: 10 * 4 * MONTHS_IN_YEAR,
};

export const RECEIPT_WEIGHTS = {
  rent: 1.0,
  water: 0.9,
  electricity: 0.9,
  telephony: 0.8,
  internet: 0.8,
  college: 1.0,
  certifications: 0.7,
  university: 0.7,
  onlineShopping: 0.5,
};

// Period to re-collect data again
export const TRANSACTION_EVALUATION_PERIOD_MONTHS = 3;

// Risk
export const HIGH_RISK_THRESHOLD = 40;
export const MEDIUM_RISK_THRESHOLD = 60;

// Score by credit
export const MORTGAGE_MIN_SCORE_BY_CREDIT_TYPE_THRESHOLD = 90;
export const PERSONAL_MIN_SCORE_BY_CREDIT_TYPE_THRESHOLD = 70;
export const VEHICLE_MIN_SCORE_BY_CREDIT_TYPE_THRESHOLD = 60;
