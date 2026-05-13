import { DEFAULT_CATEGORY_ID } from 'data/catalog';
import type {
  CourseCategory,
  CourseCoverTheme,
  CourseItem,
  CourseKind,
  SortMode,
} from 'types/course';

const AID = '2608';
const UUID = '7618932798380197426';
const SPIDER = '0';
const BOOKLET_LIMIT = 20;
const INTERNAL_LIMIT = 20;

const CATEGORY_URL = `https://api.juejin.cn/booklet_api/v1/course/course_category_list?aid=${AID}&uuid=${UUID}&spider=${SPIDER}`;
const BOOKLET_URL = `https://api.juejin.cn/booklet_api/v1/booklet/listbycategory?aid=${AID}&uuid=${UUID}&spider=${SPIDER}`;
const INTERNAL_URL = 'https://api.juejin.cn/booklet_api/v1/bytecourse/list_by_category';

const ALL_CATEGORY: CourseCategory = {
  id: DEFAULT_CATEGORY_ID,
  label: '全部',
};

const COVER_THEMES: CourseCoverTheme[] = [
  { start: '#ff9a62', end: '#ffb36c', accent: '#ffe0d1', text: '#ffffff' },
  { start: '#2d7df7', end: '#6ab5ff', accent: '#d9ecff', text: '#ffffff' },
  { start: '#4c56c0', end: '#6f82f3', accent: '#dfe5ff', text: '#ffffff' },
  { start: '#15b98f', end: '#69d6b0', accent: '#d8fff0', text: '#ffffff' },
  { start: '#7656d6', end: '#af8dff', accent: '#efe5ff', text: '#ffffff' },
  { start: '#d96b54', end: '#f2a07e', accent: '#ffe7dd', text: '#ffffff' },
];

type UnknownRecord = Record<string, unknown>;

interface RawCategory {
  category_id?: string;
  category_name?: string;
  rank?: number;
}

interface CategoryResponse {
  data?: {
    booklet_categories?: RawCategory[];
    bytecourse_categories?: RawCategory[];
  };
}

interface BookletResponse {
  data?: unknown[];
}

interface InternalResponse {
  data?: unknown[];
}

export interface CourseCategoryMap {
  booklet: CourseCategory[];
  internal: CourseCategory[];
}

function getObject(value: unknown): UnknownRecord | undefined {
  if (value && typeof value === 'object') {
    return value as UnknownRecord;
  }

  return undefined;
}

function getValue(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    const record = getObject(current);
    if (!record || !(key in record)) {
      return undefined;
    }

    return record[key];
  }, source);
}

