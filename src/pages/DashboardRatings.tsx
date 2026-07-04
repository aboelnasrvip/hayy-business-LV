import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star, MapPin, Loader, StarIcon,
} from 'lucide-react';
import { reviewsAPI, Review } from '@/services/reviewsService';
import { placesAPI, Place } from '@/services/placesService';
import ReviewCard from '@/components/places/ReviewCard';
import { toast } from 'sonner';

const neuCard = "rounded-[1.5rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";

const DashboardRatings = () => {
  const [places, setPlaces]                   = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');
  const [reviews, setReviews]                 = useState<Review[]>([]);
  const [placesLoading, setPlacesLoading]     = useState(true);
  const [reviewsLoading, setReviewsLoading]   = useState(false);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    placesAPI.getMyPlaces()
      .then(data => {
        setPlaces(data);
        if (data.length > 0) setSelectedPlaceId(data[0].id);
      })
      .catch(() => toast.error('Failed to load places'))
      .finally(() => setPlacesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedPlaceId) return;
    setReviewsLoading(true);
    reviewsAPI.getByPlace(selectedPlaceId)
      .then(res => setReviews(res.data))
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setReviewsLoading(false));
  }, [selectedPlaceId]);

  return (
    <div className="space-y-6 pt-16 mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Ratings & Reviews</h1>
          <p className="text-sm text-gray-400 mt-0.5">Read and reply to customer reviews</p>
        </div>
        {reviews.length > 0 && (
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-2xl font-black text-gray-700 dark:text-white">
                {avgRating.toFixed(1)}
              </span>
              <Star size={20} className="fill-orange-400 text-orange-400" />
            </div>
            <p className="text-[10px] text-gray-400">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>

      {/* Place Selector */}
      {placesLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin text-primary" size={28} />
        </div>
      ) : places.length === 0 ? (
        <div className={`${neuCard} p-10 text-center`}>
          <MapPin size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No places found</p>
        </div>
      ) : (
        <div className="flex gap-2 items-center justify-center flex-wrap">
          {places.map(place => (
            <button
              key={place.id}
              onClick={() => setSelectedPlaceId(place.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${selectedPlaceId === place.id
                  ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.15)]'
                  : `text-gray-500 dark:text-gray-400 ${neuSmall} hover:text-primary`
                }`}
            >
              <MapPin size={13} /> {place.name}
            </button>
          ))}
        </div>
      )}

      {/* Reviews List */}
      {reviewsLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-primary" size={32} />
        </div>
      ) : reviews.length === 0 && selectedPlaceId ? (
        <div className={`${neuCard} p-12 text-center`}>
          <StarIcon size={36} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No reviews yet</p>
          <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">
            Reviews from customers will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardRatings;
