"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    ImageOff,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAds } from "@/lib/axios/actions/ads/get";
import { SkeletonTable } from "../skeleton/table-skeleton";
import { updateStatusAds } from "@/lib/axios/actions/ads/patch";
import { Ads } from "@/types/data";
import { AlertDialog } from "../ui/alert-dialog";
import DeleteAds from "./delete-ads";
import AddOrEditAds from "./add-or-edit-ads";



type Props = {
    adsId: string;
    adsStatus: boolean;
    onStatusChange: (id: string, newStatus: boolean) => void;
};




export function StatusToggle({ adsId, adsStatus, onStatusChange }: Props) {
    const queryClient = useQueryClient();

    const [isChecked, setIsChecked] = useState(adsStatus);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsChecked(adsStatus);
    }, [adsStatus]);

    const handleToggle = async (value: boolean) => {
        setIsLoading(true);
        try {
            // Send the new status using FormData instead of a plain object
            const formData = new FormData();
            formData.append("status", value ? "true" : "false");
            await updateStatusAds(formData, adsId);
            setIsChecked(value);
            onStatusChange && onStatusChange(adsId, value);
            queryClient.invalidateQueries({ queryKey: ["ads"] });
            toast.success(`Ad status updated to ${value ? 'active' : 'inactive'}`);
        } catch (error) {
            setIsChecked(!value);
            toast.error("Failed to update ad status");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Switch
            checked={isChecked}
            onCheckedChange={handleToggle}
            disabled={isLoading}
        />
    );
}



export default function AdsManagementContent({ adType = "header" }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [adDialog, setAdDialog] = useState(false);
    const [editingAd, setEditingAd] = useState<boolean>();
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>();
    const [adsId, setAdsId] = useState<string>();
    const [adsData, setAdsData] = useState<Ads>();


    const { data, isLoading } = useQuery({
        queryKey: ["ads"],
        queryFn: fetchAds
    })



    const adTypeLabels = {
        header: "Header Ads",
        sidebar: "Sidebar Ads",
        inline: "Inline Ads",
    };

    const adTypeDimensions = {
        header: "800x200",
        sidebar: "300x600",
        inline: "600x300",
    };


    const handleEdit = (ad: any) => {
        setEditingAd(ad);
        setAdDialog(true);
    };



    useEffect(() => {
        if (data) setAdsData(data);
    }, [data]);



    const handleStatusChange = (id: string, newStatus: boolean) => {
        setAdsData((prev) => {
            if (!prev) return prev;
            // If prev is an array (expected, but see lint warning), update matching ad
            if (Array.isArray(prev)) {
                return prev.map((ad: any) =>
                    ad.id === id ? { ...ad, status: newStatus } : ad
                );
            }
            // If prev is a single ad object, check if it matches
            if ((prev as any).id === id) {
                return { ...(prev as any), status: newStatus };
            }
            // Otherwise, return prev as is
            return prev;
        });
    };

    if (isLoading) return <SkeletonTable />
    if (!data) return <p>data kosong</p>






    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>{adType}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Recommended size: {adType}px
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                setAdDialog(true);
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Ad
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    {/* <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search ads..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div> */}

                    {/* Ads Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ads</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Placement</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.filter((ad: Ads) => ad.placement.includes(adType)).map((ad: Ads) => (
                                    <TableRow key={ad.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {ad.image ? (
                                                    <img
                                                        src={ad.image}
                                                        alt={ad.name}
                                                        className="w-16 h-10 object-cover rounded"
                                                    />
                                                ) :
                                                    <div className="flex justify-center items-center text-xs text-slate-500 border-dashed border w-16 h-10 object-cover rounded" >
                                                        <ImageOff size={15} />
                                                    </div>
                                                }
                                                <div>
                                                    <p className="font-medium">{ad.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                        {ad.target_url}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <StatusToggle
                                                        adsId={ad.id}
                                                        adsStatus={ad.status}
                                                        onStatusChange={() => handleStatusChange} // fix: provide required prop (noop function)
                                                    />
                                                    <Badge variant={ad.status ? "default" : "secondary"}>
                                                        {ad.status ? "Active" : "Inactive"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span>{ad.placement}</span>
                                        </TableCell>


                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{new Date(ad.start_date).toLocaleDateString()}</div>
                                                <div className="text-muted-foreground">
                                                    to {new Date(ad.end_date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </TableCell>
                                        {/* edit ads */}
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => {
                                                        setAdsData(ad);
                                                        setAdDialog(true);
                                                        setEditingAd(true)
                                                    }}>
                                                        <Edit className="w-4 h-4 mr-2" /> Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => {
                                                            setAdsId(ad.id)
                                                            setShowDeleteDialog(true)
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {data.filter((ad: Ads) => ad.placement.includes(adType)).length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No ads found</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Ad Dialog */}
            <Dialog open={adDialog} onOpenChange={setAdDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAd ? "Edit Ad" : "Create New Ad"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingAd
                                ? "Update the ad details below"
                                : `Create a new ${adType} ad`}
                        </DialogDescription>
                    </DialogHeader>
                    {(adsData || editingAd) && (
                        <AddOrEditAds
                            editingAd={!!editingAd}
                            adsData={adsData as Ads}
                            setAdDialog={setAdDialog}
                            adType={adType}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* delete Ads */}
            <AlertDialog open={!!showDeleteDialog} onOpenChange={(open) => setShowDeleteDialog(open)}>
                {adsId && (
                    <DeleteAds
                        adsId={adsId}
                        setShowDeleteDialog={setShowDeleteDialog as React.Dispatch<React.SetStateAction<boolean>>}
                    />
                )}
            </AlertDialog>

        </>
    );
}
