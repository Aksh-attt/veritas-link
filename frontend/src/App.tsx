import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { ComparisonSection } from './components/landing/ComparisonSection';
import { ScenariosShowcase } from './components/landing/ScenariosShowcase';
import { Footer } from './components/landing/Footer';
import { WorkspaceLayout } from './components/workspace/WorkspaceLayout';
import { DemoLauncherModal } from './components/demo/DemoLauncherModal';
import { ThreatReportModal } from './components/report/ThreatReportModal';
import { ShareableWarningCard } from './components/report/ShareableWarningCard';
import { 
  InvestigationReport, 
  InvestigationEvent, 
  VeraStateType 
} from './types';
import { 
  streamInvestigation, 
  fetchInvestigationHistory 
} from './services/api';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace' | 'history' | 'docs'>('landing');
  const [url, setUrl] = useState('');
  const [scenarioId, setScenarioId] = useState<string | undefined>(undefined);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [veraState, setVeraState] = useState<VeraStateType>('IDLE');
  const [events, setEvents] = useState<InvestigationEvent[]>([]);
  const [activeReport, setActiveReport] = useState<InvestigationReport | null>(null);
  const [history, setHistory] = useState<InvestigationReport[]>([]);
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(undefined);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [cancelStream, setCancelStream] = useState<(() => void) | null>(null);

  // Load history on mount
  useEffect(() => {
    fetchInvestigationHistory()
      .then((data) => setHistory(data))
      .catch((err) => console.warn('Could not load history yet:', err));
  }, []);

  const handleStartInvestigation = (targetUrl?: string, targetScenarioId?: string) => {
    const investigateUrl = targetUrl || url;
    if (!investigateUrl.trim() || isInvestigating) return;

    // Reset current investigation state
    setIsInvestigating(true);
    setVeraState('SCANNING');
    setEvents([]);
    setActiveReport(null);
    setScreenshotUrl(undefined);
    setConsoleLogs([
      `[${new Date().toLocaleTimeString()}] Target received: ${investigateUrl}`,
      `[${new Date().toLocaleTimeString()}] Requesting isolated TinyFish browser container...`,
    ]);

    // Switch view to workspace if currently on landing
    if (currentView !== 'workspace') {
      setCurrentView('workspace');
    }

    const cancel = streamInvestigation(
      investigateUrl,
      targetScenarioId || scenarioId,
      (ev) => {
        setEvents((prev) => [...prev, ev]);
        setVeraState(ev.vera_state);
        if (ev.screenshot_url) {
          setScreenshotUrl(ev.screenshot_url);
        }
        setConsoleLogs((prev) => [
          ...prev,
          `[${ev.timestamp}] (${ev.event_type.toUpperCase()}) ${ev.message}`,
        ]);
      },
      (report) => {
        setIsInvestigating(false);
        setActiveReport(report);
        setVeraState(report.final_verdict === 'HIGH RISK' ? 'THREAT DETECTED' : 'ASSESSMENT COMPLETE');
        setHistory((prev) => [report, ...prev.filter(r => r.id !== report.id)]);
        setConsoleLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Investigation successfully completed. Risk score: ${report.risk_score}/100.`,
        ]);

        // Trigger celebratory confetti for completed audit
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#FFE65C', '#F044D9', '#EED6F5', '#FF786F'],
        });
      },
      (errorMsg) => {
        setIsInvestigating(false);
        setVeraState('INCONCLUSIVE');
        setConsoleLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ERROR: ${errorMsg}`,
        ]);
      }
    );

    setCancelStream(() => cancel);
  };

  const handleSelectScenario = (scId: string, scUrl: string) => {
    setUrl(scUrl);
    setScenarioId(scId);
    handleStartInvestigation(scUrl, scId);
  };

  const handleNewInvestigation = () => {
    if (cancelStream) cancelStream();
    setUrl('');
    setScenarioId(undefined);
    setIsInvestigating(false);
    setVeraState('IDLE');
    setEvents([]);
    setActiveReport(null);
    setScreenshotUrl(undefined);
    setConsoleLogs([]);
  };

  return (
    <div className="min-h-screen bg-aubergine text-offWhite flex flex-col selection:bg-magenta selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView === 'landing' ? 'landing' : 'workspace'}
        onNavigate={(view) => {
          if (view === 'history') {
            setCurrentView('workspace');
          } else {
            setCurrentView(view);
          }
        }}
        onOpenDemo={() => setShowDemoModal(true)}
      />

      {/* Main View Router */}
      {currentView === 'landing' ? (
        <main className="flex-1">
          <HeroSection
            onStartInvestigation={(inputUrl) => {
              setUrl(inputUrl);
              handleStartInvestigation(inputUrl);
            }}
            onOpenDemo={() => setShowDemoModal(true)}
          />
          <HowItWorksSection />
          <ComparisonSection />
          <ScenariosShowcase
            onSelectScenario={handleSelectScenario}
          />
          <Footer
            onNavigateToWorkspace={() => setCurrentView('workspace')}
          />
        </main>
      ) : (
        <main className="flex-1">
          <WorkspaceLayout
            url={url}
            onUrlChange={setUrl}
            onStartInvestigation={() => handleStartInvestigation()}
            isInvestigating={isInvestigating}
            veraState={veraState}
            events={events}
            activeReport={activeReport}
            history={history}
            onSelectReport={(rep) => {
              setActiveReport(rep);
              setUrl(rep.url);
              setVeraState(rep.final_verdict === 'HIGH RISK' ? 'THREAT DETECTED' : 'ASSESSMENT COMPLETE');
            }}
            onNewInvestigation={handleNewInvestigation}
            onSelectScenario={handleSelectScenario}
            onNavigateLanding={() => setCurrentView('landing')}
            screenshotUrl={screenshotUrl}
            consoleLogs={consoleLogs}
          />
        </main>
      )}

      {/* Global Demo Launcher Modal */}
      {showDemoModal && (
        <DemoLauncherModal
          onClose={() => setShowDemoModal(false)}
          onSelectScenario={handleSelectScenario}
        />
      )}
    </div>
  );
};

export default App;

