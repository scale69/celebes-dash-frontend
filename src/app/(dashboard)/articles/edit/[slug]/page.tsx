import { ContentLayout } from "@/components/admin-panel/content-layout";
import AddArticleOrEditArticle from "@/components/article/add-or-edit-article-content";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";


export default async function Page({ params }: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    return (
        <ContentLayout title="Edit Articles">
            <Breadcrumb className="pb-5">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbPage>edit articles</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {/*isi coontent*/}
            <AddArticleOrEditArticle title="Edit Article" slug={slug} />
        </ContentLayout>
    )
}