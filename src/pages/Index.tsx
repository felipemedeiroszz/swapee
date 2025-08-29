import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Home from './Home';
import Search from './Search';
import Profile from './Profile';
import AddItem from './AddItem';
import Chat from './Chat';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'search':
        return <Search />;
      case 'add':
        return <AddItem />;
      case 'chat':
        return <Chat />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="relative">
      {renderContent()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
