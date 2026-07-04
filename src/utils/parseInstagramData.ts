import type {
  FollowersFile,
  FollowingFile,
  InstagramConnectionEntry,
  InstagramProfile,
} from '../types/instagram';

export type ParsedFileKind = 'followers' | 'following';

export class InstagramParseError extends Error {
  readonly fileName: string;

  constructor(message: string, fileName: string) {
    super(message);
    this.name = 'InstagramParseError';
    this.fileName = fileName;
  }
}

function usernameFromHref(href: string | undefined): string | null {
  if (!href) return null;
  const match = href.match(/instagram\.com\/(?:_u\/)?([^/?#]+)/i);
  return match ? match[1] : null;
}

function entryToProfile(entry: InstagramConnectionEntry): InstagramProfile | null {
  const listEntry = entry.string_list_data?.[0];
  const username =
    listEntry?.value?.trim() || entry.title?.trim() || usernameFromHref(listEntry?.href);

  if (!username) return null;

  return {
    username: username.toLowerCase(),
    profileUrl: listEntry?.href ?? `https://www.instagram.com/${username}`,
    followedAt: listEntry?.timestamp ?? null,
  };
}

function isConnectionEntry(value: unknown): value is InstagramConnectionEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as InstagramConnectionEntry).string_list_data)
  );
}

/**
 * Detects whether a parsed JSON payload matches the Instagram "followers_N.json"
 * (bare array) or "following.json" (object with relationships_following) export shape.
 */
export function detectFileKind(json: unknown, fileName: string): ParsedFileKind {
  if (Array.isArray(json)) {
    if (json.length === 0 || json.every(isConnectionEntry)) {
      return 'followers';
    }
  } else if (
    typeof json === 'object' &&
    json !== null &&
    Array.isArray((json as FollowingFile).relationships_following)
  ) {
    return 'following';
  }

  throw new InstagramParseError(
    `O arquivo não parece ser um export válido de seguidores/seguindo do Instagram.`,
    fileName,
  );
}

export function parseFollowersJson(json: unknown): InstagramProfile[] {
  const entries = json as FollowersFile;
  return entries.map(entryToProfile).filter((p): p is InstagramProfile => p !== null);
}

export function parseFollowingJson(json: unknown): InstagramProfile[] {
  const file = json as FollowingFile;
  return file.relationships_following
    .map(entryToProfile)
    .filter((p): p is InstagramProfile => p !== null);
}

export interface ParsedFile {
  kind: ParsedFileKind;
  fileName: string;
  profiles: InstagramProfile[];
}

export function parseInstagramJson(json: unknown, fileName: string): ParsedFile {
  const kind = detectFileKind(json, fileName);
  const profiles = kind === 'followers' ? parseFollowersJson(json) : parseFollowingJson(json);

  return { kind, fileName, profiles };
}

export async function parseInstagramFile(file: File): Promise<ParsedFile> {
  const text = await file.text();

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new InstagramParseError('Não foi possível ler o JSON deste arquivo.', file.name);
  }

  return parseInstagramJson(json, file.name);
}

export function mergeProfilesByUsername(profiles: InstagramProfile[]): InstagramProfile[] {
  const byUsername = new Map<string, InstagramProfile>();
  for (const profile of profiles) {
    if (!byUsername.has(profile.username)) {
      byUsername.set(profile.username, profile);
    }
  }
  return [...byUsername.values()];
}
