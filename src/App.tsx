import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { AppViewport } from './components/layout/AppViewport';
import { HomePanel } from './components/layout/HomePanel';
import { ResultsPanel } from './components/layout/ResultsPanel';
import type { ActivePanel } from './components/layout/PanelNav';
import { useCheckedUsers } from './hooks/useCheckedUsers';
import { compareFollowersAndFollowing } from './utils/compareFollowers';
import type { InstagramProfile } from './types/instagram';

function App() {
  const [followers, setFollowers] = useState<InstagramProfile[]>([]);
  const [following, setFollowing] = useState<InstagramProfile[]>([]);
  const [activePanel, setActivePanel] = useState<ActivePanel>('home');
  const hadDataRef = useRef(false);
  const { checked, toggle } = useCheckedUsers();

  const handleDataChange = useCallback(
    (newFollowers: InstagramProfile[], newFollowing: InstagramProfile[]) => {
      setFollowers(newFollowers);
      setFollowing(newFollowing);
    },
    [],
  );

  const handleReset = useCallback(() => {
    setActivePanel('home');
  }, []);

  const { notFollowingBack } = useMemo(
    () => compareFollowersAndFollowing(followers, following),
    [followers, following],
  );

  const checkedInResults = useMemo(
    () => notFollowingBack.filter((p) => checked.has(p.username)).length,
    [notFollowingBack, checked],
  );

  const hasData = followers.length > 0 && following.length > 0;

  useEffect(() => {
    if (hasData && !hadDataRef.current) {
      setActivePanel('results');
    }
    if (!hasData) {
      setActivePanel('home');
    }
    hadDataRef.current = hasData;
  }, [hasData]);

  return (
    <AppViewport
      activePanel={activePanel}
      hasData={hasData}
      onNavigate={setActivePanel}
      home={
        <HomePanel
          hasData={hasData}
          onGoToResults={() => setActivePanel('results')}
          uploadSection={
            <FileUploader onDataChange={handleDataChange} onReset={handleReset} />
          }
        />
      }
      results={
        <ResultsPanel
          onGoToHome={() => setActivePanel('home')}
          followingCount={following.length}
          followersCount={followers.length}
          notFollowingBackCount={notFollowingBack.length}
          checkedCount={checkedInResults}
          profiles={notFollowingBack}
          checked={checked}
          onToggle={toggle}
        />
      }
    />
  );
}

export default App;
