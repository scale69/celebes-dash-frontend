import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTag } from "@/lib/axios/actions/tags/patch";
import { TagFormData } from "@/types/form-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditTag({ tagId, selectedTag, setShowEditDialog }: { tagId: string, selectedTag: TagFormData, setShowEditDialog: Dispatch<SetStateAction<boolean>> }) {


    const { register, reset, setValue, handleSubmit } = useForm<TagFormData>({
        defaultValues: {
            "name": ""
        }
    })
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (data: TagFormData) => {
            return updateTag(data, tagId);
        },
    })

    const handleEditTag = (data: TagFormData) => {
        // console.log(data);


        mutation.mutate(data,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["tags"] });
                    setShowEditDialog(false)
                    toast.success("Tag updated successfully!");
                },
            }
        );

    }
    useEffect(() => {
        if (!selectedTag) return
        reset({
            name: selectedTag.name ?? ""
        })

    }, [selectedTag, reset])
    const isSubmitting = mutation.isPending;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Tag</DialogTitle>
                <DialogDescription>
                    Update tag information
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleEditTag)}>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-tag-name">Tag Name</Label>
                        <Input
                            id="edit-tag-name"
                            placeholder="e.g., javascript"
                            {...register("name")}
                            required
                            onChange={(e) => {
                                setValue("name", e.target.value);
                            }}
                        />
                    </div>

                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowEditDialog(false)}
                    >
                        Cancel
                    </Button>
                    <Button disabled={isSubmitting} type="submit">Update Tag</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}