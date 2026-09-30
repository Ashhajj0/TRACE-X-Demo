/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CANDIDATES, Candidate } from './data/candidates';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ObjectTrackingView } from './components/ObjectTrackingView';
import { BlinkComparatorView } from './components/BlinkComparatorView';
import { SkyCatalogView } from './components/SkyCatalogView';
import { ExportModal } from './components/ExportModal';
import { MissionModal } from './components/MissionModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'blink-comparator' | 'object-tracking' | 'sky-catalog'>(
    'object-tracking'
  );
  const [currentCandidate, setCurrentCandidate] = useState<Candidate>(CANDIDATES[0]); // TX-09 by default
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  return (
    <div className="bg-[#0d131f] text-[#dde2f3] min-h-screen flex flex-col font-sans selection:bg-[#38bdf8] selection:text-[#004965]">
      {/* Fixed Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full pt-14 flex-1 flex flex-col bg-[#0d131f]">
        {currentTab === 'object-tracking' && (
          <ObjectTrackingView
            currentCandidate={currentCandidate}
            onSelectCandidate={setCurrentCandidate}
            onOpenExport={() => setIsExportOpen(true)}
            onNavigateToCatalog={() => setCurrentTab('sky-catalog')}
          />
        )}

        {currentTab === 'blink-comparator' && (
          <BlinkComparatorView
            currentCandidate={currentCandidate}
            onSelectCandidate={setCurrentCandidate}
            onNavigateToTracking={() => setCurrentTab('object-tracking')}
          />
        )}

        {currentTab === 'sky-catalog' && (
          <SkyCatalogView
            onSelectCandidate={setCurrentCandidate}
            onNavigateToTracking={(cand) => {
              setCurrentCandidate(cand);
              setCurrentTab('object-tracking');
            }}
            onNavigateToBlink={(cand) => {
              setCurrentCandidate(cand);
              setCurrentTab('blink-comparator');
            }}
          />
        )}
      </main>

      {/* Bottom Sticky Footer */}
      <Footer />

      {/* Export Telemetry Modal */}
      {isExportOpen && (
        <ExportModal
          candidate={currentCandidate}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Mission & About Modal */}
      {isInfoOpen && (
        <MissionModal onClose={() => setIsInfoOpen(false)} />
      )}
    </div>
  );
}
