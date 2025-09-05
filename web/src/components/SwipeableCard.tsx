import { useState, useRef, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SwipeableCardProps {
  item: {
    id: string;
    title: string;
    image: string;
    type: string;
    price: string | null;
    location: string;
    timeAgo: string;
    isMatched: boolean;
    user: {
      name: string;
      rating: number;
      avatar: string;
    };
  };
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onRemove?: () => void;
}

const SwipeableCard = ({ item, onSwipeLeft, onSwipeRight, onRemove }: SwipeableCardProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showActions, setShowActions] = useState(false);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setStartPos({ x: clientX, y: clientY });
    setIsDragging(true);
    setShowActions(false);
  };

  const handleTouchMove = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    
    // Only update position if the movement is more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setPosition({ x: deltaX, y: 0 });
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    // Threshold for swipe action (in pixels)
    const threshold = 50;
    
    if (position.x > threshold) {
      // Swipe right - liked
      if (onSwipeRight) onSwipeRight();
      setPosition({ x: 500, y: 0 });
    } else if (position.x < -threshold) {
      // Swipe left - disliked
      if (onSwipeLeft) onSwipeLeft();
      setPosition({ x: -500, y: 0 });
    } else {
      // Return to original position
      setPosition({ x: 0, y: 0 });
      setShowActions(true);
    }
    
    setIsDragging(false);
  };

  // Add event listeners for mouse events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleTouchMove(e);
    const handleMouseUp = () => handleTouchEnd();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, startPos]);

  // Add event listeners for touch events
  useEffect(() => {
    const handleTouchMoveEvent = (e: TouchEvent) => handleTouchMove(e);
    const handleTouchEndEvent = () => handleTouchEnd();

    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMoveEvent, { passive: false });
      window.addEventListener('touchend', handleTouchEndEvent);
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMoveEvent);
      window.removeEventListener('touchend', handleTouchEndEvent);
    };
  }, [isDragging, position, startPos]);

  // Calculate rotation based on position
  const rotation = position.x * 0.05;
  
  // Calculate opacity for like/dislike indicators
  const likeOpacity = Math.max(0, Math.min(1, position.x / 100));
  const dislikeOpacity = Math.max(0, Math.min(1, -position.x / 100));

  return (
    <div className="relative w-full h-full">
      {/* Like/Dislike indicators */}
      <div 
        className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none z-0"
        style={{ opacity: showActions ? 1 : 0, transition: 'opacity 0.2s' }}
      >
        <Button 
          variant="destructive" 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            setPosition({ x: -500, y: 0 });
            if (onSwipeLeft) onSwipeLeft();
          }}
        >
          <X className="h-6 w-6" />
        </Button>
        <Button 
          variant="default" 
          size="icon" 
          className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            setPosition({ x: 500, y: 0 });
            if (onSwipeRight) onSwipeRight();
          }}
        >
          <Heart className="h-6 w-6 fill-white" />
        </Button>
      </div>

      {/* The actual card */}
      <div
        ref={cardRef}
        className="relative z-10 w-full transition-transform duration-300 ease-out touch-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
          opacity: 1 - Math.min(0.5, Math.abs(position.x) / 300),
          touchAction: 'none',
        }}
        onTouchStart={handleTouchStart}
        onMouseDown={handleTouchStart}
      >
        <Card className="overflow-hidden">
          <div className="relative w-full h-64">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.isMatched && (
              <div className="absolute top-2 right-2">
                <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <Heart className="w-3 h-3 mr-1 fill-current" />
                  Match!
                </div>
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg text-foreground">{item.title}</h3>
                <div className="flex items-center mt-1">
                  <Badge variant={item.type === 'Doação' ? 'secondary' : 'default'} className="text-xs">
                    {item.type}
                  </Badge>
                  {item.price && (
                    <span className="ml-2 text-sm font-medium text-foreground">
                      {item.price}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-sm text-muted-foreground flex items-center">
                  {item.location} • {item.timeAgo}
                </div>
              </div>
            </div>
            
            {/* User info */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center">
                <img
                  src={item.user.avatar}
                  alt={item.user.name}
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
                <div>
                  <p className="text-sm font-medium">{item.user.name}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(item.user.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {item.user.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Like/Dislike overlay indicators */}
      {Math.abs(position.x) > 10 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {position.x > 0 && (
            <div 
              className="p-4 bg-green-500/20 rounded-full text-green-500 font-bold text-xl"
              style={{ opacity: likeOpacity }}
            >
              Gostei
            </div>
          )}
          {position.x < 0 && (
            <div 
              className="p-4 bg-red-500/20 rounded-full text-red-500 font-bold text-xl"
              style={{ opacity: dislikeOpacity }}
            >
              Remover
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SwipeableCard;
