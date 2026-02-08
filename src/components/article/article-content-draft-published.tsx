"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ResultArtilce } from "@/types/data";
import { SkeletonTable } from "../skeleton/table-skeleton";
import NoData from "../layout/no-data";
import {
  deleteBySlugAction,
  fetchArticles,
} from "@/lib/axios/actions/articles";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";


export default function ArticleContentDraftAndPublished({ status, title }: { status: string, title: string }) {
  const [filteredArticles, setFilteredArticles] = useState<String>("");
  const queryClient = useQueryClient();
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = useMemo(() => {
    const pg = Number(searchParams.get("page"))
    return isNaN(pg) || pg < 1 ? 1 : pg
  }, [searchParams])


  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: () => fetchArticles(page),
  });

  if (filteredArticles === "all") {
    setFilteredArticles("");
  }

  if (isLoading) return <SkeletonTable />;
  if (isError) return <SkeletonTable />;



  const handleDleteByID = async (slug: string) => {
    console.log(slug);
    try {
      const data = await deleteBySlugAction(slug);
      toast.success("Berhasil menghapus data");
      // Kalau perlu, refresh data atau invalidate query react-query di sini
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch (error: any) {
      // Ambil message dari error yang dilempar deleteBySlugAction
      const message = "Hanya admin yang bisa menghapus data publish";
      toast.error(message);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {data.results.length} articles
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results
                .filter(
                  (article: ResultArtilce) =>
                    article.status === status
                ).sort((a: ResultArtilce, b: ResultArtilce) =>
                  new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                )
                .map((article: ResultArtilce) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <span className="text-sm ">

                        {
                          data.results
                            .filter(
                              (a: ResultArtilce) =>
                                a.status === status
                            )
                            .sort(
                              (a: ResultArtilce, b: ResultArtilce) =>
                                new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                            )
                            .findIndex((item: ResultArtilce) => item.id === article.id) + 1
                        }
                      </span>

                    </TableCell>

                    <TableCell className="font-medium  max-w-[200px] truncate">
                      {article.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="border-dashed text-[10px] rounded-sm"
                        variant="outline"
                        style={{
                          borderColor: article?.category?.color,
                          color: article?.category?.color,
                        }}
                      >
                        {article.category?.name || "No Category"}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.author.username}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          article.status === "published"
                            ? "default"
                            : article.status === "draft"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {/* {status === "published" ? new Date(article.updated_at).toLocaleDateString() : new Date(article.created_at).toLocaleDateString()} */}
                      {new Date(article.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(article.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/articles/edit/${article.slug}`} >
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                           onClick={() => handlePreview(article)}
                          >
                            <Eye className="w-4 h-4 mr-2" /> Preview
                          </DropdownMenuItem> */}
                          <DropdownMenuSeparator />
                          {/* delete */}
                          <DropdownMenuItem
                            className="text-destructive"
                            asChild

                          >
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost">
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete

                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your article
                                    from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDleteByID(article.slug)}
                                  >Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {data.results.length === 0 && <NoData />}
          {/* <Pagination
            currentPage={articlePage}
            totalPages={totalPages}
            onPageChange={setArticlePage}
          /> */}
        </CardContent>
      </Card>
    </div>

  );
}
