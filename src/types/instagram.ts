export interface InstagramStringListEntry {
  href: string;
  value?: string;
  timestamp: number;
}

export interface InstagramConnectionEntry {
  title?: string;
  string_list_data: InstagramStringListEntry[];
}

export type FollowersFile = InstagramConnectionEntry[];

export interface FollowingFile {
  relationships_following: InstagramConnectionEntry[];
}

export interface InstagramProfile {
  username: string;
  profileUrl: string;
  followedAt: number | null;
}

export type ProfileSource = 'followers' | 'following';

/** Formato alternativo do export (blocked, close_friends, etc.) */
export interface InstagramLabelValue {
  label: string;
  value: string;
}

export interface InstagramActivityEntry {
  timestamp: number;
  label_values: InstagramLabelValue[];
}

export type OptionalFileKind =
  | 'blocked'
  | 'restricted'
  | 'close_friends'
  | 'hide_story_from'
  | 'pending_follow_requests'
  | 'recent_follow_requests'
  | 'recently_unfollowed'
  | 'removed_suggestions'
  | 'following_hashtags';

export interface OptionalProfileEntry {
  username: string;
  displayName: string | null;
  profileUrl: string;
  timestamp: number | null;
}

export interface OptionalProfileData {
  blocked: OptionalProfileEntry[];
  restricted: OptionalProfileEntry[];
  closeFriends: OptionalProfileEntry[];
  hideStoryFrom: OptionalProfileEntry[];
  pendingFollowRequests: OptionalProfileEntry[];
  recentFollowRequests: OptionalProfileEntry[];
  recentlyUnfollowed: OptionalProfileEntry[];
  removedSuggestions: OptionalProfileEntry[];
  followingHashtags: OptionalProfileEntry[];
  loadedKinds: OptionalFileKind[];
}

export type ProfileTag =
  | 'close_friend'
  | 'restricted'
  | 'hide_story'
  | 'pending_request'
  | 'recent_request';

export interface ProfileContext {
  displayName: string | null;
  tags: ProfileTag[];
}

export const EMPTY_OPTIONAL_DATA: OptionalProfileData = {
  blocked: [],
  restricted: [],
  closeFriends: [],
  hideStoryFrom: [],
  pendingFollowRequests: [],
  recentFollowRequests: [],
  recentlyUnfollowed: [],
  removedSuggestions: [],
  followingHashtags: [],
  loadedKinds: [],
};
