export function formatPrice(value: number): string {
  if (value === 0) {
    return '\u514d\u8d39';
  }

  const decimals = Number.isInteger(value)
    ? 0
    : Math.min(value.toString().split('.')[1]?.length ?? 0, 2);

  return `\u00a5${value.toFixed(decimals)}`;
}

export function formatBuyerCount(value?: number, fallbackText?: string): string {
  if (fallbackText) {
    return fallbackText;
  }

  if (typeof value !== 'number') {
    return '';
  }

  return `${value.toLocaleString('zh-CN')}\u4eba\u5df2\u8d2d\u4e70`;
}

export function formatChapterMeta(progressText: string, chapterCount: number): string {
  return `${progressText} ${chapterCount} \u5c0f\u8282`;
}
