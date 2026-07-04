import type {
  OptionalProfileData,
  ProfileContext,
  ProfileTag,
} from '../types/instagram';

export interface ContextInsight {
  id: string;
  label: string;
  count: number;
  description: string;
}

export interface OptionalInsightsSummary {
  insights: ContextInsight[];
  hasContextForResults: boolean;
}

const TAG_LABELS: Record<ProfileTag, string> = {
  close_friend: 'Close Friend',
  restricted: 'Restrito',
  hide_story: 'Story oculto',
  pending_request: 'Pedido pendente',
  recent_request: 'Pedido recente',
};

export function getTagLabel(tag: ProfileTag): string {
  return TAG_LABELS[tag];
}

function buildUsernameSets(data: OptionalProfileData) {
  return {
    closeFriends: new Set(data.closeFriends.map((e) => e.username)),
    restricted: new Set(data.restricted.map((e) => e.username)),
    hideStoryFrom: new Set(data.hideStoryFrom.map((e) => e.username)),
    pendingRequests: new Set(data.pendingFollowRequests.map((e) => e.username)),
    recentRequests: new Set(data.recentFollowRequests.map((e) => e.username)),
  };
}

function buildDisplayNameMap(data: OptionalProfileData): Map<string, string> {
  const map = new Map<string, string>();
  const allEntries = [
    ...data.closeFriends,
    ...data.restricted,
    ...data.hideStoryFrom,
    ...data.pendingFollowRequests,
    ...data.recentFollowRequests,
    ...data.recentlyUnfollowed,
    ...data.blocked,
    ...data.removedSuggestions,
  ];
  for (const entry of allEntries) {
    if (entry.displayName && !map.has(entry.username)) {
      map.set(entry.username, entry.displayName);
    }
  }
  return map;
}

export function buildProfileContextIndex(
  data: OptionalProfileData,
): Map<string, ProfileContext> {
  const sets = buildUsernameSets(data);
  const displayNames = buildDisplayNameMap(data);
  const allUsernames = new Set<string>([
    ...sets.closeFriends,
    ...sets.restricted,
    ...sets.hideStoryFrom,
    ...sets.pendingRequests,
    ...sets.recentRequests,
  ]);

  const index = new Map<string, ProfileContext>();
  for (const username of allUsernames) {
    const tags: ProfileTag[] = [];
    if (sets.closeFriends.has(username)) tags.push('close_friend');
    if (sets.restricted.has(username)) tags.push('restricted');
    if (sets.hideStoryFrom.has(username)) tags.push('hide_story');
    if (sets.pendingRequests.has(username)) tags.push('pending_request');
    if (sets.recentRequests.has(username)) tags.push('recent_request');

    index.set(username, {
      displayName: displayNames.get(username) ?? null,
      tags,
    });
  }
  return index;
}

export function getProfileContext(
  username: string,
  index: Map<string, ProfileContext>,
): ProfileContext | null {
  return index.get(username) ?? null;
}

export function profileHasTag(
  username: string,
  tag: ProfileTag,
  index: Map<string, ProfileContext>,
): boolean {
  return index.get(username)?.tags.includes(tag) ?? false;
}

export function countProfilesWithTag(
  usernames: string[],
  tag: ProfileTag,
  index: Map<string, ProfileContext>,
): number {
  return usernames.filter((u) => profileHasTag(u, tag, index)).length;
}

export function buildOptionalInsights(
  data: OptionalProfileData,
  notFollowingBackUsernames: string[],
): OptionalInsightsSummary {
  const index = buildProfileContextIndex(data);
  const insights: ContextInsight[] = [];

  const tagInsights: { tag: ProfileTag; id: string; description: string }[] = [
    {
      tag: 'close_friend',
      id: 'close_friends',
      description: 'na lista não seguem de volta, mas estão nos seus Close Friends',
    },
    {
      tag: 'restricted',
      id: 'restricted',
      description: 'na lista estão marcados como restritos',
    },
    {
      tag: 'hide_story',
      id: 'hide_story',
      description: 'na lista você oculta seu story deles',
    },
    {
      tag: 'pending_request',
      id: 'pending',
      description: 'na lista têm pedido de follow pendente',
    },
  ];

  for (const { tag, id, description } of tagInsights) {
    const count = countProfilesWithTag(notFollowingBackUsernames, tag, index);
    if (count > 0) {
      insights.push({
        id,
        label: getTagLabel(tag),
        count,
        description,
      });
    }
  }

  const standalone: { key: keyof OptionalProfileData; label: string; desc: string }[] = [
    { key: 'pendingFollowRequests', label: 'Pedidos pendentes', desc: 'aguardando aprovação' },
    { key: 'recentFollowRequests', label: 'Pedidos recentes', desc: 'enviados recentemente' },
    { key: 'recentlyUnfollowed', label: 'Deixou de seguir', desc: 'perfis que você deixou de seguir' },
    { key: 'blocked', label: 'Bloqueados', desc: 'perfis bloqueados' },
    { key: 'removedSuggestions', label: 'Sugestões removidas', desc: 'sugestões que você dispensou' },
    { key: 'followingHashtags', label: 'Hashtags seguidas', desc: 'hashtags que você segue' },
  ];

  for (const { key, label, desc } of standalone) {
    const entries = data[key];
    if (Array.isArray(entries) && entries.length > 0 && key !== 'loadedKinds') {
      insights.push({
        id: key,
        label,
        count: entries.length,
        description: desc,
      });
    }
  }

  const hasContextForResults = tagInsights.some(({ tag }) =>
    countProfilesWithTag(notFollowingBackUsernames, tag, index) > 0,
  );

  return { insights, hasContextForResults };
}

export type ContextFilter = 'all' | ProfileTag;

export const CONTEXT_FILTER_OPTIONS: { value: ContextFilter; label: string }[] = [
  { value: 'all', label: 'Todos os perfis' },
  { value: 'close_friend', label: 'Close Friends' },
  { value: 'restricted', label: 'Restritos' },
  { value: 'hide_story', label: 'Story oculto' },
  { value: 'pending_request', label: 'Pedido pendente' },
  { value: 'recent_request', label: 'Pedido recente' },
];

export function profileMatchesContextFilter(
  username: string,
  filter: ContextFilter,
  index: Map<string, ProfileContext>,
): boolean {
  if (filter === 'all') return true;
  return profileHasTag(username, filter, index);
}
