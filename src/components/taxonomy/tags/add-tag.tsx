import {
    DialogFooter,

} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTag } from "@/lib/axios/actions/tags/post";
import { toast } from "sonner";
import { TagFormData } from "@/types/form-types";
import { Dispatch, SetStateAction, useEffect } from "react";

export default function AddTag({ setShowAddDialog }: { setShowAddDialog: Dispatch<SetStateAction<boolean>> }) {
    const { register, reset, setValue, handleSubmit, watch } = useForm<TagFormData>({
        defaultValues: {
            "name": ""
        }
    })
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (data: TagFormData) => {
            return postTag(data);
        },
    })

    const handleAddTag = (data: TagFormData) => {
        // console.log(data);

        mutation.mutate(data,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["tags"] });
                    setShowAddDialog(false)
                    toast.success("Tag created successfully!");
                },
            }
        );

    }

    return (
        <form onSubmit={handleSubmit(handleAddTag)}>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="tag-name">Tag Name</Label>
                    <Input
                        id="tag-name"
                        placeholder="e.g., sultra"
                        {...register("name")}
                        required
                    />
                </div>
            </div>
            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                >
                    Cancel
                </Button>
                <Button type="submit">Create Tag</Button>
            </DialogFooter>
        </form>
    )
}