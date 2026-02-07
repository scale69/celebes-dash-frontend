"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { SkeletonArticles } from "../skeleton/article-skeleton";
import { ResultArtilce } from "@/types/data";
import { Badge } from "@/components/ui/badge";
import { fetchArticles } from "@/lib/axios/actions/articles";
export default function RecentArticlesPendingViews() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  if (isLoading) return <SkeletonArticles />;
  if (isError) return <SkeletonArticles />;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Articles</CardTitle>
            <CardDescription>Latest published content</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href={"/articles"}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.results
              .slice(0, 5)
              .filter((article: ResultArtilce) => article.status == "published")
              .map((article: ResultArtilce) => (
                <div
                  key={article.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors border-2"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">
                      {article.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {article?.author?.username} • {article?.category?.name}
                    </p>
                  </div>
                  <Badge variant={"default"}>{article.status}</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Draft Reviews</CardTitle>
          <CardDescription>Items awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 ">
            {data.results
              .filter((article: ResultArtilce) => article.status === "draft")
              .map((article: ResultArtilce) => (
                <div
                  key={article.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-transparent dark:border-foreground"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate ">
                      {article.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Submitted by {article?.author?.username}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
