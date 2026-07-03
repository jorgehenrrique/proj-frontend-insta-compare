import { useCallback, useMemo, useState } from 'react';
import { InstructionsPanel } from './components/InstructionsPanel';
import { SecurityNotice } from './components/SecurityNotice';
import { FileUploader } from './components/FileUploader';
import { StatsBar } from './components/StatsBar';
import { ResultsList } from './components/ResultsList';
import { useCheckedUsers } from './hooks/useCheckedUsers';
import { compareFollowersAndFollowing } from './utils/compareFollowers';
import type { InstagramProfile } from './types/instagram';

function App() {
  const [followers, setFollowers] = useState<InstagramProfile[]>([]);
  const [following, setFollowing] = useState<InstagramProfile[]>([]);
  const { checked, toggle } = useCheckedUsers();

  const handleDataChange = useCallback(
    (newFollowers: InstagramProfile[], newFollowing: InstagramProfile[]) => {
      setFollowers(newFollowers);
      setFollowing(newFollowing);
    },
    [],
  );

  const { notFollowingBack } = useMemo(
    () => compareFollowersAndFollowing(followers, following),
    [followers, following],
  );

  const checkedInResults = useMemo(
    () => notFollowingBack.filter((p) => checked.has(p.username)).length,
    [notFollowingBack, checked],
  );

  const hasData = followers.length > 0 && following.length > 0;

  return (
    <div className='mx-auto flex min-h-svh max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6'>
      <header className='flex flex-col items-center gap-2 text-center'>
        <span className='rounded-full bg-linear-to-r from-brand-start via-brand-mid to-brand-end bg-clip-text text-sm font-semibold tracking-wide text-transparent uppercase'>
          Insta Compare
        </span>
        <h1 className='text-3xl font-semibold tracking-tight text-ink sm:text-4xl'>
          Quem não te segue de volta?
        </h1>
        <p className='max-w-xl text-ink-muted'>
          Compare seus arquivos de seguidores e seguindo exportados do
          Instagram, tudo processado localmente no seu navegador — nenhum dado é
          enviado para servidores.
        </p>
      </header>

      <InstructionsPanel />

      <SecurityNotice />

      <section className='flex flex-col gap-3'>
        <h2 className='text-lg font-semibold text-ink'>Enviar arquivos</h2>
        <FileUploader onDataChange={handleDataChange} />
      </section>

      {hasData && (
        <section className='flex flex-col gap-4'>
          <StatsBar
            followingCount={following.length}
            followersCount={followers.length}
            notFollowingBackCount={notFollowingBack.length}
            checkedCount={checkedInResults}
          />

          <div>
            <h2 className='mb-3 text-lg font-semibold text-ink'>
              Pessoas que você segue e não te seguem de volta
            </h2>
            <ResultsList
              profiles={notFollowingBack}
              checked={checked}
              onToggle={toggle}
            />
          </div>
        </section>
      )}

      <footer className='mt-auto pt-6 text-center text-xs text-ink-muted'>
        Seus dados nunca saem do seu dispositivo — a comparação acontece
        inteiramente no navegador.
      </footer>
    </div>
  );
}

export default App;
