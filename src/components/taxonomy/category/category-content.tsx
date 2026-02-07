"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    Edit,
    ArrowLeft,
    Bookmark,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { fetchCategory } from "@/lib/axios/actions/category/get";
import { SkeletonTable } from "@/components/skeleton/table-skeleton";
import { Category, ChildrenCategory } from "@/types/data";
import EditCategory from "./edit-category";
import { useRouter } from "next/navigation";

type MergedCategory = Category | (ChildrenCategory & { parent?: string });

export default function CategoryContent() {
    const [categories, setCategories] = useState<MergedCategory[]>([]);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<MergedCategory | null>(null);

    const router = useRouter()
    const { data, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategory
    })

    useEffect(() => {
        if (data && Array.isArray(data)) {
            // Gabungkan kategori dengan children-nya menjadi 1 array flat dan simpan di categories
            const mergedCategories = data.reduce((acc: MergedCategory[], category: Category) => {
                acc.push(category);
                if (category.children && category.children.length > 0) {
                    // Tambahkan children sebagai item terpisah
                    acc.push(...category.children.map(child => ({
                        ...child,
                        parent: category.name // optional, penanda parent jika dibutuhkan
                    })));
                }
                return acc;
            }, []);
            setCategories(mergedCategories);
        }
    }, [data])

    if (isLoading) return <SkeletonTable />
    if (!data) return null

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
                    <h2 className="text-2xl font-bold">Category</h2>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Categories Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Color</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((itemCategpry) => (
                                    <TableRow key={itemCategpry.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Bookmark size={16} />
                                                <span className="font-medium">{itemCategpry.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{itemCategpry.slug}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-5 h-5 rounded-md "
                                                    style={{ backgroundColor: itemCategpry.color }}
                                                />
                                                <span>{itemCategpry.color}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedCategory(itemCategpry)
                                                            setCategoryDialog(true)
                                                        }}
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* Edit Category Dialog */}
                        <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
                            <DialogContent autoFocus={false} >
                                <DialogHeader>
                                    <DialogTitle>
                                        Edit Category
                                    </DialogTitle>
                                    <DialogDescription>
                                        "Update the category details below"
                                    </DialogDescription>
                                </DialogHeader>
                                {selectedCategory && (
                                    <EditCategory
                                        category={selectedCategory}
                                        setCategoryDialog={setCategoryDialog}
                                    />
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
