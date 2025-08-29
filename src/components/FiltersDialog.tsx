import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Sliders } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FiltersDialogProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export interface FilterState {
  distance: number;
  categories: string[];
  condition: string;
}

const CATEGORIES = [
  'electronics',
  'appliances', 
  'tools',
  'clothes',
  'shoes',
  'accessories',
  'books',
  'toys',
  'others'
];

const CONDITIONS = [
  'all',
  'new',
  'likeNew', 
  'goodCondition'
];

const FiltersDialog = ({ onFiltersChange }: FiltersDialogProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [distance, setDistance] = useState([50]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [condition, setCondition] = useState('all');

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };

  const handleApplyFilters = () => {
    const filters: FilterState = {
      distance: distance[0],
      categories: selectedCategories,
      condition
    };
    onFiltersChange?.(filters);
    setOpen(false);
  };

  const handleResetFilters = () => {
    setDistance([50]);
    setSelectedCategories([]);
    setCondition('all');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sliders className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            {t('filters')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Distance Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('searchRadius')}</Label>
            <div className="space-y-2">
              <Slider
                value={distance}
                onValueChange={setDistance}
                max={200}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 {t('mile')}</span>
                <span className="font-medium">{distance[0]} {t('miles')}</span>
                <span>200 {t('miles')}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('categories')}</Label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  />
                  <Label
                    htmlFor={category}
                    className="text-sm cursor-pointer"
                  >
                    {t(category)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('condition')}</Label>
            <RadioGroup value={condition} onValueChange={setCondition}>
              {CONDITIONS.map((cond) => (
                <div key={cond} className="flex items-center space-x-2">
                  <RadioGroupItem value={cond} id={cond} />
                  <Label htmlFor={cond} className="text-sm cursor-pointer">
                    {t(cond)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1"
            >
              {t('reset')}
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1"
            >
              {t('apply')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FiltersDialog;