import { Home, Search, MessageCircle, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'home', icon: Home, label: t('discover') },
    { id: 'search', icon: Search, label: t('search') },
    { id: 'add', icon: Plus, label: t('add') },
    { id: 'chat', icon: MessageCircle, label: t('matches') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-primary bg-accent' 
                  : 'text-muted-foreground hover:text-foreground'
              } ${tab.id === 'add' ? 'bg-gradient-primary text-white hover:opacity-90' : ''}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-love-pulse' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;