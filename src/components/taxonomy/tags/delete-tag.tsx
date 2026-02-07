import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteTag } from "@/lib/axios/actions/tags/delete"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"
export default function DeleteTag({ tagId, setShowDeleteDialog }: { tagId: string, setShowDeleteDialog: Dispatch<SetStateAction<boolean>> }) {


    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id: string) => {
            return deleteTag(id);
        },
    })

    const handleDeleteTag = (id: string) => {
        mutation.mutate(id,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["tags"] });
                    setShowDeleteDialog(false)
                    toast.success("Tag deleted successfully!");
                },
            }
        );
    }
    const isSubmitting = mutation.isPending;


    return (
        <AlertDialogContent>

            <AlertDialogHeader>
                <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to delete this tag? This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => handleDeleteTag(tagId)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isSubmitting}
                >
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>

    )
}