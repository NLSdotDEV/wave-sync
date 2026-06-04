export class WaveParser {
  parseDate(dateString: string) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }

  parseAmount(rawAmount: any) {
    if (typeof rawAmount !== "string") {
      return rawAmount;
    }

    const amount = rawAmount.replace("CFA", "").trim();

    return parseFloat(amount);
  }
}
