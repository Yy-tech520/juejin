import type { CourseCategory, CourseTab } from 'types/course';

export const DEFAULT_CATEGORY_ID = '0';

export const COURSE_TABS: CourseTab[] = [
  { id: 'booklet', label: '\u6398\u91d1\u5c0f\u518c' },
  { id: 'internal', label: '\u5b57\u8282\u5185\u90e8\u8bfe', badge: 'VIP\u514d\u8d39' },
];

export const DEFAULT_CATEGORIES: Record<'booklet' | 'internal', CourseCategory[]> = {
  booklet: [{ id: DEFAULT_CATEGORY_ID, label: '\u5168\u90e8' }],
  internal: [{ id: DEFAULT_CATEGORY_ID, label: '\u5168\u90e8' }],
};
