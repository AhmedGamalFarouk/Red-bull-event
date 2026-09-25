import React from 'react';
import { useHashRoute } from './router/useHashRoute';
import { IntroView } from './views/IntroView';
import { LineupView } from './views/LineupView';
import { HeatView } from './views/HeatView';
import { ResultsView } from './views/ResultsView';
import { CompareView } from './views/CompareView';

export const App: React.FC = () => {
  const { route, navigate } = useHashRoute();

  // Note: Canvas in IntroView is strictly unmounted when route is not 'intro'
  switch (route.name) {
    case 'lineup':
      return <LineupView onNavigate={navigate} />;
    case 'heat':
      return <HeatView slug={route.slug} onNavigate={navigate} />;
    case 'results':
      return <ResultsView onNavigate={navigate} />;
    case 'compare':
      return <CompareView slugA={route.a} slugB={route.b} onNavigate={navigate} />;
    case 'intro':
    default:
      return <IntroView onNavigate={navigate} />;
  }
};

export default App;
