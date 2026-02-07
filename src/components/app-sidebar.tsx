// import { Bookmark, Calendar, Home, Inbox, Search } from "lucide-react";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebar";

// import {
//   LayoutDashboard,
//   FileText,
//   Users,
//   Settings,
//   Newspaper,
//   FileEdit,
//   Send,
//   Tag,
//   Megaphone,
//   LayoutGrid,
//   SidebarIcon,
//   Plus,
//   Image,
// } from "lucide-react";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "./ui/collapsible";
// import Link from "next/link";

// // Menu items.

// const sidebarMenuItems = [
//   {
//     title: "dashboard",
//     label: "Dashboard",
//     icon: LayoutDashboard,
//     url: "/dashboard",
//   },
//   {
//     title: "news",
//     label: "News Management",
//     icon: Newspaper,
//     children: [
//       {
//         title: "add-article",
//         label: "Add Article",
//         icon: Plus,
//         url: "/articles/add",
//       },
//       {
//         title: "all-articles",
//         label: "All Articles",
//         icon: FileText,
//         url: "/articles",
//       },
//       {
//         title: "drafts",
//         label: "Drafts",
//         icon: FileEdit,
//         url: "/articles/drafts",
//       },
//       {
//         title: "published",
//         label: "Published",
//         icon: Send,
//         url: "/articles/published",
//       },
//       {
//         title: "categories",
//         label: "Categories",
//         icon: Bookmark,
//         url: "/categories",
//       },
//       { title: "tags", label: "Tags", icon: Tag, url: "/tags" },
//     ],
//   },
//   {
//     title: "ads",
//     label: "Ad Management",
//     icon: Megaphone,
//     children: [
//       {
//         title: "header-ads",
//         label: "Header Ads",
//         icon: LayoutGrid,
//         url: "/ads/header",
//       },
//       {
//         title: "sidebar-ads",
//         label: "Sidebar Ads",
//         icon: SidebarIcon,
//         url: "/ads/sidebar",
//       },
//       {
//         title: "inline-ads",
//         label: "Inline Ads",
//         icon: FileText,
//         url: "/ads/inline",
//       },
//     ],
//   },
//   { title: "gallery", label: "Gallery", icon: Image, url: "/gallery" },

//   { title: "user", label: "Users / Authors", icon: Users, url: "/user" },
//   { title: "settings", label: "Settings", icon: Settings, url: "/settings" },
// ];

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarContent className="bg-sky-800 text-white font-semibold">
//         <SidebarGroup>
//           <SidebarGroupLabel className="text-xl font-bold text-white my-5 ">
//             Celebes Nusantara
//           </SidebarGroupLabel>
//           <SidebarGroupContent className="space-y-4">
//             {sidebarMenuItems.map((item) =>
//               item.children ? (
//                 <Collapsible key={item.title} className="group">
//                   <SidebarMenuItem>
//                     <CollapsibleTrigger asChild>
//                       <SidebarMenuButton>
//                         <item.icon />
//                         <span className="font-semibold">{item.label}</span>
//                       </SidebarMenuButton>
//                     </CollapsibleTrigger>

//                     <CollapsibleContent>
//                       <SidebarMenuSub>
//                         {item.children.map((child) => (
//                           <SidebarMenuSubItem key={child.title}>
//                             <SidebarMenuButton asChild>
//                               <Link href={child.url}>
//                                 <child.icon />
//                                 <span>{child.label}</span>
//                               </Link>
//                             </SidebarMenuButton>
//                           </SidebarMenuSubItem>
//                         ))}
//                       </SidebarMenuSub>
//                     </CollapsibleContent>
//                   </SidebarMenuItem>
//                 </Collapsible>
//               ) : (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <Link href={item.url}>
//                       <item.icon />
//                       <span>{item.label}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ),
//             )}
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }
