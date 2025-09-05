import { useState, useRef, useEffect } from 'react';
import { Heart, X, MapPin, Tag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import "../styles/discover.css";

interface Product {
  id: string;
  title: string;
  images: string[];
  category: string;
  condition: string;
  type: 'Troca' | 'Doação';
  description: string;
  location: string;
  distance: string;
}

interface ProductCardProps {
  product: Product;
  onSwipeRight: (productId: string) => void;
  onSwipeLeft: (productId: string) => void;
}

const ProductCard = ({ product, onSwipeRight, onSwipeLeft }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<'right' | 'left' | null>(null);
  const { t } = useLanguage();
  const [lightbox, setLightbox] = useState(false);

  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rotation = position.x * 0.05;
  const likeOpacity = Math.max(0, Math.min(1, position.x / 100));
  const dislikeOpacity = Math.max(0, Math.min(1, -position.x / 100));

  const handleLove = () => {
    setIsAnimating('right');
    setTimeout(() => {
      onSwipeRight(product.id);
      setIsAnimating(null);
    }, 300);
  };

  const handlePass = () => {
    setIsAnimating('left');
    setTimeout(() => {
      onSwipeLeft(product.id);
      setIsAnimating(null);
    }, 300);
  };

  // Drag handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartPos({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handlePointerMove = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setPosition({ x: deltaX, y: 0 });
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const threshold = 50;
    if (position.x > threshold) {
      setPosition({ x: 500, y: 0 });
      onSwipeRight(product.id);
    } else if (position.x < -threshold) {
      setPosition({ x: -500, y: 0 });
      onSwipeLeft(product.id);
    } else {
      setPosition({ x: 0, y: 0 });
    }
    setIsDragging(false);
  };

  // Reset position when product changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setIsAnimating(null);
  }, [product.id]);

  // Attach global listeners during drag
  useEffect(() => {
    const mm = (e: MouseEvent) => handlePointerMove(e);
    const mu = () => handleTouchEnd();
    const tm = (e: TouchEvent) => handlePointerMove(e);
    const tu = () => handleTouchEnd();
    if (isDragging) {
      window.addEventListener('mousemove', mm);
      window.addEventListener('mouseup', mu);
      window.addEventListener('touchmove', tm, { passive: false });
      window.addEventListener('touchend', tu);
    }
    return () => {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
      window.removeEventListener('touchmove', tm as any);
      window.removeEventListener('touchend', tu);
    };
  }, [isDragging, position, startPos]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div 
      ref={cardRef}
      className={`relative w-full max-w-sm mx-auto discover-card overflow-hidden transform transition-all duration-300 ${
        isAnimating === 'right' ? 'animate-swipe-right' : 
        isAnimating === 'left' ? 'animate-swipe-left' : ''
      }`}
      style={{
        transform: `${isAnimating ? '' : `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`}`,
        opacity: isAnimating ? 1 : 1 - Math.min(0.5, Math.abs(position.x) / 300),
        touchAction: 'none',
      }}
      onTouchStart={handleTouchStart}
      onMouseDown={handleTouchStart}
    >
      {/* Image / Gallery */}
      <div className="p-4 pb-0">
        <div className="gallery">
          <div className="gallery-main rounded-xl overflow-hidden" onClick={() => setLightbox(true)}>
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="select-none"
            />
          </div>
          {product.images.length > 1 && (
            <div className="gallery-thumbs">
              {product.images.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`gallery-thumb ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                  aria-label={`Imagem ${idx + 1}`}
                >
                  <img src={src} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <Badge 
            variant={product.type === 'Doação' ? 'secondary' : 'default'}
            className="text-xs font-semibold"
          >
            {product.type === 'Doação' ? t('donation') : t('exchange')}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4 space-y-4">
        <div>
          <h3 className="text-xl discover-title font-extrabold text-foreground mb-2">{product.title}</h3>
          <div className="badges mb-2">
            <span className="badge-soft">{product.distance}</span>
            <span className="badge-soft">{product.condition}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Tag className="w-4 h-4" />
            <span>{product.category}</span>
            <span>•</span>
            <span>{product.condition}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{product.location} • {product.distance}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 pt-4">
          <Button 
            variant="pass" 
            size="icon"
            onClick={handlePass}
            className="shadow-lg hover:scale-110 transition-transform"
          >
            <X className="w-6 h-6" />
          </Button>
          <Button 
            variant="love" 
            size="icon"
            onClick={handleLove}
            className="shadow-lg hover:scale-110 transition-transform"
          >
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Swipe overlay labels */}
      {Math.abs(position.x) > 10 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {position.x > 0 && (
            <div 
              className="p-4 bg-green-500/20 rounded-full text-green-600 font-bold text-xl"
              style={{ opacity: likeOpacity }}
            >
              Gostei
            </div>
          )}
          {position.x < 0 && (
            <div 
              className="p-4 bg-red-500/20 rounded-full text-red-600 font-bold text-xl"
              style={{ opacity: dislikeOpacity }}
            >
              Remover
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <img src={product.images[currentImageIndex]} alt={product.title} className="lightbox-img" />
        </div>
      )}
    </div>
  );
};

export default ProductCard;