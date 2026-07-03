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
