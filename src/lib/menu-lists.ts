import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Megaphone,
  Image,
} from "lucide-react";
import { useUser } from "./axios/actions/users/useUser";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  const { user } = useUser();
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Posts",
          icon: SquarePen,
          submenus: [
            {
              href: "/articles",
              label: "All Articles",
            },
            {
              href: "/articles/add",
              label: "Add Article",
            },
            {
              href: "/articles/drafts",
              label: "Drafts",
            },
            {
              href: "/articles/published",
              label: "Published",
            },
          ],
        },
        {
          href: "/categories",
          label: "Categories",
          icon: Bookmark,
        },
        {
          href: "/tags",
          label: "Tags",
          icon: Tag,
        },
        // {
        //   href: "/gallery",
        //   label: "Gallery",
        //   icon: Image,
        // },
      ],
    },
    ...(user?.role === "admin"
      ? [
          {
            groupLabel: "Marketing",
            menus: [
              {
                href: "",
                label: "Ad Management",
                icon: Megaphone,
                submenus: [
                  {
                    href: "/ads/header",
                    label: "Header Ads",
                  },
                  {
                    href: "/ads/sidebar",
                    label: "Sidebar Ads",
                  },
                  {
                    href: "/ads/inline",
                    label: "Inline Ads",
                  },
                ],
              },
            ],
          },
        ]
      : []),

    // Hanya admin yang bisa akses menu Settings
    ...(user?.role === "admin"
      ? [
          {
            groupLabel: "Settings",
            menus: [
              {
                href: "/users",
                label: "Users / Authors",
                icon: Users,
              },
              {
                href: "/settings",
                label: "Settings",
                icon: Settings,
              },
            ],
          },
        ]
      : [
          {
            groupLabel: "Settings",
            menus: [
              {
                href: "/users",
                label: "Account",
                icon: Users,
              },
            ],
          },
        ]),
  ];

  // return [
  //   {
  //     groupLabel: "",
  //     menus: [
  //       {
  //         href: "/dashboard",
  //         label: "Dashboard",
  //         icon: LayoutGrid,
  //         submenus: [],
  //       },
  //     ],
  //   },
  //   {
  //     groupLabel: "Contents",
  //     menus: [
  //       {
  //         href: "",
  //         label: "Posts",
  //         icon: SquarePen,
  //         submenus: [
  //           {
  //             href: "/posts",
  //             label: "All Posts",
  //           },
  //           {
  //             href: "/posts/new",
  //             label: "New Post",
  //           },
  //         ],
  //       },
  //       {
  //         href: "/categories",
  //         label: "Categories",
  //         icon: Bookmark,
  //       },
  //       {
  //         href: "/tags",
  //         label: "Tags",
  //         icon: Tag,
  //       },
  //     ],
  //   },
  //   {
  //     groupLabel: "Settings",
  //     menus: [
  //       {
  //         href: "/users",
  //         label: "Users",
  //         icon: Users,
  //       },
  //       {
  //         href: "/account",
  //         label: "Account",
  //         icon: Settings,
  //       },
  //     ],
  //   },
  // ];
}
