"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    DialogFooter,
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


import { Label } from "@/components/ui/label";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Tag as TagIcon,
    Hash,
} from "lucide-react";
import { toast } from "sonner";
import { fetchTags } from "@/lib/axios/actions/tags/get";
import { useQuery } from "@tanstack/react-query";
import { Tag } from "@/types/data";
import { SkeletonTable } from "@/components/skeleton/table-skeleton";
import AddTag from "./add-tag";
import DeleteTag from "./delete-tag";
import EditTag from "./edit-tag";
import { TagFormData } from "@/types/form-types";
import { useSearchParams } from "next/navigation";
import PaginationComponent from "@/components/layout/pagination";



export default function TagsContent() {
    // const [tags, setTags] = useState(dummyTags);
    const [searchQuery, setSearchQuery] = useState("");

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Form states
    const [editingTag, setEditingTag] = useState(null);
    const [tagId, setTagId] = useState<string>("");
    const [selectedTag, setSelectedTag] = useState<TagFormData>();

    const searchParams = useSearchParams()

    const page = useMemo(() => {
        const pg = Number(searchParams.get("page"))
        return isNaN(pg) || pg < 1 ? 1 : pg
    }, [searchParams])

    const { data, isLoading } = useQuery({
        queryKey: ["tags", page],
        queryFn: () => fetchTags(page)
    })

    // Filter tags
    // const filteredTags = data.filter((tag: Tag) =>
    //     tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );



    // Handlers


    const handleEditClick = (tag: any) => {
        setEditingTag(tag);
        // setFormData({
        //     name: tag.name,
        //     color: tag.color,
        // });
        setShowEditDialog(true);
    };

    const handleEditTag = (e: any) => {
        // e.preventDefault();
        // setTags(
        //     tags.map((tag) =>
        //         tag.id === editingTag.id
        //             ? {
        //                 ...tag,
        //                 name: formData.name.toLowerCase().trim(),
        //                 slug: formData.name.toLowerCase().trim().replace(/\s+/g, "-"),
        //                 color: formData.color,
        //             }
        //             : tag
        //     )
        // );
        // toast.success("Tag updated successfully!");
        // setShowEditDialog(false);
        // setEditingTag(null);
        // setFormData({ name: "", color: "#3b82f6" });
    };

    const handleDeleteClick = (id: string) => {
        setTagId(id);
        setShowDeleteDialog(true);
    };

    const handleDeleteTag = () => {
        // setTags(tags.filter((tag) => tag.id !== deleteTagId));
        // toast.success("Tag deleted successfully!");
        // setShowDeleteDialog(false);
        // setDeleteTagId(null);
    };

    const handleBulkDelete = () => {
        // if (selectedTags.length === 0) {
        //     toast.error("No tags selected");
        //     return;
        // }
        // setTags(tags.filter((tag) => !selectedTags.includes(tag.id)));
        // toast.success(`${selectedTags.length} tags deleted!`);
        // setSelectedTags([]);
    };

    // Calculate total articles
    // const totalArticles = data.reduce((sum : number, tag : Tag) => sum + tag.articleCount, 0);

    if (isLoading) return <SkeletonTable />
    if (!data) return null

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Tags</h2>
                    <p className="text-muted-foreground">
                        Manage article tags
                    </p>
                </div>
                {/* <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Tag
                </Button> */}
            </div>



            {/* Tags Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* <div className="flex items-center gap-2">
                            {selectedTags.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        {selectedTags.length} selected
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={handleBulkDelete}
                                    >
                                        Delete Selected
                                    </Button>
                                </div>
                            )}
                        </div> */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {data.length} tags
                            </span>
                            {/* search button */}
                            {/* <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search tags..."
                                    className="pl-9 w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div> */}
                        </div>
                    </div>
                </CardHeader>
                <CardContent >
                    <Table >
                        <TableHeader>
                            <TableRow>
                                {/* <TableHead className="w-12">
                                    <Checkbox
                                    checked={
                                        selectedTags.length === data.length &&
                                        data.length > 0
                                    }
                                    onCheckedChange={(checked) =>
                                        setSelectedTags(
                                            checked ? filteredTags.map((t) => t.id) : []
                                        )
                                    }
                                    />
                                </TableHead> */}
                                <TableHead>Tag</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Articles</TableHead>
                                {/* <TableHead>Color</TableHead> */}
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody >
                            {data?.results.map((tag: Tag) => (
                                <TableRow key={tag.id} >
                                    {/* <TableCell>
                                        <Checkbox
                                        checked={selectedTags.includes(tag.id)}
                                        onCheckedChange={(checked) =>
                                            setSelectedTags((prev) =>
                                                checked
                                                    ? [...prev, tag.id]
                                                    : prev.filter((id) => id !== tag.id)
                                            )
                                        }
                                        />
                                    </TableCell> */}
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className="border"
                                        >
                                            <TagIcon className="w-3 h-3 mr-1" />
                                            {tag.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm text-muted-foreground">
                                        {tag.slug}
                                    </TableCell>
                                    <TableCell>
                                        {tag.articles.length}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedTag(tag)
                                                    setTagId(tag.id)
                                                    setShowEditDialog(true)
                                                }}>
                                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDeleteClick(tag.id)}
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

                    {data.length === 0 && (
                        <div className="text-center py-12">
                            <TagIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium">No tags found</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                {searchQuery
                                    ? "Try adjusting your search"
                                    : "Create your first tag to get started"}
                            </p>
                        </div>
                    )}
                </CardContent>
                {data && (
                    <PaginationComponent
                        data={data}
                    />
                )}
            </Card>

            {/* Add Tag Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Tag</DialogTitle>
                        <DialogDescription>
                            Create a new tag for categorizing articles
                        </DialogDescription>
                    </DialogHeader>
                    <AddTag setShowAddDialog={setShowAddDialog} />

                </DialogContent>
            </Dialog>

            {/* Edit Tag Dialog */}
            {selectedTag && (
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <EditTag selectedTag={selectedTag} tagId={tagId} setShowEditDialog={setShowEditDialog} />
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DeleteTag tagId={tagId} setShowDeleteDialog={setShowDeleteDialog} />
            </AlertDialog>
        </div>
    );
}
