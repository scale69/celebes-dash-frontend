import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { UserFormData } from "@/types/form-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/lib/axios/actions/users/patch";
import { postUser } from "@/lib/axios/actions/users/post";
import { toast } from "sonner";

export default function AddOrEditUser({ user, isOpen, onClose, onSave, editingUser }: any) {



    const queryClient = useQueryClient()


    const { register, handleSubmit, control, reset } = useForm<UserFormData>({
        defaultValues: {
            username: "",
            email: "",
            role: "author",
            phone_number: null
        }
    })


    const mutation = useMutation({
        mutationFn: (data: UserFormData) => {
            return postUser(data);
        },
    })

    // const mutation = useMutation({
    //     mutationFn: (formData: UserFormData) => {
    //         if (editingUser) {
    //             if (!user?.id) throw new Error("No slug found for article");
    //             return updateUser(formData, user.id);
    //         } else {
    //             return postUser(formData);
    //         }
    //     },
    // })



    const onSubmit = (data: UserFormData) => {

        console.log(data);

        mutation.mutate(data, {
            onSuccess: (res) => {
                queryClient.invalidateQueries({ queryKey: ["users"] });
                toast.success("User created successfully!");
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
                    <DialogDescription>
                        {user
                            ? "Update user information and permissions"
                            : "Create a new user account"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Full Name *</Label>
                                <Input
                                    id="username"
                                    {...register("username")}
                                    placeholder="La Ege"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="la.ege@gmail.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Role *</Label>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <Select key={field.value} value={field.value ?? ""} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full max-w-48">
                                                <SelectValue placeholder="Author" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="author">Author</SelectItem>
                                            </SelectContent>
                                        </Select>

                                    )}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="number"
                                placeholder="0823********"
                                {...register("phone_number", { valueAsNumber: true })}

                            />
                        </div>


                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {user?.id ? "Update User" : "Create User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}