import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"
import { deleteBySlugAction } from "@/lib/axios/actions/articles"


export default function DeleteArticle({ slug, setShowDeleteDialog }: { slug: string, setShowDeleteDialog: Dispatch<SetStateAction<boolean>> }) {


    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (slug: string) => {
            return deleteBySlugAction(slug);
        },
    })

    const handleDeleteArticle = (slug: string) => {
        mutation.mutate(slug,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["articles"] });
                    setShowDeleteDialog(false)
                    toast.success("Article deleted successfully!");
                },
            }
        );
    }
    const isSubmitting = mutation.isPending;


    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete Article</AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure you want to delete this article? This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => handleDeleteArticle(slug)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (<><Spinner data-icon="inline-start" /> Loading..</>) : "Delete Article"}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>

    )
}