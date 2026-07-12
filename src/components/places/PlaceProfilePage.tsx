import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Star, Edit, Clock,
  Loader, Info, StarIcon,
} from 'lucide-react';
import { placesAPI, Place, CreatePlaceRequest } from '@/services/placesService';
import { reviewsAPI, Review } from '@/services/reviewsService';
import ReviewCard from '@/components/places/ReviewCard';
import AddEditPlaceModal from '@/components/places/AddEditPlaceModal';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';

const neuCard = "bg-[#e0e5ec] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff] dark:bg-[#252838] dark:shadow-[5px_5px_12px_#12151f,-5px_-5px_12px_#2e3248]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

type Tab = 'info' | 'reviews';

const TABS: { id: Tab; label: string; icon: typeof Info }[] = [
  { id: 'info',    label: 'Info',    icon: Info },
  { id: 'reviews', label: 'Reviews', icon: Star },
];

const DAYS: Record<number, string> = {
  0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 6:'Sat', 7:'Sun',
};

const isValidUrl = (url?: string) =>
  !!url && url !== 'string' && url.trim() !== '' && (url.startsWith('http') || url.startsWith('/'));

const PlaceProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const businessId = user?.businessId ?? '';

  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [showEditModal, setShowEditModal] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    placesAPI.getPlaceById(id)
      .then(setPlace)
      .catch(() => { toast.error('Place not found'); navigate(-1); })
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    reviewsAPI.getByPlace(id)
      .then(res => setReviews(res.data))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [id]);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;



  const handleUpdate = async (data: CreatePlaceRequest, imageFile?: File) => {
    if (!id) return;
    await placesAPI.updatePlace(id, data, imageFile);  
    toast.success('Place updated!');
    const updated = await placesAPI.getPlaceById(id);
    setPlace(updated);
  };




  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] dark:bg-[#252838] pt-16">
      <Loader className="animate-spin text-primary" size={40} />
    </div>
  );

  if (!place) return null;

  const initial = place.name[0]?.toUpperCase() ?? '?';
  const hasCover = isValidUrl(place.coverImage);

  return (
    <div className="min-h-screen bg-[#e0e5ec] dark:bg-[#252838] pt-16 pb-12">

      {/* Back Button */}
      <div className=" mx-auto px-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 ${neuSmall} hover:text-primary transition-colors`}
        >
          <ArrowLeft size={16} /> Back to Places
        </button>
      </div>

      <div className=" mx-auto px-4">

        {/* ── Cover + Profile (Facebook style) ── */}
        <div
          className="relative rounded-[2rem] overflow-visible mb-6
            shadow-[8px_8px_20px_#b8bec7,-8px_-8px_20px_#ffffff]
            dark:shadow-[6px_6px_16px_#0e1020,-6px_-6px_16px_#343750]"
        >
          {/* Cover Photo */}
          <div
            className="w-full h-72 rounded-[2rem] overflow-hidden"
            style={hasCover
              ? { backgroundImage: `url(${place.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : {}
            }
          >
            {!hasCover && (
              <div className="w-full h-full bg-gradient-to-br from-primary/70 via-orange-400/60 to-orange-300/50 relative">
                {/* Decorative circles */}
                <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-white/10" />
                <div className="absolute bottom-6 right-24 w-16 h-16 rounded-full bg-white/10" />
                <div className="absolute top-8 left-1/3 w-32 h-32 rounded-full bg-white/5" />
                <span className="absolute bottom-4 left-6 text-white/20 text-8xl font-black select-none">
                  {initial}
                </span>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setShowEditModal(true)}
            className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
              bg-[#e0e5ec]/90 dark:bg-[#252838]/90 backdrop-blur-sm text-gray-600 dark:text-gray-300
              ${neuSmall} hover:text-primary transition-colors`}
          >
            <Edit size={13} /> Edit
          </button>

          {/* Profile Circle */}
          <div className="absolute -bottom-10 left-6">
            <div className={`w-20 h-20 rounded-full overflow-hidden flex items-center justify-center
              bg-[#e0e5ec] dark:bg-[#252838]
              shadow-[5px_5px_12px_#b8bec7,-5px_-5px_12px_#ffffff]
              dark:shadow-[5px_5px_12px_#0e1020,-5px_-5px_12px_#343750]
              border-4 border-[#e0e5ec] dark:border-[#252838]`}
            >
              <img src="/bazooka.jpg" alt={place.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* ── Place Name + Meta + Location ── */}
        <div className="pl-28 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-gray-700 dark:text-white leading-tight">
              {place.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {place.categoryName && (
                <span className={`text-xs px-3 py-1 rounded-full font-semibold text-primary ${neuInset}`}>
                  {place.categoryName}
                </span>
              )}
              <span className={`inline-flex items-center gap-1.5 text-xs text-gray-500 px-3 py-1 rounded-full ${neuSmall}`}>
                <MapPin size={11} className="text-primary" />
                {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
              </span>
            </div>
          </div>
          <span className={`flex items-center gap-1 text-xs text-gray-500 px-3 py-1.5 rounded-full ${neuSmall}`}>
            <Star size={10} className="text-orange-400 fill-orange-400" />
            {avgRating > 0 ? `${avgRating.toFixed(1)} (${reviews.length})` : 'No ratings'}
          </span>
        </div>

        {/* ── Tab Navigation ── */}
        <div className={`flex gap-1 p-1 rounded-2xl mb-6 ${neuInset}`}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.2)]'
                    : 'text-gray-400 hover:text-primary'
                  }`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}

        {/* INFO */}
        {activeTab === 'info' && (
          <motion.div key="info" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className={`${neuCard} rounded-2xl p-5`}>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {place.description}
              </p>
            </div>

            {place.openingHours.length > 0 && (
              <div className={`${neuCard} rounded-2xl p-5`}>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock size={13} className="text-primary" /> Opening Hours
                </p>
                <div className="space-y-2">
                  {place.openingHours.map(h => (
                    <div key={h.dayOfWeek} className="flex justify-between items-center py-1">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full text-primary ${neuInset}`}>
                        {DAYS[h.dayOfWeek]}
                      </span>
                      <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                        {h.openTime} – {h.closeTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* REVIEWS */}
        {activeTab === 'reviews' && (
          <motion.div key="reviews" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Average rating summary */}
            {!reviewsLoading && reviews.length > 0 && (
              <div className={`${neuCard} rounded-2xl p-5 flex items-center justify-between`}>
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer Reviews
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-gray-700 dark:text-white">
                    {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                  </span>
                  <Star size={20} className="fill-orange-400 text-orange-400" />
                </div>
              </div>
            )}

            {reviewsLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="animate-spin text-primary" size={32} />
              </div>
            ) : reviews.length === 0 ? (
              <div className={`${neuCard} rounded-2xl p-12 text-center`}>
                <StarIcon size={36} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No reviews yet</p>
                <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">
                  Reviews from customers will appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="h-full"
                  >
                    <ReviewCard review={review} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </div>

      {/* Modals */}
      {showEditModal && (
        <AddEditPlaceModal
          place={place}
          businessId={businessId}
          onSubmit={handleUpdate}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default PlaceProfilePage;