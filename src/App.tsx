import { useEffect, useMemo, useState } from 'react';

import CourseCard from 'components/CourseCard';
import { COURSE_TABS, DEFAULT_CATEGORIES, DEFAULT_CATEGORY_ID } from 'data/catalog';
import { loadCategories, loadCourses } from 'lib/courseService';
import type { CourseCategory, CourseItem, CourseKind, SortMode } from 'types/course';

const sortTabs: Array<{ id: 'all' | 'latest' | 'hot' | 'price'; label: string }> = [
  { id: 'all', label: '\u5168\u90e8' },
  { id: 'latest', label: '\u6700\u65b0' },
  { id: 'hot', label: '\u70ed\u9500' },
  { id: 'price', label: '\u4ef7\u683c' },
];

const NETWORK_ERROR_MESSAGE =
  '\u771f\u5b9e\u63a5\u53e3\u8bf7\u6c42\u5931\u8d25\u3002\u8bf7\u786e\u8ba4 Whistle \u5df2\u542f\u52a8\u3001\u89c4\u5219\u5df2\u914d\u7f6e\uff0c\u6d4f\u89c8\u5668\u5df2\u4ee3\u7406\u5230 8899 \u7aef\u53e3\u3002';

function PriceSortIcon({ sortMode, active }: { sortMode: SortMode; active: boolean }) {
  const upActive = active && sortMode === 'price-asc';
  const downActive = active && sortMode === 'price-desc';

  return (
    <span className="ml-[4px] inline-flex flex-col justify-center gap-[1px] align-middle">
      <i
        className={`block h-0 w-0 border-x-[3px] border-b-[4px] border-x-transparent ${
          upActive ? 'border-b-[#1e80ff]' : 'border-b-[#c9cdd4]'
        }`}
      />
      <i
        className={`block h-0 w-0 border-x-[3px] border-t-[4px] border-x-transparent ${
          downActive ? 'border-t-[#1e80ff]' : 'border-t-[#c9cdd4]'
        }`}
      />
    </span>
  );
}

