"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Newspaper,
  FileEdit,
  Send,
  Tag,
  Megaphone,
  LayoutGrid,
  SidebarIcon,
  MessageSquare,
  Menu,
  Plus,
  Image,
} from "lucide-react";
import { Navbar } from "./navbar";

const sidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "news",
    label: "News Management",
    icon: Newspaper,
    children: [
      {
        id: "add-article",
        label: "Add Article",
        icon: Plus,
        href: "/articles/add",
      },
      {
        id: "all-articles",
        label: "All Articles",
        icon: FileText,
        href: "/articles",
      },
      {
        id: "drafts",
        label: "Drafts",
        icon: FileEdit,
        href: "/articles/drafts",
      },
      {
        id: "published",
        label: "Published",
        icon: Send,
        href: "/articles/published",
      },
      { id: "categories", label: "Categories", icon: Tag, href: "/categories" },
      { id: "tags", label: "Tags", icon: Tag, href: "/tags" },
    ],
  },
  {
    id: "ads",
    label: "Ad Management",
    icon: Megaphone,
    children: [
      {
        id: "header-ads",
        label: "Header Ads",
        icon: LayoutGrid,
        href: "/ads/header",
      },
      {
        id: "sidebar-ads",
        label: "Sidebar Ads",
        icon: SidebarIcon,
        href: "/ads/sidebar",
      },
      {
        id: "inline-ads",
        label: "Inline Ads",
        icon: FileText,
        href: "/ads/inline",
      },
    ],
  },
  { id: "gallery", label: "Gallery", icon: Image, href: "/gallery" },
  { id: "comments", label: "Comments", icon: MessageSquare, href: "/comments" },
  { id: "users", label: "Users / Authors", icon: Users, href: "/users" },
  {
    id: "analytics",
    label: "Analytics / Reports",
    icon: BarChart3,
    href: "/analytics",
  },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function DashboardLayout({ children }: any) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(["news"]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [notifications, setNotifications] = useState(dummyNotifications);
  // const [user, setUser] = useState(currentUser);
  const [profileDialog, setProfileDialog] = useState(false);

  // Auto-expand parent menu when child is active
  useEffect(() => {
    const activeParents = sidebarMenuItems
      .filter(
        (item) =>
          item.children &&
          item.children.some((child) => pathname === child.href)
      )
      .map((item) => item.id);

    // Set expandedMenus to only include active parents
    setExpandedMenus(activeParents);
  }, [pathname]);

  const toggleMenu = (menuId: any) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (href: any) => pathname === href;
  const isParentActive = (children: any) =>
    children?.some((child: any) => pathname === child.href);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        } ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-sidebar-foreground">
                  NewsHub
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-accent lg:flex hidden"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          {/* ================= SCROL AREA SIDEBAR 2 ================= */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {sidebarMenuItems.map((item) => (
                <div key={item.id}>
                  {item.children ? (
                    sidebarCollapsed ? (
                      // Collapsed: Show popover on hover
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={`w-full flex items-center justify-center px-3 py-2.5 rounded-lg transition-colors ${
                              isParentActive(item.children)
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent"
                            }`}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent side="right" className="w-56 p-2 ml-2">
                          <div className="space-y-1">
                            <div className="px-2 py-1.5 text-sm font-semibold">
                              {item.label}
                            </div>
                            {item.children.map((child) => (
                              <Link
                                key={child.id}
                                href={child.href}
                                className={`flex items-center gap-3 px-2 py-2 rounded-md transition-colors text-sm ${
                                  isActive(child.href)
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground"
                                }`}
                              >
                                <child.icon className="w-4 h-4" />
                                <span>{child.label}</span>
                              </Link>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      // Expanded: Show normal button
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          isParentActive(item.children)
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        }`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.label}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedMenus.includes(item.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )
                  ) : (
                    <Link
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  )}
                  {item.children &&
                    expandedMenus.includes(item.id) &&
                    !sidebarCollapsed && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                              isActive(child.href)
                                ? "bg-sidebar-accent text-sidebar-primary"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            }`}
                          >
                            <child.icon className="w-4 h-4" />
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/*{!sidebarCollapsed && (
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center gap-3 w-full p-2">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="bg-primary text-white">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {currentUser.role}
                  </p>
                </div>
              </div>
            </div>
          )}*/}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
