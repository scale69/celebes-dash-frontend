"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Users as UsersIcon,
    Shield,

} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/data";
import AddOrEditUser from "./add-or-edit-user";
import { fetchUser } from "@/lib/axios/actions/users/get";




export default function UsersContent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [dataUser, setDataUser] = useState<User>()

    const superAdmin = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL

    const { data, isPending, isError } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUser,
    });
    useEffect(() => {
    }, [roleFilter, data, searchQuery]);

    // Filter users
    if (!data) return
    const filteredUsers = data.results.filter((user: User) => {
        // Exclude super admin
        if (user.email === superAdmin) return false;
        // Role filter
        if (roleFilter !== "all" && user.role !== roleFilter) return false;
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                user.username?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query)
            );
        }
        return true;
    });
    // Handlers
    const handleDeleteUser = (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        // setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("User deleted successfully!");
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setIsDialogOpen(true);
        setDataUser(data.results)
    };

    const handleEditUser = (user: any) => {
        setEditingUser(user);
        setIsDialogOpen(true);
    };

    const handleSaveUser = (formData: any) => {
        // if (editingUser) {
        //     // Update existing user
        //     setUsers((prev) =>
        //         prev.map((u) =>
        //             u.id === editingUser.id ? { ...u, ...formData } : u
        //         )
        //     );
        //     toast.success("User updated successfully!");
        // } else {
        //     // Add new user
        //     const newUser = {
        //         id: String(users.length + 1),
        //         ...formData,
        //         avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
        //         articlesCount: 0,
        //         createdAt: new Date().toISOString().split("T")[0],
        //         lastLogin: new Date().toISOString(),
        //     };
        //     setUsers((prev) => [newUser, ...prev]);
        //     toast.success("User created successfully!");
        // }
        // setIsDialogOpen(false);
        // setEditingUser(null);
    };


    if (isPending) return <p>Loading...</p>;
    if (isError) return <p>Error...</p>;


    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold">Users Management</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage user accounts, roles, and permissions
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={handleAddUser}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add User
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="All Roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="author">Author</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {filteredUsers.length} users
                            </span>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-9 w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Users Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers
                                .filter((user: User) => user.email !== superAdmin)
                                .map((user: User) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <p className="font-medium">{user.username}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                            >
                                                {user.role === "admin" && (
                                                    <Shield className="w-3 h-3 mr-1" />
                                                )}
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>

                    {/* Empty State */}
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium">No users found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}

                </CardContent>
            </Card>

            {/* User Dialog */}
            <AddOrEditUser
                user={dataUser}
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setEditingUser(null);
                }}
                editingUser={editingUser}
                onSave={handleSaveUser}
            />
        </>
    );
}
