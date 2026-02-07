import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Controller, useForm } from "react-hook-form";
import { AdsFormData } from "@/types/form-types";
import { Dispatch, SetStateAction, useState } from "react";
import { postAds } from "@/lib/axios/actions/ads/post";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Ads } from "@/types/data";

export default function EditAds({ selectedAds, adType, setEditingAd }: { selectedAds: Ads, adType: string, setEditingAd: Dispatch<SetStateAction<boolean>> }) {

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    console.log(selectedAds);


    const { register, handleSubmit, control, reset } = useForm<AdsFormData>({
        defaultValues: {
            name: "",
            placement: "",
            target_url: "",
            start_date: "",
            end_date: "",
            image: undefined,
            status: ""
        }
    })
    const queryClient = useQueryClient()


    const mutation = useMutation({
        mutationFn: (formData: FormData) => {
            return postAds(formData);
        },
    })


    const onSubmiting = (data: AdsFormData) => {

        const formData = new FormData()

        formData.append("name", data.name)
        formData.append("placement", data.placement)
        formData.append("target_url", data.target_url)
        formData.append("start_date", data.start_date)
        formData.append("end_date", data.end_date)
        formData.append("status", "false")

        console.log("Form Data (append):", {
            name: formData.get("name"),
            placement: formData.get("placement"),
            target_url: formData.get("target_url"),
            start_date: formData.get("start_date"),
            end_date: formData.get("end_date"),
            status: formData.get("status")
        });

        if (imageFile) {
            formData.append("image", imageFile)
        }



        mutation.mutate(formData, {
            onSuccess: (res) => {
                queryClient.invalidateQueries({ queryKey: ["ads"] });
                setEditingAd(false)
            }
        })





    }
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
                    <div className="mt-2">
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{ maxWidth: 240, maxHeight: 120, borderRadius: 8 }}
                            />
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
                </div>
            </div>
            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setEditingAd(false);
                    }}
                >
                    Cancel
                </Button>
                <Button type="submit">
                    Update Ad
                </Button>
            </DialogFooter>
        </form>
    )
}