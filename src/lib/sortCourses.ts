import type { CourseItem, SortMode } from 'types/course';

export function sortCourses(courses: CourseItem[], sortMode: SortMode): CourseItem[] {
  const nextCourses = [...courses];

  switch (sortMode) {
    case 'latest':
      return nextCourses.sort(
        (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
      );
    case 'hot':
      return nextCourses.sort((left, right) => (right.buyerCount ?? 0) - (left.buyerCount ?? 0));
    case 'price-desc':
      return nextCourses.sort((left, right) => right.price - left.price);
    case 'price-asc':
      return nextCourses.sort((left, right) => left.price - right.price);
    default:
      return nextCourses;
  }
}
