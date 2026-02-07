"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form"
import { notFound, redirect, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Image as ImageIcon, Plus, Tag } from "lucide-react";
import RichTextEditor from "../RichTextEditor";
import { useUser } from "@/lib/axios/actions/users/useUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editArticle, getArticleBySlug, postArticle } from "@/lib/axios/actions/articles";
import { Badge } from "../ui/badge";
import { SkeletonFormArticles } from "../skeleton/article-skeleton";
import { ResultArtilce } from "@/types/data";
import FormCategory from "./form/form-category";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type ArticleForm = {
    title: string;
    content: string;
    category_slug: string
    image?: FileList;
    status: string
};


export default function AddArticleOrEditArticle({ slug, title }: { slug: string, title: string }) {
    const pathname = usePathname()
    const isEdit = pathname.includes("edit")
    const { data, isLoading, isError } = useQuery<ResultArtilce>({
        queryKey: ["get-article-by-slug", slug],
        queryFn: () => getArticleBySlug(slug),
        enabled: isEdit,
        retry: false,
    })
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState("");
    const [tagData, setTagData] = useState<string[]>([]);

    const router = useRouter();
    const { user } = useUser()
    const queryClient = useQueryClient();




    const { register, handleSubmit, control, setValue, reset } = useForm<ArticleForm>({
        defaultValues: {
            title: "",
            content: "",
            status: "",
            category_slug: "",
            image: undefined,
        },
    })

    const mutation = useMutation({
        mutationFn: (formData: FormData) => {
            if (isEdit) {
                if (!data?.slug) throw new Error("No slug found for article");
                return editArticle(formData, data.slug);
            } else {
                return postArticle(formData);
            }
        }
    });

    const onSubmit = (data: ArticleForm) => {

        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("content", data.content)
        formData.append("status", data.status)
        tagData.forEach((tag) => {
            formData.append("tag_names", tag);
        });
        formData.append("category_slug", data.category_slug)

        if (formData.get("category_slug") == 'umum') {
            formData.append("category_slug", "")
        }

        if (imageFile) {
            formData.append("image", imageFile)
        }
        if (imagePreview === null) {
            formData.append("remove_image", "true")
        }



        mutation.mutate(formData, {
            onSuccess: (res) => {
                queryClient.invalidateQueries({ queryKey: ["articles"] });
                redirect('/articles')
            }
        })

    }

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    // use effect edit
    useEffect(() => {
        if (!data) return;

        reset({
            title: data.title ?? "",
            content: data.content ?? "",
            status: data.status ?? "",
            category_slug: data.category?.slug ?? "",
        });

        setTagData(
            Array.isArray(data?.tags)
                ? data.tags.map((t: any) => t.name)
                : []
        );

        setImagePreview(data?.image || null);
        setImageFile(null);
    }, [data, reset]);

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setValue("image", undefined);
    };



    // }
    const handleAddTag = (e: any) => {
        e?.preventDefault();
        const tag = tagInput.trim().toLowerCase();


        if (!tag) return;

        if (tagData.includes(tag)) {
            toast.error("Tag already exists");
            return;
        }

        if (tagData.length >= 10) {
            toast.error("Maximum 10 tags allowed");
            return;
        }

        setTagData([...tagData, tag])
        setTagInput("")
        setTagInput("");
        toast.success("Tag added");
    };

    // Handle remove tag
    const handleRemoveTag = (tagToRemove: any) => {
        setTagData((tagData) => tagData.filter((tags: any) => tags !== tagToRemove))

    };

    // Handle tag input key press
    const handleTagKeyPress = (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag(e);
        }
    };



    if (isEdit && isLoading) {
        return <SkeletonFormArticles />;
    }

    if (isEdit && isError) {
        return <div>Failed to load article</div>;
    }

    const isSubmitting = mutation.isPending;





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
            <form onSubmit={handleSubmit(onSubmit)} >
                <Card>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>
                            {data?.title}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">
                                Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Enter article title"
                                {...register('title')}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>
                                Content <span className="text-destructive">*</span>
                            </Label>
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <RichTextEditor content={field.value ?? ""} onChange={field.onChange} />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex gap-20">
                                <Controller
                                    name="category_slug"
                                    control={control}
                                    render={({ field }) => (
                                        <FormCategory value={field.value} onChange={field.onChange} />
                                    )}
                                />
                                {isEdit && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">
                                            Status
                                        </Label>
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={(({ field }) => (
                                                <Select key={field.value} value={field.value ?? ""} onValueChange={field.onChange} >
                                                    <SelectTrigger className="w-full max-w-48">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent >
                                                        <SelectGroup  >
                                                            <SelectItem value={"draft"}>
                                                                Draft
                                                            </SelectItem>
                                                            <SelectItem value={"published"}>
                                                                Published
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            ))}
                                        />
                                    </div>
                                )}
                            </div>
                            {/* autor and editor */}
                            <div className="flex gap-5">
                                {/* author */}
                                <div className="flex space-x-4  items-center">
                                    <Label htmlFor="author">
                                        Author :
                                    </Label>
                                    <span className="border text-sm w-max px-4 py-1 rounded-sm border-dashed">
                                        {isEdit ? data?.author?.username : user?.username}
                                    </span>
                                </div>
                                {/* editor */}
                                {isEdit && (
                                    <div className="flex space-x-4  items-center">
                                        <Label htmlFor="author">
                                            Editor :
                                        </Label>
                                        <span className="border text-sm w-max px-4 py-1 rounded-sm border-dashed">
                                            {data?.editor}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Tags */}
                        <div className="grid gap-2">
                            <Label htmlFor="tags">
                                Tags
                            </Label>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="tags"
                                            placeholder="Enter tag and press Enter"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={handleTagKeyPress}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleAddTag}
                                        disabled={!tagInput.trim()}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add
                                    </Button>
                                </div>

                                {tagData.length > 0 && (
                                    <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                                        {tagData.map((tag, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="pl-3 pr-1 py-1 flex items-center gap-1"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Add up to 10 tags to help categorize your article. Press Enter or click Add button.
                                </p>
                            </div>
                        </div>

                        {/* Featured Image Upload */}
                        <div className="grid gap-2">
                            <Label htmlFor="featuredImage">Featured Image</Label>

                            {!imagePreview ? (
                                <div className="space-y-2">
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-colors">
                                        <label
                                            htmlFor="imageUpload"
                                            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                                        >
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    PNG, JPG, GIF up to 5MB
                                                </p>
                                            </div>
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
                                                    if (file?.size > 1 * 1024 * 1024) {
                                                        toast.error("File size must be less than 1MB");
                                                        return;
                                                    }
                                                    if (!file.type.startsWith("image/")) {
                                                        toast.error("File must be an image");
                                                        e.target.value = "";
                                                        return;
                                                    }
                                                    setImagePreview(URL.createObjectURL(file));
                                                    setImageFile(file); // <-- harus ditambahkan
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="relative border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-fit h-72 p-2 m-2 rounded-md border object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="destructive"
                                            onClick={handleRemoveImage}
                                            className="h-8 w-8"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className=" bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3">
                                        <p className="text-white text-sm font-medium truncate">
                                            {imageFile ? imageFile.name : "Image URL"}
                                        </p>
                                        <p className="text-white/70 text-xs">
                                            {imageFile
                                                ? `${(imageFile.size / 1024).toFixed(2)} KB`
                                                : "External URL"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {user?.role === "author" && isEdit && data?.status == "published" ? (
                            <div className=" w-full justify-end flex gap-3 pt-4">
                                <Button type="button" onClick={() => router.back()}
                                >
                                    Cencel
                                </Button>
                            </div>
                        ) : (
                            <div className=" w-full justify-end flex gap-3 pt-4">
                                <Button type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Updating..." : isEdit ? "Update Article" : "Create Article"}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
