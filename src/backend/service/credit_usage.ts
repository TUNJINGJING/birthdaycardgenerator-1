import { create, getByUserId, reducePeriodRemainCount, increasePeriodRemainCount, update } from "../models/credit_usage";
import { CreditUsage } from "../type/type";

export async function createCreditUsage(creditUsage: CreditUsage) {
  return await create(creditUsage);
}


export async function getCreditUsageByUserId(user_id: string) {
  return await getByUserId(user_id);
}

export async function reducePeriodRemainCountByUserId(user_id: string, credit: number) {
  return await reducePeriodRemainCount(user_id, credit);
}

export async function increasePeriodRemainCountByUserId(user_id: string, credit: number) {
  return await increasePeriodRemainCount(user_id, credit);
}

export async function updateCreditUsage(creditUsage: CreditUsage) {
  return await update(creditUsage);
}
