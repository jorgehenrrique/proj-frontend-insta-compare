import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { AppViewport } from './components/layout/AppViewport';
import { ExtrasPanel } from './components/layout/ExtrasPanel';
import { HomePanel } from './components/layout/HomePanel';
import { ResultsPanel } from './components/layout/ResultsPanel';
import type { ActivePanel } from './components/layout/PanelNav';
import { useCheckedExtras } from './hooks/useCheckedExtras';
import { useCheckedUsers } from './hooks/useCheckedUsers';
import { compareFollowersAndFollowing } from './utils/compareFollowers';
import { createEmptyOptionalData, hasOptionalData } from './utils/parseOptionalProfiles';
import type { InstagramProfile, OptionalProfileData } from './types/instagram';

function App() {
  const [followers, setFollowers] = useState<InstagramProfile[]>([]);
  const [following, setFollowing] = useState<InstagramProfile[]>([]);
  const [optionalData, setOptionalData] = useState<OptionalProfileData>(createEmptyOptionalData);
  const [activePanel, setActivePanel] = useState<ActivePanel>('home');
  const hadDataRef = useRef(false);
  const { checked, toggle } = useCheckedUsers();
  const { checked: checkedExtras, toggle: toggleExtra, clear: clearExtras } = useCheckedExtras();

  const handleDataChange = useCallback(
    (newFollowers: InstagramProfile[], newFollowing: InstagramProfile[]) => {
      setFollowers(newFollowers);
      setFollowing(newFollowing);
    },
    [],
  );

  const handleOptionalDataChange = useCallback((data: OptionalProfileData) => {
    setOptionalData(data);
  }, []);

  const handleReset = useCallback(() => {
    setActivePanel('home');
    setOptionalData(createEmptyOptionalData());
    clearExtras();
  }, [clearExtras]);

  const { notFollowingBack } = useMemo(
    () => compareFollowersAndFollowing(followers, following),
    [followers, following],
  );

  const checkedInResults = useMemo(
    () => notFollowingBack.filter((p) => checked.has(p.username)).length,
    [notFollowingBack, checked],
  );

  const hasData = followers.length > 0 && following.length > 0;
  const hasExtras = hasOptionalData(optionalData);

  useEffect(() => {
    if (hasData && !hadDataRef.current) {
      setActivePanel('results');
    }
    if (!hasData) {
      setActivePanel('home');
    }
    hadDataRef.current = hasData;
  }, [hasData]);

  useEffect(() => {
    if (!hasExtras && activePanel === 'extras') {
      setActivePanel('results');
    }
  }, [hasExtras, activePanel]);

  return (
    <AppViewport
      activePanel={activePanel}
      hasData={hasData}
      hasExtras={hasExtras}
      onNavigate={setActivePanel}
      home={
        <HomePanel
          hasData={hasData}
          onGoToResults={() => setActivePanel('results')}
          uploadSection={
            <FileUploader
              onDataChange={handleDataChange}
              onOptionalDataChange={handleOptionalDataChange}
              onReset={handleReset}
            />
          }
        />
      }
      results={
        <ResultsPanel
          onGoToHome={() => setActivePanel('home')}
          onGoToExtras={hasExtras ? () => setActivePanel('extras') : undefined}
          followingCount={following.length}
          followersCount={followers.length}
          notFollowingBackCount={notFollowingBack.length}
          checkedCount={checkedInResults}
          profiles={notFollowingBack}
          checked={checked}
          onToggle={toggle}
          optionalData={optionalData}
        />
      }
      extras={
        <ExtrasPanel
          onGoToResults={() => setActivePanel('results')}
          optionalData={optionalData}
          notFollowingBackUsernames={notFollowingBack.map((p) => p.username)}
          checked={checkedExtras}
          onToggleChecked={toggleExtra}
        />
      }
    />
  );
}

export default App;
