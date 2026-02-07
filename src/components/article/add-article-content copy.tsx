"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form"
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Image as ImageIcon, Plus, Tag } from "lucide-react";
import RichTextEditor from "../RichTextEditor";
import { useUser } from "@/lib/axios/actions/users/useUser";
import { useMutation } from "@tanstack/react-query";
import { postArticle } from "@/lib/axios/actions/articles";
import FormCategory from "./form/form-category";
import { Badge } from "../ui/badge";



type ArticleForm = {
    title: string;
    content: string;
    category_slug: string
    image?: FileList;
    tag_names?: string[]
};


export default function AddArticle() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState("");
    const [tagData, setTagData] = useState<string[]>([]);

    const router = useRouter();
    const { user } = useUser()



    const { register, handleSubmit, control } = useForm<ArticleForm>({
        defaultValues: {
            category_slug: "", // kosong default
        }
    })

    const mutattion = useMutation({
        mutationFn: postArticle
    })

    const onSubmit = (data: ArticleForm) => {

        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("category_slug", data.category_slug)
        formData.append("content", data.content)
        tagData.forEach((tag) => {
            formData.append("tag_names", tag);
        });

        if (formData.get("category_slug") == 'umum') {
            formData.append("category_slug", "")
        }
        if (data.image?.[0]) {
            formData.append("image", data.image[0]); // File asli
        }



        mutattion.mutate(formData, {
            onSuccess: (res) => {
                redirect('/articles')
            }
        })

    }

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
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
                    <h2 className="text-2xl font-bold">Add New Article</h2>
                    <p className="text-muted-foreground">
                        Create a new article for your news portal
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} >
                <Card>
                    <CardHeader>
                        <CardTitle>Article Details</CardTitle>
                        <CardDescription>
                            Fill in the information below to create a new article
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
                                    <RichTextEditor value={field.value} onChange={field.onChange} />
                                )

                                }
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            <Controller
                                name="category_slug"
                                control={control}
                                render={({ field }) => (
                                    <FormCategory value={field.value} onChange={field.onChange} />
                                )}
                            />


                            {/* author */}
                            <div className="flex space-x-4  items-center">
                                <Label htmlFor="author">
                                    Author :
                                </Label>
                                <span className="border text-sm w-max px-4 py-1 rounded-sm border-dashed">
                                    {user?.username}
                                </span>
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
                                            {...register("tag_names")}
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
                                            // onChange={handleFileChange}
                                            className="hidden"
                                            {...register("image", {
                                                onChange: (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setImagePreview(URL.createObjectURL(file));
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

                        <div className=" w-full justify-end flex gap-3 pt-4">
                            <Button type="submit"
                            >
                                Create Article
                                {/* {isSubmitting ? "Creating..." : "Create Article"} */}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
