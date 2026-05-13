import { useEffect, useState } from 'react';

import type { CourseItem } from 'types/course';

interface CoverThumbProps {
  course: CourseItem;
}

export default function CoverThumb({ course }: CoverThumbProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const isInternal = course.courseKind === 'internal';

  useEffect(() => {
    setImageFailed(false);
  }, [course.coverImage]);

  if (course.coverImage && !imageFailed) {
    return (
      <img
        src={course.coverImage}
        alt={course.title}
        className={`h-full w-full ${isInternal ? 'object-cover' : 'rounded-[2px] object-cover'}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-[2px] px-[10px] pb-[10px] pt-[8px]"
      style={{
        background: `linear-gradient(162deg, ${course.coverTheme.start}, ${course.coverTheme.end})`,
        color: course.coverTheme.text,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[72px] opacity-20"
        style={{
          background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45), transparent 52%)',
        }}
      />
      <div className="relative z-[1] text-[8px] font-semibold tracking-[0.08em] opacity-95">
        {isInternal ? 'ByteTech' : '\u6398\u91d1\u8bfe\u7a0b'}
      </div>
      <div className="relative z-[1] mt-[18px] whitespace-pre-line text-[9px] font-semibold leading-[15px]">
        {course.coverTitle}
      </div>
      {isInternal ? (
        <div className="relative z-[1] mt-auto h-[88px] overflow-hidden">
          <div className="absolute inset-y-0 right-[-20px] w-[120px] rounded-[999px] bg-white/20" />
          <div className="absolute inset-y-0 right-[38px] w-[86px] rounded-[999px] bg-white/28" />
          <div className="absolute inset-y-0 right-[88px] w-[64px] rounded-[999px] bg-white/18" />
        </div>
      ) : (
        <div
          className="relative z-[1] mt-auto flex h-[72px] items-end justify-center"
          style={{
            filter: 'drop-shadow(0 10px 12px rgba(30, 40, 90, 0.14))',
          }}
        >
          <div className="relative h-[56px] w-[74px]">
            <div
              className="absolute bottom-0 left-[7px] h-[16px] w-[60px] rounded-[999px] blur-[2px]"
              style={{ background: 'rgba(17, 24, 39, 0.14)' }}
            />
            <div
              className="absolute bottom-[6px] left-0 h-[36px] w-[54px] skew-x-[-22deg] rounded-[6px]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(227,235,255,0.82))',
              }}
            />
            <div
              className="absolute bottom-[8px] right-[2px] h-[38px] w-[42px] rounded-[8px]"
              style={{
                background: `linear-gradient(
                  180deg,
                  ${course.coverTheme.accent},
                  rgba(255,255,255,0.8)
                )`,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.42)',
              }}
            />
            <div
              className="absolute bottom-[18px] right-[11px] h-[18px] w-[18px] rounded-[4px]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(243,244,246,0.9))',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
