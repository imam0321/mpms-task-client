"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";

interface PaginationHelperProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationHelper({
  currentPage,
  totalPages,
}: PaginationHelperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigateToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  // Generate pages dynamically
  const getPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, totalPages];
    if (currentPage >= totalPages - 2)
      return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
  };

  const pages = getPages();

  return (
    <div className="mt-10 flex justify-center">
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        {pages.map((page, index) => (
          <span key={page} className="flex items-center">
            {index > 0 && page - pages[index - 1] > 1 && (
              <span className="mx-1">…</span>
            )}
            <Button
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => navigateToPage(page)}
              disabled={isPending}
            >
              {page}
            </Button>
          </span>
        ))}

        {/* Next button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
