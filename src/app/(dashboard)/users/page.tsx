
// import { fetchUser } from "@/lib/axios/actions";
// import { useQuery } from "@tanstack/react-query";

// export default function Page() {


//   console.log(data);
//   return <div className="">test</div>;
// }





import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import UsersContent from "@/components/users/user-content";
import Link from "next/link";

export default function Page() {
  return (
    <ContentLayout title="Articles">
      <Breadcrumb className="pb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>user</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <UsersContent />
    </ContentLayout>
  );
}
