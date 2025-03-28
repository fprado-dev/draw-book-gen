import { BentoItem } from "@/components/ui/bento-card"
import { TBook } from "@/types/ebook"
import { formatDistanceToNow } from "date-fns"
import { Book } from "lucide-react"

export const formatBookCard = (books: TBook[]): BentoItem<TBook>[] => {
  const formattedOutlines = books.map((book): BentoItem<TBook> => {
    return {
      id: book.id,
      title: book.title,
      cta: 'Explore →',
      description: `${formatDistanceToNow(book.last_viewed)} ago`,
      status: book.status.charAt(0).toUpperCase() + book.status.slice(1),
      tags: [book.size, book.book_type, book.paper_color],
      icon: <Book className="w-4 h-4 text-purple-500" />,

    }
  })
  return formattedOutlines
}