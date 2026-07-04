import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { InstagramProfile, OptionalProfileData } from '../types/instagram';
import {
  InstagramParseError,
  mergeProfilesByUsername,
  parseInstagramJson,
  type ParsedFile,
} from '../utils/parseInstagramData';
import {
  createEmptyOptionalData,
  mergeOptionalData,
  OPTIONAL_FILE_LABELS,
  parseOptionalInstagramFile,
  type OptionalFileKind,
} from '../utils/parseOptionalProfiles';
import { ClearAllButton } from './CollapseToggleIcon';

interface UploadedFile {
  id: string;
  fileName: string;
  status: 'ok' | 'error';
  kind?: ParsedFile['kind'];
  optionalKind?: OptionalFileKind;
  count?: number;
  error?: string;
}

interface FileUploaderProps {
  onDataChange: (followers: InstagramProfile[], following: InstagramProfile[]) => void;
  onOptionalDataChange?: (data: OptionalProfileData) => void;
  onReset?: () => void;
}

function fileKindLabel(upload: UploadedFile): string {
  if (upload.optionalKind) {
    return OPTIONAL_FILE_LABELS[upload.optionalKind];
  }
  if (upload.kind === 'followers') return 'seguidores';
  if (upload.kind === 'following') return 'seguindo';
  return 'perfis';
}

export function FileUploader({ onDataChange, onOptionalDataChange, onReset }: FileUploaderProps) {
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [followersParsed, setFollowersParsed] = useState<InstagramProfile[]>([]);
  const [followingParsed, setFollowingParsed] = useState<InstagramProfile[]>([]);
  const [optionalData, setOptionalData] = useState<OptionalProfileData>(createEmptyOptionalData);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const followers = useMemo(() => mergeProfilesByUsername(followersParsed), [followersParsed]);
  const following = useMemo(() => mergeProfilesByUsername(followingParsed), [followingParsed]);

  useEffect(() => {
    onDataChange(followers, following);
  }, [followers, following, onDataChange]);

  useEffect(() => {
    onOptionalDataChange?.(optionalData);
  }, [optionalData, onOptionalDataChange]);

  const handleFiles = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.name.endsWith('.json'));

    for (const file of files) {
      const id = `${file.name}-${file.size}-${file.lastModified}`;

      let json: unknown;
      try {
        json = JSON.parse(await file.text());
      } catch {
        setUploaded((prev) => [
          ...prev.filter((u) => u.id !== id),
          { id, fileName: file.name, status: 'error', error: 'Não foi possível ler o JSON deste arquivo.' },
        ]);
        continue;
      }

      const optional = parseOptionalInstagramFile(file.name, json);
      if (optional) {
        setOptionalData((prev) => mergeOptionalData(prev, optional.kind, optional.entries));
        setUploaded((prev) => [
          ...prev.filter((u) => u.id !== id),
          {
            id,
            fileName: file.name,
            status: 'ok',
            optionalKind: optional.kind,
            count: optional.entries.length,
          },
        ]);
        continue;
      }

      try {
        const parsed = parseInstagramJson(json, file.name);
        setUploaded((prev) => [
          ...prev.filter((u) => u.id !== id),
          { id, fileName: file.name, status: 'ok', kind: parsed.kind, count: parsed.profiles.length },
        ]);
        if (parsed.kind === 'followers') {
          setFollowersParsed((prev) => [...prev, ...parsed.profiles]);
        } else {
          setFollowingParsed((prev) => [...prev, ...parsed.profiles]);
        }
      } catch (err) {
        const message =
          err instanceof InstagramParseError ? err.message : 'Erro inesperado ao ler o arquivo.';
        setUploaded((prev) => [
          ...prev.filter((u) => u.id !== id),
          { id, fileName: file.name, status: 'error', error: message },
        ]);
      }
    }
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (event.dataTransfer.files.length) {
        void handleFiles(event.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.length) {
        void handleFiles(event.target.files);
      }
      event.target.value = '';
    },
    [handleFiles],
  );

  const handleReset = useCallback(() => {
    setUploaded([]);
    setFollowersParsed([]);
    setFollowingParsed([]);
    setOptionalData(createEmptyOptionalData());
    onReset?.();
  }, [onReset]);

  const hasFollowers = followers.length > 0;
  const hasFollowing = following.length > 0;
  const optionalCount = optionalData.loadedKinds.length;

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isDragging
            ? 'border-brand-mid bg-brand-mid/8'
            : 'border-border bg-surface hover:border-brand-mid/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-brand-start via-brand-mid to-brand-end text-2xl text-white shadow-sm">
          ↑
        </div>
        <p className="text-base font-medium text-ink">Arraste os arquivos aqui ou clique para selecionar</p>
        <p className="max-w-md text-sm text-ink-muted">
          Envie <code className="rounded bg-surface-muted px-1.5 py-0.5">following.json</code> e{' '}
          <code className="rounded bg-surface-muted px-1.5 py-0.5">followers_1.json</code> (e
          followers_2.json, followers_3.json... se existirem). Você pode selecionar todos de uma
          vez.
        </p>
        <p className="max-w-md text-xs text-ink-muted">
          Opcional: <code className="rounded bg-surface-muted px-1 py-0.5">close_friends.json</code>,{' '}
          <code className="rounded bg-surface-muted px-1 py-0.5">restricted_profiles.json</code>,{' '}
          <code className="rounded bg-surface-muted px-1 py-0.5">hide_story_from.json</code> e outros
          da pasta do export.
        </p>
      </div>

      {uploaded.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {uploaded.map((u) => (
            <div
              key={u.id}
              className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm ${
                u.status === 'ok'
                  ? u.optionalKind
                    ? 'border-brand-mid/30 bg-brand-mid/5'
                    : 'border-border bg-surface'
                  : 'border-red-300 bg-red-50 dark:border-red-900/60 dark:bg-red-950/40'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span aria-hidden="true">{u.status === 'ok' ? '✅' : '⚠️'}</span>
                <span className="truncate font-medium text-ink">{u.fileName}</span>
              </div>
              <span className="shrink-0 text-ink-muted">
                {u.status === 'ok'
                  ? `${fileKindLabel(u)} · ${u.count}`
                  : u.error}
              </span>
            </div>
          ))}

          <div className="mt-2 flex items-center justify-between text-sm">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-ink-muted">
              <span className={hasFollowing ? 'text-ink' : ''}>
                Seguindo: <strong>{following.length || '—'}</strong>
              </span>
              <span className={hasFollowers ? 'text-ink' : ''}>
                Seguidores: <strong>{followers.length || '—'}</strong>
              </span>
              {optionalCount > 0 && (
                <span className="text-brand-mid">
                  Extras: <strong>{optionalCount}</strong> arquivo{optionalCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <ClearAllButton onClick={handleReset} />
          </div>
        </div>
      )}
    </div>
  );
}
