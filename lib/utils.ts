export const formatPrice = (value: number): string => {
  const format = (num: number, suffix: "K" | "M") => {
    const truncated = Math.floor(num * 100) / 100;
    const isExact = truncated === num;

    return `${isExact ? "" : "~"}AED ${truncated
      .toString()
      .replace(/\.?0+$/, "")}${suffix}`;
  };

  if (value >= 1_000_000) {
    return format(value / 1_000_000, "M");
  }

  if (value >= 1_000) {
    return format(value / 1_000, "K");
  }

  return `AED ${value}`;
};