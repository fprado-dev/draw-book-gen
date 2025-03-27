"use client";

import { PageHeader } from "@/components/page-header";
import { PageWrapper } from "@/components/page-wrapper";
import { BookPlus } from "lucide-react";

export default function Page() {
  return (
    <PageWrapper>
      <PageHeader
        titleText="Browse and manage your book collection."
        description="Create new books, update existing ones, or remove titles and quickly find books with our search feature."
        icon={<BookPlus className="h-4 w-4" />}
        button_text="Create New Book"
      />
    </PageWrapper>
  );
}