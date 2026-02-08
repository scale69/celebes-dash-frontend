"use client"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"
import { PropsData } from "@/types/data"
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { useMemo } from "react"


export default function PaginationComponent({
    data,
}: PropsData) {
    const pageSize = 10
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    // 🔹 ambil page dari URL
    const currentPage = useMemo(() => {
        const p = Number(searchParams.get("page"))
        return isNaN(p) || p < 1 ? 1 : p
    }, [searchParams])

    // 🔹 hitung total pages
    const totalPages = useMemo(() => {
        return Math.ceil(data.count / pageSize)
    }, [data.count, pageSize])

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    if (totalPages <= 1) return null

    const getPages = () => {
        const pages: (number | "ellipsis")[] = []

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
            return pages
        }

        pages.push(1)

        if (currentPage > 4) pages.push("ellipsis")

        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)

        for (let i = start; i <= end; i++) pages.push(i)

        if (currentPage < totalPages - 3) pages.push("ellipsis")

        pages.push(totalPages)

        return pages
    }

    return (
        <Pagination>
            <PaginationContent>
                {/* Prev */}
                <PaginationItem>
                    <PaginationPrevious
                        href={`?page=${currentPage - 1}`}
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) goToPage(currentPage - 1)
                        }}
                    />
                </PaginationItem>

                {/* Pages */}
                {getPages().map((p, i) =>
                    p === "ellipsis" ? (
                        <PaginationItem key={`e-${i}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href={`?page=${p}`}
                                isActive={p === currentPage}
                                onClick={(e) => {
                                    e.preventDefault()
                                    goToPage(p)
                                }}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        href={`?page=${currentPage + 1}`}
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages)
                                goToPage(currentPage + 1)
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
