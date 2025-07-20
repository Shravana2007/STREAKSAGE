import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Quote } from "@shared/schema";

interface MorningQuoteProps {
  highlighted?: boolean;
}

export default function MorningQuote({ highlighted = false }: MorningQuoteProps) {
  const { data: quote, isLoading } = useQuery<Quote>({
    queryKey: ["/api/quote/daily"],
  });

  if (isLoading) {
    return (
      <Card className={cn(
        "glass-effect rounded-2xl shadow-lg border border-white/20 animate-float",
        highlighted && "ring-4 ring-warm-orange/50"
      )}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-warm-orange to-forest rounded-full flex items-center justify-center flex-shrink-0">
              <Sun className="text-white h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-forest">Morning Wisdom 🌅</h3>
                <span className="text-sm text-sage">6:00 AM</span>
              </div>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quote) {
    return (
      <Card className={cn(
        "glass-effect rounded-2xl shadow-lg border border-white/20 animate-float",
        highlighted && "ring-4 ring-warm-orange/50"
      )}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-warm-orange to-forest rounded-full flex items-center justify-center flex-shrink-0">
              <Sun className="text-white h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-forest">Morning Wisdom 🌅</h3>
                <span className="text-sm text-sage">6:00 AM</span>
              </div>
              <p className="text-gray-600">No quote available for today.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "glass-effect rounded-2xl shadow-lg border border-white/20 animate-float",
      highlighted && "ring-4 ring-warm-orange/50"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-warm-orange to-forest rounded-full flex items-center justify-center flex-shrink-0">
            <Sun className="text-white h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-forest">Morning Wisdom 🌅</h3>
              <span className="text-sm text-sage">6:00 AM</span>
            </div>
            <blockquote className="font-crimson text-lg italic text-gray-700 mb-3">
              "{quote.text}"
            </blockquote>
            <div className="text-sm text-sage">
              — {quote.source}
              {quote.chapter && quote.verse && `, ${quote.chapter}, ${quote.verse}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
