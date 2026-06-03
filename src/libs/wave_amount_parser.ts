export function waveAmountParser(rawAmount: any) {
  if (typeof rawAmount !== "string") {
    return rawAmount;
  }

  const amount = rawAmount.replace("CFA", "").trim();

  return parseFloat(amount);
}
