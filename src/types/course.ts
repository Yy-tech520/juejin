export type CourseKind = 'booklet' | 'internal';

export type SortMode = 'all' | 'latest' | 'hot' | 'price-desc' | 'price-asc';

export interface CourseTab {
  id: CourseKind;
  label: string;
  badge?: string;
}

export interface CourseCategory {
  id: string;
  label: string;
}

export interface CourseCoverTheme {
  start: string;
  end: string;
  accent: string;
  text: string;
}

export interface CourseItem {
  id: string;
  courseKind: CourseKind;
  categoryId: string;
  title: string;
  subtitle: string;
  authorName: string;
  authorTitle: string;
  authorBadge?: string;
  avatarColor: string;
  avatarText: string;
  avatarUrl?: string;
  price: number;
  originalPrice?: number;
  chapterCount: number;
  buyerCount?: number;
  buyerText?: string;
  durationText?: string;
  progressText: string;
  isVip: boolean;
  tag?: string;
  coverTitle: string;
  coverTheme: CourseCoverTheme;
  coverImage?: string;
  publishedAt: string;
  updatedAt: string;
}