export default function App() {
  const [courseKind, setCourseKind] = useState<CourseKind>('booklet');
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORY_ID);
  const [sortMode, setSortMode] = useState<SortMode>('all');
  const [vipOnly, setVipOnly] = useState(false);
  const [categories, setCategories] =
    useState<Record<CourseKind, CourseCategory[]>>(DEFAULT_CATEGORIES);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function syncCategories() {
      setIsBootstrapping(true);

      try {
        const nextCategories = await loadCategories();

        if (!cancelled) {
          setCategories(nextCategories);
          setErrorMessage('');
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setErrorMessage(NETWORK_ERROR_MESSAGE);
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    syncCategories().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const currentCategories = categories[courseKind] ?? DEFAULT_CATEGORIES[courseKind];

  useEffect(() => {
    if (!currentCategories.some((category) => category.id === categoryId)) {
      setCategoryId(DEFAULT_CATEGORY_ID);
    }
  }, [categoryId, currentCategories]);

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }

    let cancelled = false;

    async function syncCourses() {
      setIsLoading(true);

      try {
        const nextCourses = await loadCourses(courseKind, categoryId, sortMode, vipOnly);

        if (!cancelled) {
          setCourses(nextCourses);
          setErrorMessage('');
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setCourses([]);
          setErrorMessage(NETWORK_ERROR_MESSAGE);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    syncCourses().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [categoryId, courseKind, isBootstrapping, sortMode, vipOnly]);

  const visibleCourses = useMemo(() => {
    if (courseKind === 'booklet') {
      return courses;
    }

    return courses;
  }, [courseKind, courses]);

  return (
    <main className="min-h-screen bg-[#f4f5f5] px-4 py-8 text-[#1d2129]">
      <section className="mx-auto max-w-[1220px] border border-[#e8ebf0] bg-white px-8 pb-8 pt-7 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-start gap-3">
            <span className="mt-[9px] w-[56px] flex-none text-[16px] leading-[22px] text-[#515767]">
              {'\u8bfe\u7a0b:'}
            </span>
            <div className="flex flex-wrap gap-3">
              {COURSE_TABS.map((tab) => {
                const active = tab.id === courseKind;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setCourseKind(tab.id);
                      setCategoryId(DEFAULT_CATEGORY_ID);
                      if (tab.id === 'booklet') {
                        setSortMode('all');
                        setVipOnly(false);
                      }
                    }}
                    className={`flex h-[40px] items-center rounded-[10px] border px-[16px] text-[16px] leading-[22px] transition ${
                      active
                        ? 'border-[#f2f3f5] bg-[#f2f3f5] text-[#1d2129]'
                        : 'border-[#e5e6eb] bg-white text-[#4e5969] hover:border-[#d0d5dd] hover:text-[#1d2129]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.badge ? (
                      <span className="ml-[6px] rounded-[999px] bg-[#f7e7c1] px-[6px] py-[1px] text-[12px] leading-[16px] text-[#8a5d12]">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-3">
            <span className="mt-[9px] w-[56px] flex-none text-[16px] leading-[22px] text-[#515767]">
              {'\u5206\u7c7b:'}
            </span>
            <div className="flex flex-wrap gap-3">
              {currentCategories.map((category) => {
                const active = category.id === categoryId;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCategoryId(category.id)}
                    className={`h-[40px] rounded-[10px] border px-[14px] text-[16px] leading-[22px] transition ${
                      active
                        ? 'border-[#f2f3f5] bg-[#f2f3f5] text-[#1d2129]'
                        : 'border-[#e5e6eb] bg-white text-[#4e5969] hover:border-[#d0d5dd] hover:text-[#1d2129]'
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-4 mt-5 h-px bg-[#e9edf2]" />

        {courseKind === 'booklet' ? (
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-8 text-[16px] leading-[22px]">
              {sortTabs.map((tab) => {
                const active =
                  tab.id === 'price'
                    ? sortMode === 'price-desc' || sortMode === 'price-asc'
                    : sortMode === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      if (tab.id === 'price') {
                        setSortMode((current) => {
                          if (current === 'price-desc') {
                            return 'price-asc';
                          }

                          if (current === 'price-asc') {
                            return 'price-desc';
                          }

                          return 'price-desc';
                        });

                        return;
                      }

                      setSortMode(tab.id);
                    }}
                    className={`flex items-center transition ${
                      active ? 'text-[#1e80ff]' : 'text-[#1d2129] hover:text-[#1e80ff]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.id === 'price' ? (
                      <PriceSortIcon sortMode={sortMode} active={active} />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <label className="flex cursor-pointer items-center gap-[10px] text-[16px] leading-[22px] text-[#4e5969]">
              <input
                type="checkbox"
                checked={vipOnly}
                onChange={(event) => setVipOnly(event.target.checked)}
                className="juejin-checkbox h-[18px] w-[18px] rounded-[2px] border border-[#c9cdd4]"
              />
              {'\u53ea\u770bVIP\u8bfe\u7a0b'}
            </label>
          </div>
        ) : (
          <div className="mb-5" />
        )}

        {errorMessage ? (
          <div className="mb-6 border border-[#ffd8bf] bg-[#fff7e8] px-4 py-3 text-[14px] leading-[22px] text-[#ad6800]">
            {errorMessage}
          </div>
        ) : null}

        <div className={courseKind === 'booklet' ? 'divide-y divide-[#f2f3f5]' : ''}>
          {isBootstrapping || isLoading ? (
            <div className="border border-dashed border-[#d6ddeb] bg-[#fbfdff] p-8 text-center text-[#86909c]">
              {'\u6b63\u5728\u540c\u6b65\u6398\u91d1\u771f\u5b9e\u8bfe\u7a0b\u6570\u636e...'}
            </div>
          ) : null}

          {!isBootstrapping && !isLoading && visibleCourses.length === 0 ? (
            <div className="border border-dashed border-[#d6ddeb] bg-[#fbfdff] p-8 text-center text-[#86909c]">
              {
                '\u5f53\u524d\u7b5b\u9009\u6761\u4ef6\u4e0b\u6ca1\u6709\u8bfe\u7a0b\uff0c\u6362\u4e2a\u5206\u7c7b\u6216\u5173\u95ed VIP \u8fc7\u6ee4\u518d\u8bd5\u8bd5\u3002'
              }
            </div>
          ) : null}

          {!isBootstrapping && !isLoading
            ? visibleCourses.map((course) => <CourseCard key={course.id} course={course} />)
            : null}
        </div>
      </section>
    </main>
  );
}
