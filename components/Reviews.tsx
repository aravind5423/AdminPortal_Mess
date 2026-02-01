
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, Check, X } from 'lucide-react';
import { ReviewService } from '../services/reviewService';
import { Review } from '../types';

const Reviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await ReviewService.getAllReviews();
            setReviews(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Feedback & Reviews</h2>
                    <p className="text-slate-500 text-sm">Student feedback on meals and services</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? <div className="col-span-full text-center text-slate-400 p-10">Loading Reviews...</div> :
                    reviews.length === 0 ? <div className="col-span-full text-center text-slate-400 p-10">No reviews found</div> :
                        reviews.map(review => (
                            <div key={review.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {review.creater?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">{review.creater?.name || 'Anonymous'}</p>
                                            <p className="text-xs text-slate-400">{review.dateTime || review.day}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-amber-50 text-amber-600 px-2 py-1 rounded text-xs font-bold gap-1">
                                        <Star size={12} fill="currentColor" /> {review.rating}
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 italic border border-slate-100">
                                    "{review.review}"
                                </div>

                                <div className="flex gap-2 mt-auto pt-2">
                                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-medium">{review.foodtype} - {review.food}</span>
                                    {review.solved && <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-medium flex items-center gap-1"><Check size={12} /> Resolved</span>}
                                </div>
                            </div>
                        ))}
            </div>
        </div>
    );
};

export default Reviews;
