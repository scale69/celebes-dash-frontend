import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteAds } from "@/lib/axios/actions/ads/delete"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"


export default function DeleteAds({ adsId, setShowDeleteDialog }: { adsId: string, setShowDeleteDialog: Dispatch<SetStateAction<boolean>> }) {


    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id: string) => {
            return deleteAds(id);
        },
    })

    const handleDeleteTag = (id: string) => {
        mutation.mutate(id,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["ads"] });
                    setShowDeleteDialog(false)
                    toast.success("Ad deleted successfully!");
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
                    onClick={() => handleDeleteTag(adsId)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isSubmitting}
                >
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>

    )
}