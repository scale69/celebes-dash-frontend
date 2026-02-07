"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SkeletonArticles } from "../skeleton/article-skeleton";
import { ArticlesResponse, Category, ResultArtilce, Tag } from "@/types/data";
import { SkeletonTable } from "../skeleton/table-skeleton";
import NoData from "../layout/no-data";
import {
  bulkDeleteArticle,
  deleteBySlugAction,
  fetchArticles,
} from "@/lib/axios/actions/articles";
import { toast } from "sonner";
import { useDeleteAction } from "@/lib/axios/actions/delete-multiple";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function ArticleContent() {
  const [showPreview, setShowPreview] = useState(false);
  const [selected, setSelected] = useState<String[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<String>("");
  const queryClient = useQueryClient();

  const router = useRouter()





  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  const { mutate: deleteMutation } = useDeleteAction();

  if (filteredArticles === "all") {
    setFilteredArticles("");
  }

  if (isLoading) return <SkeletonTable />;
  if (isError) return <SkeletonTable />;





  // const showDeleteButton = () => {
  //   if (selected.length === 0) return false;

  //   // Ambil item yang dipilih
  //   const selectedItems = data.results.filter((item) =>
  //     selected.includes(item.id)
  //   );

  //   // 🔥 ADMIN: jika ada SATU artikel ditulis admin, tombol tampil
  //   if (selectedItems.some((item) => item.author.role === "admin")) {
  //     return true;
  //   }

  //   // ✍️ AUTHOR: hanya boleh jika SEMUA draft
  //   if (currentUserRole === "author") {
  //     return selectedItems.every((item) => item.status === "draft");
  //   }

  //   // Role lain tidak boleh
  //   return false;
  // };

  const handleBulkDelete = () => {
    if (selected.length === 0) {
      return toast.error("Tidak ada artikel yang di pilih");
    }
    deleteMutation({
      url: "articles/bulk-delete/",
      data: { ids: selected },
    });
    setSelected([]);
  };
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
          <h2 className="text-2xl font-bold">All Article</h2>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Select
                value={String(filteredArticles) || "all"}
                onValueChange={(value) => setFilteredArticles(value as String)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Articles</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
              {/* handle delete  select */}
              {/* {selected.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selected.length} selected
                </span>
                {showDeleteButton() && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkDelete()}
                  >
                    Delete
                  </Button>
                )}
              </div>
            )} */}
              {/* {selected.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selected.length} selected
                </span>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkDelete()}
                >
                  Delete
                </Button>
              </div>
            )} */}
            </div>
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
                {/* <TableHead className="w-12">
                  checkbox all  (nanti di perbaiki untuk pengemabngan yang baik)
                  <Checkbox
                  checked={
                    selected.length === data.results.length &&
                    data.results.length > 0
                  }
                  onCheckedChange={(checked) =>
                    setSelected(
                      checked
                        ? data.results.map((a: ResultArtilce) => a.id)
                        : []
                    )
                  }
                />
                </TableHead> */}
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
                    article.status === filteredArticles || filteredArticles === ""
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
                                a.status === filteredArticles || filteredArticles === ""
                            )
                            .sort(
                              (a: ResultArtilce, b: ResultArtilce) =>
                                new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                            )
                            .findIndex((item: ResultArtilce) => item.id === article.id) + 1
                        }
                      </span>

                    </TableCell>
                    {/* <TableCell>
                      <Checkbox
                      checked={selected.includes(String(article.id))}
                      onCheckedChange={(checked) =>
                        setSelected((prev: String[]) =>
                          checked
                            ? [...prev, article.id]
                            : prev.filter((id: String) => id !== article.id)
                        )
                      }
                    />
                    </TableCell> */}
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
                    {/* <TableCell>
                    {article.tags.map((tag: Tag) => (
                      <Badge key={tag.id}
                        className="border-dashed text-[10px] rounded-sm"
                        variant="outline"
                      >
                        {tag.name || "No tags"}
                      </Badge>
                    ))}
                  </TableCell> */}
                    <TableCell>{article.pewarta}</TableCell>
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
                            <Link href={`articles/edit/${article.slug}`} >
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                          //  onClick={() => handlePreview(article)}
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

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Article Preview</DialogTitle>
              <DialogDescription>
                Preview how this article will appear to readers
              </DialogDescription>
            </DialogHeader>

            {/* {previewArticle && ( */}
            {data.results.map((article: ResultArtilce) => (
              <div className="space-y-6">
                {/* Article Header */}
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold leading-tight">
                    {article.title}
                  </h1>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        By {article.pewarta}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <Badge
                        variant="outline"
                        style={{
                          borderColor: categories.find(
                            (c) => c.slug === previewArticle.category
                          )?.color,
                        }}
                      >
                        {previewArticle.category}
                      </Badge> */}
                    </div>
                    <div>
                      {/* {new Date(previewArticle.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )} */}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>
                        {/* {previewArticle.views?.toLocaleString() || 0} views */}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                {/* {previewArticle.featuredImage && (
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={previewArticle.featuredImage}
                      alt={previewArticle.title}
                      className="w-full h-auto object-cover max-h-96"
                    />
                  </div>
                )} */}

                {/* Article Content */}
                {/* <div className="prose prose-sm max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: previewArticle.content || '<p>No content available</p>'
                    }}
                    className="text-base leading-relaxed"
                  />
                </div> */}

                {/* Tags if available */}
                {/* {previewArticle.tags && previewArticle.tags.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {previewArticle.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* Status Badge */}
                {/* <div className="pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge
                      variant={
                        previewArticle.status === "published"
                          ? "default"
                          : previewArticle.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {previewArticle.status}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                  >
                    Close Preview
                  </Button>
                </div> */}
              </div>
            ))}
            {/* )} */}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        {/* <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Article</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this article? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteArticle}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}
      </Card>
    </div>

  );
}

// <ul>
//     {data.map((data)=> (
//         <li>
//             今日 {data.date}
//         </li>
//     ))}
// </ul>
