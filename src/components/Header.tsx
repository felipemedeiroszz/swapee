import { Settings, Sliders, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications, type NotificationItem } from '@/contexts/NotificationsContext';

interface HeaderProps {
  title: string;
  showFilters?: boolean;
  showLanguageSelector?: boolean;
  onFiltersClick?: () => void;
  onSettingsClick?: () => void;
  showNotifications?: boolean;
  notificationsCount?: number;
  leftIcon?: React.ReactNode;
}

const Header = ({ 
  title, 
  showFilters = false, 
  showLanguageSelector = false, 
  onFiltersClick, 
  onSettingsClick, 
  showNotifications = false, 
  notificationsCount = 0,
  leftIcon 
}: HeaderProps) => {
  const { t } = useLanguage();
  const { items, unreadCount, markAllAsRead } = useNotifications();
  const bellCount = notificationsCount ?? unreadCount;
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border z-40 shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-2 sm:p-3">
        <div className="flex items-center space-x-2 sm:space-x-4">
        {leftIcon ? (
          leftIcon
        ) : (
          <Link to="/" className="flex items-center group" title="Página Inicial">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <img 
                src="/logoswapee.png" 
                alt="Swapee Logo" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>
        )}
        <div className="h-6 w-px bg-border mx-1 sm:mx-2" />
        <h2 className="text-sm sm:text-base font-medium text-muted-foreground">
          {title}
        </h2>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          {showLanguageSelector && <LanguageSelector />}
          {onSettingsClick && (
            <Button variant="ghost" size="icon" onClick={onSettingsClick} className="flex">
              <Settings className="w-5 h-5" />
            </Button>
          )}
          {showNotifications && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('notifications') || 'Notificações'}>
                  <div className="relative">
                    <Bell className="w-5 h-5" />
                    {bellCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 px-1 h-4 min-w-[16px] justify-center" variant="destructive">
                        <span className="text-[10px] leading-none">{bellCount > 9 ? '9+' : bellCount}</span>
                      </Badge>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>{t('notifications') || 'Notificações'}</span>
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={markAllAsRead}>{t('markAllAsRead') || 'Marcar todas como lidas'}</Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {items.length === 0 ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    {t?.('noNotifications') || 'Sem notificações'}
                  </div>
                ) : (
                  <div className="max-h-80 overflow-auto py-1">
                    {(items as NotificationItem[]).map((n) => (
                      <div key={n.id} className="px-2 py-2 text-sm hover:bg-accent/50 cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{n.title}</span>
                              {n.unread && <span className="inline-block w-2 h-2 rounded-full bg-primary" />}
                            </div>
                            {n.description && (
                              <div className="text-muted-foreground text-xs mt-0.5">{n.description}</div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <DropdownMenuSeparator />
                <div 
                  className="px-2 py-1.5 text-sm text-center text-primary cursor-pointer hover:bg-accent/50"
                  onClick={() => markAllAsRead()}
                >
                  {t?.('viewAll') || 'Ver todas'}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {showFilters && onFiltersClick && (
            <Button variant="ghost" size="icon" onClick={onFiltersClick}>
              <Sliders className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;