export function msTimeConverter({
  msTime,
  toUnit,
}: {
  msTime: number;
  toUnit: "s" | "m" | "h";
}) {
  switch (toUnit) {
    default:
      return msTime / 1000;
    case "m":
      return msTime / (1000 * 60);
    case "h":
      return msTime / (1000 * 60 * 60);
  }
}

export function secondsTimeConverter({
  secondsTime,
  toUnit,
}: {
  secondsTime: number;
  toUnit: "ms" | "m" | "h";
}) {
  switch (toUnit) {
    default:
      return secondsTime * 1000;
    case "m":
      return secondsTime / 60;
    case "h":
      return secondsTime / 3600;
  }
}
