import React from 'react';
import PartyTrends from './components/PartyTrends';
import ConstituencyMap from './components/ConstituencyMap';
import TurnoutAnalysis from './components/TurnoutAnalysis';
import CloseContests from './components/CloseContests';
import RegionalDominance from './components/RegionalDominance';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Indian Elections Dashboard</h1>
      <PartyTrends />
      <TurnoutAnalysis />
      <ConstituencyMap />
      <CloseContests />
      <RegionalDominance />
    </div>
  );
}

export default App;
