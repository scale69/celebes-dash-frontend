"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,

} from "@/components/ui/alert-dialog";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArticlesResponse, Category, ResultArtilce, Tag } from "@/types/data";
import { SkeletonTable } from "../skeleton/table-skeleton";
import NoData from "../layout/no-data";
import {
  deleteBySlugAction,
  fetchArticles,
} from "@/lib/axios/actions/articles";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PaginationComponent from "../layout/pagination";
import DeleteArticle from "./delete-article";
export default function ArticleContent() {
  const [showPreview, setShowPreview] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState<String>("");
  const [slug, setSlug] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>();



  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    const pg = Number(searchParams.get("page"));
    return isNaN(pg) || pg < 1 ? 1 : pg;
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery<ArticlesResponse>({
    queryKey: ["articles", page],
    queryFn: () => fetchArticles(page),
  });

  if (filteredArticles === "all") {
    setFilteredArticles("");
  }

  if (isLoading) return <SkeletonTable />;
  if (isError) return <SkeletonTable />;

  const handleDleteByID = async (slug: string) => {
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
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">All Article</h2>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between gap-2  md:gap-4 w-full items-start ">
            <div className="flex items-center gap-2">
              <Select
                value={String(filteredArticles) || "all"}
                onValueChange={(value) => setFilteredArticles(value as String)}
              >
                <SelectTrigger className="text-xs md:text-sm w-40">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Articles</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex md:flex-col  flex-col-reverse  lg:flex-row items-end md:items-center gap-2 md:gap-4">
              <span className="text-xs lg:text-sm text-muted-foreground">
                {data?.count} articles
              </span>
              <Button variant="outline" asChild>
                <Link href={"/articles/add"} className="text-xs md:text-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Article
                </Link>
              </Button>
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
                <TableHead>Editor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.results
                .filter(
                  (article: ResultArtilce) =>
                    article.status === filteredArticles ||
                    filteredArticles === "",
                )
                .sort(
                  (a: ResultArtilce, b: ResultArtilce) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime(),
                )
                .map((article: ResultArtilce) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <span className="text-sm ">
                        {data.results
                          .filter(
                            (a: ResultArtilce) =>
                              a.status === filteredArticles ||
                              filteredArticles === "",
                          )
                          .sort(
                            (a: ResultArtilce, b: ResultArtilce) =>
                              new Date(b.updated_at).getTime() -
                              new Date(a.updated_at).getTime(),
                          )
                          .findIndex(
                            (item: ResultArtilce) => item.id === article.id,
                          ) + 1}
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
                    <TableCell className="max-w-[200px]  truncate">{article?.pewarta}</TableCell>
                    <TableCell>
                      {article?.editor}
                    </TableCell>
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
                      {new Date(article.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(article.updated_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
                            <Link href={`articles/edit/${article.slug}`}>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSlug(article.slug);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {data?.results.length === 0 && <NoData />}
          {data && <PaginationComponent data={data} />}
        </CardContent>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Article Preview</DialogTitle>
              <DialogDescription>
                Preview how this article will appear to readers
              </DialogDescription>
            </DialogHeader>

            {data?.results.map((article: ResultArtilce) => (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold leading-tight">
                    {article.title}
                  </h1>
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">By {article.pewarta}</span>
                    </div>
                    <div className="flex items-center gap-2"></div>
                  </div>
                </div>
              </div>
            ))}
          </DialogContent>
        </Dialog>
      </Card>

      {/* delete Article */}
      <AlertDialog
        open={!!showDeleteDialog}
        onOpenChange={(open) => setShowDeleteDialog(open)}
      >
        {slug && (
          <DeleteArticle
            slug={slug}
            setShowDeleteDialog={
              setShowDeleteDialog as React.Dispatch<
                React.SetStateAction<boolean>
              >
            }
          />
        )}
      </AlertDialog>
    </div>
  );
}
