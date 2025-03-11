import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import type { StockNews } from '../lib/api';

interface NewsCardProps {
  news: StockNews;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-24 h-24">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">{news.source}</span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}
            </span>
          </div>
          <h3 className="font-semibold mb-2">{news.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{news.summary}</p>
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-sm text-primary hover:text-primary/80"
          >
            Read more
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;