"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Plus, Megaphone, BarChart3, Users } from "lucide-react";
import Link from "next/link";
import StatsArticles from "./stats-articles";

import RecentArticlesPendingViews from "./recent-articles-pending-views";

export default function DashboardContent({}) {
  // const router = useRouter();

  return (
    <div className="space-y-5 mt-4 ">
      {/* totol Article */}
      <StatsArticles />
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href={"/articles/add"}>
                <Plus className="w-4 h-4 mr-2" /> Add Article
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={"/ads/add"}>
                <Megaphone className="w-4 h-4 mr-2" /> New Ad
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={"/articles/drafts"}>
                <BarChart3 className="w-4 h-4 mr-2" /> Draft
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={"/users"}>
                <Users className="w-4 h-4 mr-2" /> Manage Users
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Articles & Pending Reviews */}
      <RecentArticlesPendingViews />
    </div>
  );
}