function toStringValue(value: unknown, fallback = ''): string {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function toDateString(value: unknown): string {
  const numeric = Number(value);

  if (Number.isFinite(numeric) && numeric > 0) {
    return new Date(numeric * 1000).toISOString();
  }

  return new Date(0).toISOString();
}

function toCurrency(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Number((numeric / 100).toFixed(2));
}

function formatDuration(durationMs: unknown): string {
  const numeric = Number(durationMs);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return '';
  }

  const totalMinutes = Math.round(numeric / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}小时${minutes}分钟`;
  }

  if (hours > 0) {
    return `${hours}小时`;
  }

  return `${minutes}分钟`;
}

function withTimeoutSignal(timeoutMs: number): { controller: AbortController; timeoutId: number } {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  return { controller, timeoutId };
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const { controller, timeoutId } = withTimeoutSignal(8000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function getJson<T>(url: string): Promise<T> {
  const { controller, timeoutId } = withTimeoutSignal(8000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function sortCategories(rawCategories: RawCategory[] | undefined): CourseCategory[] {
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  return [
    ALL_CATEGORY,
    ...categories
      .filter((item) => item.category_id && item.category_name)
      .sort((left, right) => toNumber(left.rank, 0) - toNumber(right.rank, 0))
      .map((item) => ({
        id: toStringValue(item.category_id),
        label: toStringValue(item.category_name),
      })),
  ];
}

function createTheme(seed: string): CourseCoverTheme {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 2147483647;
  }

  return COVER_THEMES[Math.abs(hash) % COVER_THEMES.length];
}

function buildAuthorTitle(jobTitle: string, company: string): string {
  if (jobTitle && company) {
    return `${jobTitle} @${company}`;
  }

  return jobTitle || company || '掘金作者';
}

function getBookletTag(item: unknown): string | undefined {
  if (getValue(item, 'is_new')) {
    return '新品';
  }

  if (getValue(item, 'base_info.can_vip_borrow')) {
    return 'VIP';
  }

  return undefined;
}

function mapBookletItem(item: unknown): CourseItem {
  const title = toStringValue(getValue(item, 'base_info.title'), '未命名课程');
  const basePrice = toCurrency(getValue(item, 'base_info.price'));
  const discountPrice = toCurrency(getValue(item, 'max_discount.pay_money'));
  const currentPrice = discountPrice > 0 && discountPrice < basePrice ? discountPrice : basePrice;
  const originalPrice = currentPrice < basePrice ? basePrice : undefined;
  const authorName = toStringValue(getValue(item, 'user_info.user_name'), '掘金作者');
  const authorLevel = toNumber(getValue(item, 'user_info.level'), 0);
  const company = toStringValue(getValue(item, 'user_info.company'));
  const jobTitle = toStringValue(getValue(item, 'user_info.job_title'));

  return {
    id: toStringValue(getValue(item, 'booklet_id'), title),
    courseKind: 'booklet',
    categoryId: toStringValue(getValue(item, 'base_info.category_id'), DEFAULT_CATEGORY_ID),
    title,
    subtitle: toStringValue(getValue(item, 'base_info.summary')),
    authorName,
    authorTitle: buildAuthorTitle(jobTitle, company),
    authorBadge: authorLevel > 0 ? `Lv.${authorLevel}` : undefined,
    avatarColor: '#1e80ff',
    avatarText: authorName.slice(0, 1),
    avatarUrl: toStringValue(getValue(item, 'user_info.avatar_large')),
    price: currentPrice,
    originalPrice,
    chapterCount: toNumber(getValue(item, 'base_info.section_count')),
    buyerCount: toNumber(getValue(item, 'base_info.buy_count')),
    progressText: getValue(item, 'base_info.is_finished') ? '已完结' : '已更新',
    isVip: !!getValue(item, 'base_info.can_vip_borrow'),
    tag: getBookletTag(item),
    coverTitle: title,
    coverTheme: createTheme(title),
    coverImage: toStringValue(getValue(item, 'base_info.cover_img')),
    publishedAt: toDateString(getValue(item, 'base_info.ctime')),
    updatedAt: toDateString(getValue(item, 'base_info.mtime')),
  };
}

function mapInternalItem(item: unknown): CourseItem {
  const title = toStringValue(getValue(item, 'content.name'), '未命名课程');
  const packageItems = getValue(item, 'content.extra.course_package.items');
  const chapterCount = Math.max(
    toNumber(getValue(item, 'content.extra.course_package.chapter_count')),
    Array.isArray(packageItems) ? packageItems.length : 0,
  );
  const durationText = formatDuration(getValue(item, 'content.extra.course_package.duration'));
  const buyerText = durationText
    ? `${chapterCount}个视频 · ${durationText}`
    : `${chapterCount}个视频`;

  return {
    id: toStringValue(getValue(item, 'content.item_id'), title),
    courseKind: 'internal',
    categoryId: toStringValue(getValue(item, 'categories.0.category_id'), DEFAULT_CATEGORY_ID),
    title,
    subtitle: toStringValue(getValue(item, 'content.abstract')),
    authorName: 'ByteTech',
    authorTitle: '',
    avatarColor: '#2d7df7',
    avatarText: 'B',
    price: 0,
    chapterCount,
    buyerText,
    durationText,
    progressText: '已上线',
    isVip: true,
    tag: 'VIP免费',
    coverTitle: title,
    coverTheme: createTheme(title),
    coverImage: toStringValue(getValue(item, 'content.cover_image.url')),
    publishedAt: toDateString(getValue(item, 'content.publish_time')),
    updatedAt: toDateString(getValue(item, 'content.publish_time')),
  };
}

function getBookletSortCode(sortMode: SortMode): number {
  switch (sortMode) {
    case 'all':
      return 10;
    case 'latest':
      return 10;
    case 'hot':
      return 7;
    case 'price-desc':
      return 9;
    case 'price-asc':
      return 8;
    default:
      return 10;
  }
}

export async function loadCategories(): Promise<CourseCategoryMap> {
  const json = await postJson<CategoryResponse>(CATEGORY_URL, { show_type: 2 });

  return {
    booklet: sortCategories(json.data?.booklet_categories),
    internal: sortCategories(json.data?.bytecourse_categories),
  };
}

async function loadBookletCourses(
  categoryId: string,
  sortMode: SortMode,
  vipOnly: boolean,
): Promise<CourseItem[]> {
  const requestBody: Record<string, string | number> = {
    category_id: categoryId,
    cursor: '0',
    sort: getBookletSortCode(sortMode),
    is_vip: vipOnly ? 1 : 0,
    limit: BOOKLET_LIMIT,
  };

  const json = await postJson<BookletResponse>(BOOKLET_URL, requestBody);

  if (!Array.isArray(json.data)) {
    return [];
  }

  return json.data.map((item) => mapBookletItem(item));
}

async function loadInternalCourses(categoryId: string): Promise<CourseItem[]> {
  const query = new URLSearchParams({
    category_id: categoryId,
    cursor: '0',
    page_size: String(INTERNAL_LIMIT),
    aid: AID,
    uuid: UUID,
    spider: SPIDER,
  });

  const json = await getJson<InternalResponse>(`${INTERNAL_URL}?${query.toString()}`);

  if (!Array.isArray(json.data)) {
    return [];
  }

  return json.data.map((item) => mapInternalItem(item));
}

export async function loadCourses(
  courseKind: CourseKind,
  categoryId: string,
  sortMode: SortMode,
  vipOnly: boolean,
): Promise<CourseItem[]> {
  void sortMode;
  void vipOnly;

  if (courseKind === 'booklet') {
    return loadBookletCourses(categoryId, sortMode, vipOnly);
  }

  return loadInternalCourses(categoryId);
}
