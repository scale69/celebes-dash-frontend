"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Tag } from "lucide-react";
import { useUser } from "@/lib/axios/actions/users/useUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editArticle, getArticleBySlug, postArticle } from "@/lib/axios/actions/articles";
import { Badge } from "../ui/badge";
import { SkeletonFormArticles } from "../skeleton/article-skeleton";
import FormCategory from "./form/form-category";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { lazy } from "react";

const RichTextEditor = lazy(() => import("../RichTextEditor")); // lazy load

type ArticleForm = {
    title: string;
    content: string;
    category_slug: string;
    image?: FileList;
    status: string;
    pewarta: string;
    image_description: string;
};

export default function AddArticleOrEditArticle({ slug, title }: { slug: string, title: string }) {
    const pathname = usePathname();
    const isEdit = pathname.includes("edit");
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useUser();

    // Form
    const { register, handleSubmit, control, setValue, reset } = useForm<ArticleForm>({
        defaultValues: {
            title: "",
            content: "",
            status: "",
            category_slug: "",
            pewarta: "",
            image_description: "",
            image: undefined,
        },
    });

    // State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState("");
    const [tagData, setTagData] = useState<string[]>([]);

    // Query article
    const { data, isLoading, isError } = useQuery({
        queryKey: ["get-article-by-slug", slug],
        queryFn: () => getArticleBySlug(slug),
        enabled: isEdit,
        retry: false,
    });

    // Memoize tags
    const initialTags = useMemo(() => {
        if (!data?.tags) return [];
        return data.tags.map((t: any) => t.name);
    }, [data]);

    // Reset form when data ready
    useEffect(() => {
        if (!data) return;

        reset({
            title: data.title ?? "",
            content: data.content ?? "",
            status: data.status ?? "",
            pewarta: data.pewarta ?? "",
            image_description: data.image_description ?? "",
            category_slug: data.category?.slug ?? "",
        });

        setTagData(initialTags);
        setImagePreview(data?.image || null);
        setImageFile(null);
    }, [data, reset, initialTags]);

    // Cleanup image preview
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    // Mutation
    const mutation = useMutation({
        mutationFn: (formData: FormData) => {
            if (isEdit) {
                if (!data?.slug) throw new Error("No slug found for article");
                return editArticle(formData, data.slug);
            } else {
                return postArticle(formData);
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
    });

    const onSubmit = (form: ArticleForm) => {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("content", form.content);
        formData.append("status", form.status);
        formData.append("pewarta", form.pewarta);
        formData.append("image_description", form.image_description);
        formData.append("category_slug", form.category_slug === "umum" ? "" : form.category_slug);
        tagData.forEach((tag) => formData.append("tag_names", tag));
        if (imageFile) formData.append("image", imageFile);
        if (!imageFile && imagePreview === null) formData.append("remove_image", "true");

        mutation.mutate(formData, {
            onSuccess: () => router.push("/articles"),
        });
    };

    const handleAddTag = (e: any) => {
        e.preventDefault();
        const tag = tagInput.trim().toLowerCase();
        if (!tag) return;
        if (tagData.includes(tag)) return toast.error("Tag already exists");
        if (tagData.length >= 10) return toast.error("Maximum 10 tags allowed");
        setTagData([...tagData, tag]);
        setTagInput("");
        toast.success("Tag added");
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTagData(tagData.filter((t) => t !== tagToRemove));
    };

    const handleTagKeyPress = (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag(e);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setValue("image", undefined);
    };

    if (isEdit && isLoading) return <SkeletonFormArticles />;
    if (isEdit && isError) return <div>Failed to load article</div>;

    const isSubmitting = mutation.isPending;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">{title}</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{data?.title}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                            <Input id="title" {...register("title")} required />
                        </div>

                        {/* Content */}
                        <div className="grid gap-2">
                            <Label>Content <span className="text-destructive">*</span></Label>
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <Suspense fallback={<div>Loading editor...</div>}>
                                        <RichTextEditor content={field.value ?? ""} onChange={field.onChange} />
                                    </Suspense>
                                )}
                            />
                        </div>

                        {/* Category & Status */}
                        <div className="flex flex-col gap-5">
                            <div className="flex gap-20">
                                <Controller
                                    name="category_slug"
                                    control={control}
                                    render={({ field }) => (
                                        <FormCategory value={field.value} onChange={field.onChange} />
                                    )}
                                />

                                {user?.role === "admin" && (
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="published">Published</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Pewarta */}
                        <div className="grid gap-2">
                            <Label htmlFor="pewarta">Pewarta</Label>
                            <Input id="pewarta" {...register("pewarta")} required />
                        </div>

                        {/* Tags */}
                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags</Label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="tags"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={handleTagKeyPress}
                                            placeholder="Enter tag and press Enter"
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button type="button" variant="outline" onClick={handleAddTag} disabled={!tagInput.trim()}>
                                        Add
                                    </Button>
                                </div>
                                {tagData.length > 0 && (
                                    <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                                        {tagData.map((tag, i) => (
                                            <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1 flex items-center gap-1">
                                                {tag}
                                                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="grid gap-2">
                            <Label htmlFor="featuredImage">Featured Image</Label>
                            {!imagePreview ? (
                                <div className="border-2 border-dashed rounded-lg p-6 hover:border-blue-500 transition-colors">
                                    <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Upload className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                    </label>
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        {...register("image", {
                                            onChange: (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setImageFile(file);
                                                setImagePreview(URL.createObjectURL(file));
                                            },
                                        })}
                                    />
                                </div>
                            ) : (
                                <div className="relative border rounded-lg overflow-hidden">
                                    <img src={imagePreview} alt="Preview" className="w-fit h-72 p-2 m-2 rounded-md border object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button type="button" size="icon" variant="destructive" onClick={handleRemoveImage} className="h-8 w-8">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Image Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="image_description">Description Image <span className="text-destructive">*</span></Label>
                            <Input id="image_description" {...register("image_description")} required />
                        </div>

                        {/* Submit */}
                        <div className=" w-full justify-end flex gap-3 pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : isEdit ? "Update Article" : "Create Article"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
