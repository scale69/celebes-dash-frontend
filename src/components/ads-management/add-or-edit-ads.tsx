import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Controller, useForm } from "react-hook-form";
import { AdsFormData } from "@/types/form-types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { postAds } from "@/lib/axios/actions/ads/post";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Ads } from "@/types/data";
import { updateAds } from "@/lib/axios/actions/ads/patch";
import { X } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";



export default function AddOrEditAds({
    adType,
    adsData,
    setAdDialog,
    editingAd,
}: {
    adType: string;
    adsData: Ads;
    setAdDialog: Dispatch<SetStateAction<boolean>>;
    editingAd: boolean
}) {

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { register, handleSubmit, control, reset, setValue } = useForm<AdsFormData>({
        defaultValues: {
            name: "",
            placement: "",
            target_url: "",
            start_date: "",
            end_date: "",
            image: undefined,
            status: false
        }
    })
    const queryClient = useQueryClient()


    const mutation = useMutation({
        mutationFn: (formData: FormData) => {
            if (editingAd) {
                if (!adsData?.id) throw new Error("No slug found for article");
                return updateAds(formData, adsData.id);
            } else {
                return postAds(formData);
            }
        },
    })
    useEffect(() => {
        if (!adsData) return
        reset({
            name: adsData?.name || "",
            placement: adsData?.placement || "",
            target_url: adsData?.target_url || "",
            start_date: adsData?.start_date || "",
            status: typeof adsData?.status === "boolean" ? adsData.status : false,
            end_date: adsData?.end_date || "",

        })

        setImagePreview(adsData?.image || null);
        setImageFile(null);


    }, [adsData, reset])
    // Cleanup image preview
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const onSubmiting = (data: AdsFormData) => {
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("placement", data.placement)
        formData.append("target_url", data.target_url)
        formData.append("start_date", data.start_date)
        formData.append("end_date", data.end_date)
        formData.append("status", String(data.status))



        if (imageFile) formData.append("image", imageFile);
        if (!imageFile && imagePreview === null) formData.append("remove_image", "true");

        mutation.mutate(formData, {
            onSuccess: (res) => {
                queryClient.invalidateQueries({ queryKey: ["ads"] });
                setAdDialog(false)
            }
        })

    }


    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setValue("image", null as unknown as FileList);
    };

    const isSubmitting = mutation.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmiting)}>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">
                        Ad Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        {...register('name')}
                        id="name"
                        name="name"
                        placeholder="Enter ad name"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="placement">
                        Placement <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                        name="placement"
                        control={control}
                        rules={{ required: "Pilih lokasi iklan" }}
                        render={({ field, fieldState }) => (
                            <>
                                <Select key={field.value} value={field.value ?? ""} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full" aria-invalid={!!fieldState.error}>
                                        <SelectValue placeholder="Select placement" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="header">Header</SelectItem>
                                        <SelectItem value="inline">Inline</SelectItem>
                                        <SelectItem value="left sidebar">Left Sidebar</SelectItem>
                                        <SelectItem value="right sidebar">Right Sidebar</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && (
                                    <p className="text-destructive text-xs mt-1">{fieldState.error.message}</p>
                                )}
                            </>
                        )}
                    />

                </div>

                <div className="grid gap-2">
                    <Label htmlFor="imageUpload">
                        Image <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        required={!imagePreview}
                        {...register("image", {
                            onChange: (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file?.size > 1 * 1024 * 1024) {
                                    toast.error("File size must be less than 1MB");
                                    setValue("image", null as unknown as FileList);
                                    setImageFile(null);
                                    setImagePreview(null);
                                    return;
                                }
                                if (!file.type.startsWith("image/")) {
                                    toast.error("File must be an image");
                                    setImageFile(null);
                                    setImagePreview(null);
                                    e.target.value = "";
                                    return;
                                }
                                setImageFile(file); // <-- harus ditambahkan
                                setImagePreview(URL.createObjectURL(file));
                            }
                        })}
                    />
                    <div className="mt-2">
                        {imagePreview && (
                            <div className="relative border rounded-lg overflow-hidden">
                                <img src={imagePreview} alt="Preview" style={{ maxWidth: 240, maxHeight: 120, borderRadius: 8 }} />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Button type="button" size="icon" variant="destructive" onClick={handleRemoveImage} className="h-8 w-8">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Recommended size: {adType}px
                    </p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="targetUrl">
                        Target URL
                    </Label>
                    <Input
                        {...register('target_url')}
                        id="targetUrl"
                        placeholder="https://example.com"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="startDate">
                            Start Date <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="startDate"
                            type="date"
                            required
                            {...register('start_date')}

                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="endDate">
                            End Date <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="endDate"
                            {...register('end_date')}
                            type="date"
                            required
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Label htmlFor="status">Status</Label>
                        <Controller
                            name="status"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                                <Switch
                                    id="status"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setAdDialog(false);
                    }}
                >
                    Cancel
                </Button>
                <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? (<><Spinner data-icon="inline-start" /> Loading..</>) : editingAd ? "Update Ads" : "Create Ads"}
                </Button>
            </DialogFooter>
        </form>
    )
}