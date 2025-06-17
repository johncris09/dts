import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    path: string;
    links: { url: string | null; label: string; active: boolean }[];
}

interface PaginationProps {
    pagination: PaginationMeta;
}

export default function Paginations({ pagination }: PaginationProps) {
    const { current_page, last_page } = pagination;

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={`?page=${Math.max(current_page - 1, 1)}`}
                        className={
                            current_page === 1 ? "pointer-events-none opacity-50" : ""
                        }
                    />
                </PaginationItem>

                {[...Array(last_page)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink
                                href={`?page=${pageNumber}`}
                                className={`inline-flex justify-center items-center w-10 h-10 text-sm font-medium whitespace-nowrap rounded-md transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${pageNumber === current_page
                                    ? "border border-muted"
                                    : "hover:bg-muted"
                                    }`}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationNext
                        href={`?page=${Math.min(current_page + 1, last_page)}`}
                        className={
                            current_page === last_page ? "pointer-events-none opacity-50" : ""
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}