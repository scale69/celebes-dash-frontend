import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, ChildrenCategory } from "@/types/data";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CategoryFormData } from "@/types/form-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCatogory } from "@/lib/axios/actions/category/patch";


// Define MergedCategory type locally since it is not imported from any module
type MergedCategory = Category | (ChildrenCategory & { parent?: string });

interface AddOrEditCategoryProps {
    category: MergedCategory;
    setCategoryDialog: Dispatch<SetStateAction<boolean>>;
}



export default function EditCategory({ category, setCategoryDialog }: AddOrEditCategoryProps) {
    const { register, reset, setValue, handleSubmit, watch } = useForm<CategoryFormData>({
        defaultValues: {
            "color": "#01b29d"
        }
    })
    const color = watch("color")
    const queryClient = useQueryClient()


    const mutation = useMutation({
        mutationFn: (data: CategoryFormData) => {
            return updateCatogory(data, category.id);
        },
    })

    const onSubmit = (data: CategoryFormData) => {

        if (!category?.id) {
            toast.error("Category ID is missing.");
            return;
        }
        mutation.mutate(data,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["categories"] });
                    setCategoryDialog(false);
                    toast.success("Category updated successfully!");
                },
            }
        );

    }

    useEffect(() => {
        if (!category) return
        reset({
            color: category.color ?? "#01b29d"
        })

    }, [category, reset])
    return (
        <div className=''>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">

                    <div className="grid gap-2">
                        <Label htmlFor="color">
                            Color <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id={"color"}
                                type="color"
                                className="w-20 h-10"
                                value={color}
                                onChange={(e) => {
                                    setValue("color", e.target.value);
                                }}
                            />
                            <Input
                                type="text"
                                value={color}
                                placeholder="#3b82f6"
                                className="flex-1"
                                {...register("color", { required: true })}
                                onChange={(e) => {
                                    // When typing hex, update the color picker as well
                                    setValue("color", e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`);
                                }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Color for category badge and identification
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setCategoryDialog(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        Update Category
                    </Button>
                </DialogFooter>
            </form>

        </div>
    )
}