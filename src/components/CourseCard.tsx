import { useEffect, useState } from 'react';

import { formatBuyerCount, formatChapterMeta, formatPrice } from 'lib/format';
import type { CourseItem } from 'types/course';

import CoverThumb from './CoverThumb';

interface CourseCardProps {
  course: CourseItem;
}

function Tag({ course }: CourseCardProps) {
  if (!course.tag) {
    return null;
  }

  const isVipTag = course.tag.toUpperCase().includes('VIP');
  const className = isVipTag ? 'bg-[#f7e7c1] text-[#8a5d12]' : 'bg-[#f53f3f] text-white';

  return (
    <span className={`rounded-[4px] px-[8px] py-[3px] text-[14px] leading-[20px] ${className}`}>
      {course.tag}
    </span>
  );
}

function Avatar({ course }: CourseCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [course.avatarUrl]);

  if (course.avatarUrl && !imageFailed) {
    return (
      <img
        src={course.avatarUrl}
        alt={course.authorName}
        className="h-8 w-8 rounded-full object-cover"
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: course.avatarColor }}
    >
      {course.avatarText}
    </div>
  );
}

function ByteTechLogo() {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#d4d9e2] bg-white">
      <span className="absolute left-[7px] top-[6px] h-[16px] w-[7px] rounded-[8px] bg-[#23d0e2] [clip-path:polygon(100%_0,100%_100%,0_75%,0_25%)]" />
      <span className="absolute left-[15px] top-[4px] h-[20px] w-[7px] rounded-[8px] bg-[#3575ff] [clip-path:polygon(100%_0,100%_100%,0_78%,0_22%)]" />
    </div>
  );
}

function VideoMetaIcon() {
  return (
    <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-[6px] border border-[#aeb6c2]">
      <span className="absolute h-[10px] w-[8px] rounded-[2px] border border-[#6b7280]" />
      <span className="absolute right-[5px] top-[7px] h-0 w-0 border-b-[4px] border-l-[5px] border-t-[4px] border-b-transparent border-l-[#6b7280] border-t-transparent" />
    </span>
  );
}

function InternalCourseCard({ course }: CourseCardProps) {
  return (
    <article className="mb-11 flex gap-6 rounded-[8px] border border-[#e5e6eb] bg-white">
      <div className="h-[192px] w-[340px] flex-none overflow-hidden rounded-l-[8px] bg-[#f7f8fa]">
        <CoverThumb course={course} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center py-6 pr-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <Tag course={course} />
          <h3 className="text-[24px] font-medium leading-[34px] tracking-[-0.3px] text-[#1d2129]">
            {course.title}
          </h3>
        </div>

        <p className="mb-4 line-clamp-2 text-[16px] leading-[30px] text-[#4e5969]">
          {course.subtitle}
        </p>

        <div className="mb-[18px] flex items-center gap-3 text-[#344563]">
          <ByteTechLogo />
          <span className="text-[18px] leading-[28px]">{course.authorName}</span>
        </div>

        <div className="flex items-center gap-3 text-[16px] leading-[26px] text-[#4e5969]">
          <VideoMetaIcon />
          <span>{course.buyerText}</span>
        </div>
      </div>
    </article>
  );
}

function BookletCourseCard({ course }: CourseCardProps) {
  const buyerText = formatBuyerCount(course.buyerCount, course.buyerText);

  return (
    <article className="flex gap-5 py-6">
      <div className="h-[184px] w-[132px] flex-none overflow-hidden rounded-[2px] bg-[#f2f3f5]">
        <CoverThumb course={course} />
      </div>

      <div className="min-w-0 flex-1 pt-[2px]">
        <div className="mb-[8px] flex flex-wrap items-center gap-3">
          <Tag course={course} />
          <h3 className="text-[24px] font-medium leading-[34px] tracking-[-0.2px] text-[#1d2129]">
            {course.title}
          </h3>
        </div>

        <p className="mb-[14px] line-clamp-2 pr-6 text-[16px] leading-[30px] text-[#4e5969]">
          {course.subtitle}
        </p>

        <div className="mb-[16px] flex flex-wrap items-center gap-[6px] text-[#4e5969]">
          <Avatar course={course} />
          <span className="text-[16px] leading-[24px] text-[#344563]">{course.authorName}</span>
          {course.authorBadge ? (
            <span className="rounded-[10px] bg-[#eaf2ff] px-[6px] py-[1px] text-[12px] font-semibold leading-[16px] text-[#1e80ff]">
              {course.authorBadge}
            </span>
          ) : null}
          <span className="text-[16px] leading-[24px] text-[#4e5969]">{course.authorTitle}</span>
        </div>

        <div className="flex flex-wrap items-end gap-[14px] text-[#86909c]">
          <span className="text-[20px] font-medium leading-[28px] text-[#f53f3f]">
            {formatPrice(course.price)}
          </span>
          {course.originalPrice && course.originalPrice > course.price ? (
            <span className="text-[16px] leading-[24px] text-[#b0b7c3] line-through">
              {formatPrice(course.originalPrice)}
            </span>
          ) : null}
          <span className="text-[16px] leading-[24px]">
            {formatChapterMeta(course.progressText, course.chapterCount)}
          </span>
          {buyerText ? <span className="text-[16px] leading-[24px]">{buyerText}</span> : null}
        </div>
      </div>
    </article>
  );
}

export default function CourseCard({ course }: CourseCardProps) {
  if (course.courseKind === 'internal') {
    return <InternalCourseCard course={course} />;
  }

  return <BookletCourseCard course={course} />;
}
