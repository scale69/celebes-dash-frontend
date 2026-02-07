// "use client";

import {
  ArrowUpRight,
  Bookmark,
  FileText,
  Send,
  SquarePen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { SkeletonSats } from "@/components/skeleton/article-skeleton";
import { fetchArticleStats } from "@/lib/axios/actions/articles";

export default function StatsArticles() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["article-stats"],
    queryFn: fetchArticleStats,
  });

  if (isLoading) return <SkeletonSats />;
  if (isError) return <SkeletonSats />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 dark:bg-none dark:border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Total Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{data.total_article}</span>
            <SquarePen className="w-10 h-10 opacity-20" />
          </div>
        </CardContent>
      </Card>
      {/* totol Published */}
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 dark:bg-none dark:border ">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Published
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{data.total_published}</span>
            <Send className="w-10 h-10 opacity-20" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 dark:bg-none dark:border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Total Draft
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{data.total_draft}</span>
            <Bookmark className="w-10 h-10 opacity-20" />
          </div>
        </CardContent>
      </Card>
      {/* totol Total views */}
    </div>
  );
}
