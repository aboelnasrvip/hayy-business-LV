import { useState, useEffect } from 'react';
import { X, Search, Loader } from 'lucide-react';
import { categoriesAPI, Category } from '@/services/categoriesService';
import { toast } from 'sonner';

const CATEGORY_EMOJI: Record<string, string> = {
  'cafes.png': '☕', 'pharmacy.png': '💊', 'hotels.png': '🏨',
  'fashion.png': '👗', 'pets.png': '🐾', 'oriental_food.png': '🍛',
  'market.png': '🛒', 'dental.png': '🦷', 'tech.png': '📱',
  'cat.jpg': '🍽️', 'car_wash.png': '🚗', 'books.png': '📚',
  'beauty.png': '💄', 'barber.png': '✂️', 'gym.png': '🏋️',
  'preschool.png': '🏫', 'wedding.png': '💒', 'car_repair.png': '🔧',
  'education.png': '📖', 'football.png': '⚽',
};

const neu = "bg-[#e0e5ec] shadow-[4px_4px_10px_#b8bec7,-4px_-4px_10px_#ffffff] dark:bg-[#252838] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

interface Props {
  selectedId?: string;
  onSelect: (id: string, name: string) => void;
  onClose: () => void;
}

const CategoryPickerModal = ({ selectedId, onSelect, onClose }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.getAll()
      .then(setCategories)
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`${neu} rounded-[2rem] p-6 w-full max-w-lg max-h-[85vh] flex flex-col gap-4`}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-700 dark:text-white text-lg">Select Category</h3>
          <button onClick={onClose} className={`w-8 h-8 flex items-center justify-center rounded-xl ${neu}`}>
            <X size={15} className="text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full ${neuInset}`}>
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Categories Grid */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader className="animate-spin text-primary" size={28} />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5 py-1">
              {filtered.map(cat => {
                const isSelected = cat.id === selectedId;
                const emoji = CATEGORY_EMOJI[cat.imageUrl] ?? '📍';
                return (
                  <button
                    key={cat.id}
                    onClick={() => { onSelect(cat.id, cat.name); onClose(); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all
                      ${isSelected
                        ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] dark:shadow-[3px_3px_8px_#12151f]'
                        : `text-gray-600 dark:text-gray-300 ${neu} hover:text-primary`
                      }`}
                  >
                    <span>{emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPickerModal;