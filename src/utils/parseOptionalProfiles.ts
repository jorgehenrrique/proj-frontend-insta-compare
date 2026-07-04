import type {
  InstagramActivityEntry,
  InstagramLabelValue,
  OptionalFileKind,
  OptionalProfileData,
  OptionalProfileEntry,
} from '../types/instagram';
import { EMPTY_OPTIONAL_DATA } from '../types/instagram';

export type { OptionalFileKind };

const OPTIONAL_FILE_PATTERNS: { pattern: RegExp; kind: OptionalFileKind }[] = [
  { pattern: /^blocked_profiles\.json$/i, kind: 'blocked' },
  { pattern: /^restricted_profiles\.json$/i, kind: 'restricted' },
  { pattern: /^close_friends\.json$/i, kind: 'close_friends' },
  { pattern: /^hide_story_from\.json$/i, kind: 'hide_story_from' },
  { pattern: /^pending_follow_requests\.json$/i, kind: 'pending_follow_requests' },
  { pattern: /^recent_follow_requests\.json$/i, kind: 'recent_follow_requests' },
  { pattern: /^recently_unfollowed_profiles\.json$/i, kind: 'recently_unfollowed' },
  { pattern: /^removed_suggestions\.json$/i, kind: 'removed_suggestions' },
  { pattern: /^following_hashtags\.json$/i, kind: 'following_hashtags' },
];

export const OPTIONAL_FILE_LABELS: Record<OptionalFileKind, string> = {
  blocked: 'Bloqueados',
  restricted: 'Restritos',
  close_friends: 'Close Friends',
  hide_story_from: 'Story oculto',
  pending_follow_requests: 'Pedidos pendentes',
  recent_follow_requests: 'Pedidos recentes',
  recently_unfollowed: 'Deixou de seguir',
  removed_suggestions: 'Sugestões removidas',
  following_hashtags: 'Hashtags seguidas',
};

function isUsernameLabel(label: string): boolean {
  const normalized = label.toLowerCase();
  return normalized.includes('usu') && normalized.includes('rio');
}

function extractFromLabelValues(labelValues: InstagramLabelValue[]): {
  username: string | null;
  displayName: string | null;
  profileUrl: string | null;
} {
  let username: string | null = null;
  let displayName: string | null = null;
  let profileUrl: string | null = null;

  for (const { label, value } of labelValues) {
    const trimmed = value?.trim();
    if (!trimmed) continue;

    if (label === 'URL' && trimmed.startsWith('http')) {
      profileUrl = trimmed;
    } else if (isUsernameLabel(label)) {
      username = trimmed.toLowerCase();
    } else if (label === 'Nome') {
      displayName = trimmed;
    }
  }

  return { username, displayName, profileUrl };
}

function activityEntryToProfile(entry: InstagramActivityEntry): OptionalProfileEntry | null {
  const { username, displayName, profileUrl } = extractFromLabelValues(entry.label_values);
  if (!username) return null;

  return {
    username,
    displayName,
    profileUrl: profileUrl ?? `https://www.instagram.com/${username}`,
    timestamp: entry.timestamp ?? null,
  };
}

function isActivityEntry(value: unknown): value is InstagramActivityEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as InstagramActivityEntry).label_values)
  );
}

function parseActivityArray(json: unknown): OptionalProfileEntry[] {
  if (!Array.isArray(json)) return [];
  return json.filter(isActivityEntry).map(activityEntryToProfile).filter((p): p is OptionalProfileEntry => p !== null);
}

function parseFollowingHashtags(json: unknown): OptionalProfileEntry[] {
  if (typeof json !== 'object' || json === null) return [];
  const hashtags = (json as { relationships_following_hashtags?: unknown[] })
    .relationships_following_hashtags;
  if (!Array.isArray(hashtags)) return [];

  const results: OptionalProfileEntry[] = [];
  for (const entry of hashtags) {
    if (typeof entry !== 'object' || entry === null) continue;
    const listEntry = (entry as { string_list_data?: { href?: string; value?: string; timestamp?: number }[] })
      .string_list_data?.[0];
    if (!listEntry) continue;
    const tag = listEntry.value?.trim();
    if (!tag) continue;
    results.push({
      username: tag.toLowerCase(),
      displayName: `#${tag}`,
      profileUrl: listEntry.href ?? `https://www.instagram.com/explore/tags/${tag}`,
      timestamp: listEntry.timestamp ?? null,
    });
  }
  return results;
}

export function detectOptionalFileKind(fileName: string): OptionalFileKind | null {
  for (const { pattern, kind } of OPTIONAL_FILE_PATTERNS) {
    if (pattern.test(fileName)) return kind;
  }
  return null;
}

function entriesForKind(kind: OptionalFileKind, json: unknown): OptionalProfileEntry[] {
  if (kind === 'following_hashtags') return parseFollowingHashtags(json);
  return parseActivityArray(json);
}

export function parseOptionalInstagramFile(
  fileName: string,
  json: unknown,
): { kind: OptionalFileKind; entries: OptionalProfileEntry[] } | null {
  const kind = detectOptionalFileKind(fileName);
  if (!kind) return null;
  return { kind, entries: entriesForKind(kind, json) };
}

export function mergeOptionalData(
  current: OptionalProfileData,
  kind: OptionalFileKind,
  entries: OptionalProfileEntry[],
): OptionalProfileData {
  const key = kindToDataKey(kind);
  const existing = current[key];
  const byUsername = new Map(existing.map((e) => [e.username, e]));
  for (const entry of entries) {
    if (!byUsername.has(entry.username)) {
      byUsername.set(entry.username, entry);
    }
  }
  const loadedKinds = current.loadedKinds.includes(kind)
    ? current.loadedKinds
    : [...current.loadedKinds, kind];

  return {
    ...current,
    [key]: [...byUsername.values()],
    loadedKinds,
  };
}

type OptionalDataKey = Exclude<keyof OptionalProfileData, 'loadedKinds'>;

function kindToDataKey(kind: OptionalFileKind): OptionalDataKey {
  const map: Record<OptionalFileKind, OptionalDataKey> = {
    blocked: 'blocked',
    restricted: 'restricted',
    close_friends: 'closeFriends',
    hide_story_from: 'hideStoryFrom',
    pending_follow_requests: 'pendingFollowRequests',
    recent_follow_requests: 'recentFollowRequests',
    recently_unfollowed: 'recentlyUnfollowed',
    removed_suggestions: 'removedSuggestions',
    following_hashtags: 'followingHashtags',
  };
  return map[kind];
}

export function createEmptyOptionalData(): OptionalProfileData {
  return { ...EMPTY_OPTIONAL_DATA, loadedKinds: [] };
}

export function hasOptionalData(data: OptionalProfileData): boolean {
  return data.loadedKinds.length > 0;
}
