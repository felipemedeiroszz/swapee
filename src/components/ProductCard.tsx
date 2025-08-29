import { useState } from 'react';
import { Heart, X, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div 
      className={`relative w-full max-w-sm mx-auto bg-gradient-card rounded-3xl shadow-card overflow-hidden transform transition-all duration-300 ${
        isAnimating === 'right' ? 'animate-swipe-right' : 
        isAnimating === 'left' ? 'animate-swipe-left' : ''
      }`}
    >
      {/* Image Container */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={product.images[currentImageIndex]}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm"
            >
              ›
            </button>
          </>
        )}

        {/* Image Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

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
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">{product.title}</h3>
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
    </div>
  );
};

export default ProductCard;