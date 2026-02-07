"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

export function Navbar({}) {
  const router = useRouter();

  const handleLogout = () => {
    window.location.href = "http://localhost:8000/api/auth/logout/";
  };

  const handleMyProfile = () => {
    router.push("/users"); // Navigate to users page (can be changed to /profile if you create one)
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <header className="  justify-between lg:justify-end top-0 z-30 bg-card border-b border-border h-16 flex items-center px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden mr-2"
        // onClick={() => setMobileSidebarOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                {/* <AvatarImage src={user.avatar} /> */}
                <AvatarFallback className="bg-primary text-white text-sm">
                  {/* {user.name.charAt(0)} */}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {/* {user.name} */} Wan Azmi
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                {/*<span>{user.name}</span>*/}
                <span className="text-xs text-muted-foreground font-normal">
                  {/*{user.email}*/}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleMyProfile}>
              <User className="w-4 h-4 mr-2" /> My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleLogout()}
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => (window.location.href = "/login")}
            >
              <LogOut className="w-4 h-4 mr-2" /> Login
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
