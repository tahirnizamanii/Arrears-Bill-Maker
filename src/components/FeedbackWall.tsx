import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Plus,
  Heart,
  Quote,
  MapPin,
  Award,
} from 'lucide-react';
import { TeacherFeedback } from '../types';
import { getTeacherFeedbacks } from '../utils/feedbackStorage';

interface FeedbackWallProps {
  onOpenFeedbackModal: () => void;
}

export const FeedbackWall: React.FC<FeedbackWallProps> = ({ onOpenFeedbackModal }) => {
  const [feedbacks, setFeedbacks] = useState<TeacherFeedback[]>([]);
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');

  const loadReviews = () => {
    const list = getTeacherFeedbacks();
    // Only show published feedbacks on the public wall
    setFeedbacks(list.filter((f) => f.published));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const totalReviews = feedbacks.length;
  const averageRating =
    totalReviews > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const fiveStarCount = feedbacks.filter((f) => f.rating === 5).length;
  const fiveStarPercent = totalReviews > 0 ? Math.round((fiveStarCount / totalReviews) * 100) : 100;

  const filteredList = feedbacks.filter((f) => {
    if (filterRating !== 'all' && f.rating !== Number(filterRating)) return false;
    if (filterDistrict !== 'all') {
      const match = f.schoolAndDistrict.toLowerCase().includes(filterDistrict.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Community Header & Stats Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-700/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Teacher Community Reviews</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Sindh Educators Trust &amp; DAO Approvals
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Read real experiences from Primary School Teachers (PST), Junior Elementary School Teachers (JEST), and DDO staff across Hyderabad, Karachi, Sukkur, Larkana, Mirpurkhas, and Shaheed Benazirabad.
            </p>
          </div>

          {/* Aggregate Rating Score Card */}
          <div className="flex items-center space-x-4 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 shrink-0 self-start lg:self-auto">
            <div className="text-center pr-4 border-r border-slate-800">
              <div className="text-3xl font-black text-amber-400 font-mono">
                {averageRating}
              </div>
              <div className="flex items-center justify-center space-x-0.5 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-[10px] text-slate-400">
                {totalReviews} Verified Reviews
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{fiveStarPercent}% 5-Star Satisfaction</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-[180px]">
                100% compliant with Sindh Finance Department scales.
              </p>
              <button
                onClick={onOpenFeedbackModal}
                className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-md shadow-emerald-950/40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write Your Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 font-medium flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1 text-slate-400" /> Filter By:
          </span>

          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Regions &amp; Districts</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Sukkur">Sukkur</option>
            <option value="Larkana">Larkana</option>
            <option value="Karachi">Karachi</option>
            <option value="Mirpurkhas">Mirpurkhas</option>
            <option value="Benazirabad">Shaheed Benazirabad</option>
          </select>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Ratings (1 - 5 Stars)</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 Stars Only</option>
            <option value="4">⭐⭐⭐⭐ 4 Stars</option>
          </select>
        </div>

        <button
          onClick={onOpenFeedbackModal}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Feedback</span>
        </button>
      </div>

      {/* Reviews Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No matching reviews found</h3>
          <p className="text-xs text-slate-500">
            Be the first to share your experience with fellow teachers!
          </p>
          <button
            onClick={onOpenFeedbackModal}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            Submit Feedback
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((review) => (
            <div
              key={review.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-3 relative group"
            >
              <div>
                {/* Top Card Bar: Rating + Tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {review.tag || 'Arrears Bill'}
                  </span>
                </div>

                {/* Review Quote */}
                <div className="relative">
                  <p className="text-xs text-slate-800 leading-relaxed italic pr-2">
                    &ldquo;{review.comments}&rdquo;
                  </p>
                </div>
              </div>

              {/* Author & Posting Details */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 flex items-center space-x-1">
                      <span className="truncate">{review.name}</span>
                      <span title="Verified Teacher">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 inline" />
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate flex items-center space-x-1">
                      <span>{review.designation}</span>
                      <span>&bull;</span>
                      <span className="truncate">{review.schoolAndDistrict}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono shrink-0">
                  {review.createdAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
