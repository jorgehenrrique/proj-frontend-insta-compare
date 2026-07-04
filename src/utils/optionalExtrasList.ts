import type { OptionalProfileData, OptionalProfileEntry } from '../types/instagram';
import { OPTIONAL_FILE_LABELS } from './parseOptionalProfiles';

export type ExtraListCategory = Exclude<keyof OptionalProfileData, 'loadedKinds'>;

export interface ExtraListItem {
  id: string;
  category: ExtraListCategory;
  categoryLabel: string;
  username: string;
  displayName: string | null;
  profileUrl: string;
  timestamp: number | null;
}

const CATEGORY_ORDER: ExtraListCategory[] = [
  'closeFriends',
  'restricted',
  'hideStoryFrom',
  'pendingFollowRequests',
  'recentFollowRequests',
  'recentlyUnfollowed',
  'blocked',
  'removedSuggestions',
  'followingHashtags',
];

const CATEGORY_TO_KIND: Record<ExtraListCategory, keyof typeof OPTIONAL_FILE_LABELS> = {
  closeFriends: 'close_friends',
  restricted: 'restricted',
  hideStoryFrom: 'hide_story_from',
  pendingFollowRequests: 'pending_follow_requests',
  recentFollowRequests: 'recent_follow_requests',
  recentlyUnfollowed: 'recently_unfollowed',
  blocked: 'blocked',
  removedSuggestions: 'removed_suggestions',
  followingHashtags: 'following_hashtags',
};

export const EXTRA_DATE_LABELS: Partial<Record<ExtraListCategory, string>> = {
  pendingFollowRequests: 'Pedido em',
  recentFollowRequests: 'Pedido em',
  recentlyUnfollowed: 'Deixou de seguir em',
  followingHashtags: 'Seguindo desde',
  blocked: 'Bloqueado em',
  restricted: 'Restrito em',
  closeFriends: 'Adicionado em',
  hideStoryFrom: 'Oculto em',
  removedSuggestions: 'Removido em',
};

function entryToListItem(
  category: ExtraListCategory,
  entry: OptionalProfileEntry,
): ExtraListItem {
  return {
    id: `${category}:${entry.username}`,
    category,
    categoryLabel: OPTIONAL_FILE_LABELS[CATEGORY_TO_KIND[category]],
    username: entry.username,
    displayName: entry.displayName,
    profileUrl: entry.profileUrl,
    timestamp: entry.timestamp,
  };
}

export function flattenOptionalExtras(data: OptionalProfileData): ExtraListItem[] {
  const items: ExtraListItem[] = [];

  for (const category of CATEGORY_ORDER) {
    const entries = data[category];
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      items.push(entryToListItem(category, entry));
    }
  }

  return items;
}

export function getExtraCategoryFilterOptions(items: ExtraListItem[]) {
  const categories = new Set(items.map((i) => i.category));
  return CATEGORY_ORDER.filter((c) => categories.has(c)).map((category) => ({
    value: category,
    label: OPTIONAL_FILE_LABELS[CATEGORY_TO_KIND[category]],
  }));
}
