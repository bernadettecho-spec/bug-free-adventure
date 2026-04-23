import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar.jsx';
import PipelineProgress from './components/PipelineProgress.jsx';
import Dashboard from './components/Dashboard.jsx';
import Stage1Container from './components/Stage1_Agenda/Stage1Container.jsx';
import Stage2Container from './components/Stage2_Transcript/Stage2Container.jsx';
import Stage3Container from './components/Stage3_Minutes/Stage3Container.jsx';

export default function App() {
  const [view, setView] = useState('dashboard'); // dashboard | stage1 | stage2 | stage3
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function openMeeting(meeting, stage) {
    setActiveMeeting(meeting);
    setView(stage || 'stage1');
  }

  function goBack() {
    setActiveMeeting(null);
    setView('dashboard');
  }

  const currentStage = view === 'stage1' ? 1 : view === 'stage2' ? 2 : view === 'stage3' ? 3 : 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-off-white)', fontFamily: 'Lato, sans-serif' }}>
      <NavBar />

      {currentStage > 0 && (
        <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '0 24px' }}>
          <PipelineProgress currentStage={currentStage} meeting={activeMeeting} />
        </div>
      )}

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {view === 'dashboard' && (
          <Dashboard onOpenMeeting={openMeeting} showToast={showToast} />
        )}
        {view === 'stage1' && (
          <Stage1Container
            meeting={activeMeeting}
            onBack={goBack}
            onNext={(meeting) => { setActiveMeeting(meeting); setView('stage2'); }}
            showToast={showToast}
          />
        )}
        {view === 'stage2' && (
          <Stage2Container
            meeting={activeMeeting}
            onBack={() => setView('stage1')}
            onNext={(meeting) => { setActiveMeeting(meeting); setView('stage3'); }}
            showToast={showToast}
          />
        )}
        {view === 'stage3' && (
          <Stage3Container
            meeting={activeMeeting}
            onBack={() => setView('stage2')}
            onDone={goBack}
            showToast={showToast}
          />
        )}
      </main>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 1000,
          background: toast.type === 'error' ? 'var(--color-red)' : 'var(--color-dark-grey)',
          color: 'white', padding: '14px 24px', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)', fontWeight: 700, fontSize: 15,
          maxWidth: 400,
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
