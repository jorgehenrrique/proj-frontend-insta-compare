import type { ProfileTag } from '../types/instagram';
import { getTagLabel } from '../utils/profileContext';

const TAG_STYLES: Record<ProfileTag, string> = {
  close_friend: 'border-brand-mid/40 bg-brand-mid/10 text-brand-mid',
  restricted: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  hide_story: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400',
  pending_request: 'border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-400',
  recent_request: 'border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-400',
};

interface ProfileBadgesProps {
  tags: ProfileTag[];
}

export function ProfileBadges({ tags }: ProfileBadgesProps) {
  if (tags.length === 0) return null;

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium leading-tight ${TAG_STYLES[tag]}`}
        >
          {getTagLabel(tag)}
        </span>
      ))}
    </div>
  );
}
