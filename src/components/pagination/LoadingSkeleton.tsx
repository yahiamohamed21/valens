import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/SvgIcons";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton: React.FC = () => {
  const skeletonArray = Array.from({ length: 8 }); // 8 placeholders
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {skeletonArray.map((_, idx) => (
        <div key={idx} className="flex flex-col gap-2 p-4 bg-card-bg rounded-xl shadow-sm animate-pulse">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-full" />
        </div>
      ))}
    </div>
  );
};
