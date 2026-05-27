import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, color = 'text-amber-400', onSelect }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 fill-current ${color} ${onSelect ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => onSelect && onSelect(i)}
        />
      );
    } else if (value >= i - 0.5) {
      stars.push(
        <span key={i} className="relative inline-block">
          <Star className="w-5 h-5 text-slate-300 dark:text-slate-700" />
          <span className="absolute top-0 left-0 w-1/2 overflow-hidden fill-current">
            <StarHalf className={`w-5 h-5 fill-current ${color}`} />
          </span>
        </span>
      );
    } else {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 text-slate-300 dark:text-slate-700 ${onSelect ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => onSelect && onSelect(i)}
        />
      );
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">{stars}</div>
      {text && <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{text}</span>}
    </div>
  );
};

export default Rating;
