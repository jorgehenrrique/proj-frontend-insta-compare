import type { InstagramProfile } from '../types/instagram';

export interface ComparisonResult {
  notFollowingBack: InstagramProfile[];
  notFollowedByMe: InstagramProfile[];
  mutuals: InstagramProfile[];
}

export function compareFollowersAndFollowing(
  followers: InstagramProfile[],
  following: InstagramProfile[],
): ComparisonResult {
  const followerUsernames = new Set(followers.map((p) => p.username));
  const followingUsernames = new Set(following.map((p) => p.username));

  const notFollowingBack = following.filter((p) => !followerUsernames.has(p.username));
  const notFollowedByMe = followers.filter((p) => !followingUsernames.has(p.username));
  const mutuals = following.filter((p) => followerUsernames.has(p.username));

  return { notFollowingBack, notFollowedByMe, mutuals };
}
