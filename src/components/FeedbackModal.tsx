import React, { useState } from 'react';
import { Star, X, Check, Send } from 'lucide-react';
import { EmployeeData } from '../types';
import { saveTeacherFeedback } from '../utils/feedbackStorage';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeData;
  onFeedbackSubmitted?: (published: boolean) => void;
  title?: string;
  subtitle?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  employee,
  onFeedbackSubmitted,
  title = 'Quick Feedback',
  subtitle = 'How was your arrears calculation and bill export?',
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>(employee.name || '');
  const [comments, setComments] = useState<string>('');
  const [shouldPublish, setShouldPublish] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const designation = `${employee.designation || 'Teacher'} (BPS-${employee.bps || 14})`;
  const schoolAndDistrict = `${employee.schoolName || 'Govt School'}, ${employee.district || 'Sindh'}`;
  const tag = employee.bps === 14 && employee.designation.toLowerCase().includes('jest') ? 'JEST Arrears' : 'PST Arrears';

  const ratingLabels: Record<number, string> = {
    1: 'Needs Work',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Accurate & Excellent!',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    if (!comments.trim()) {
      alert('Please enter your feedback or comments.');
      return;
    }

    setIsSubmitting(true);

    try {
      saveTeacherFeedback({
        name: name.trim(),
        designation: designation.trim(),
        schoolAndDistrict: schoolAndDistrict.trim(),
        rating,
        comments: comments.trim(),
        tag,
        published: shouldPublish,
      });

      setIsSubmitted(true);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(shouldPublish);
      }

      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Failed to save feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden my-6">
        
        {/* Minimal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="p-6 text-center space-y-2">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Thank you, {name}!</h3>
            <p className="text-xs text-slate-500">
              Your feedback has been recorded.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            {/* Star Rating */}
            <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 transition hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-semibold text-emerald-700">
                {ratingLabels[hoverRating || rating]}
              </span>
            </div>

            {/* Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Teacher Name"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Comments */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Feedback / Experience
              </label>
              <textarea
                required
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Bill accuracy, calculation correctness, or suggestions..."
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Minimal Publish checkbox */}
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={shouldPublish}
                onChange={(e) => setShouldPublish(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-600">
                Show on Community Reviews wall
              </span>
            </label>

            {/* Minimal Actions */}
            <div className="pt-1 flex items-center justify-end space-x-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>{isSubmitting ? 'Sending...' : 'Submit'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

