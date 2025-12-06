import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Post } from "@/app/page"



interface PostCardProps {
    post: Post
}

export function PostCard({ post }: PostCardProps) {
    const truncatedContent = post.content.slice(0, 120) + (post.content.length > 120 ? "..." : "")

    return (
        <Link href={`/posts/${post.slug}?post_id=${post._id}`} >
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer">
                {/* Image */}
                <div className="relative w-full h-48 bg-secondary overflow-hidden">
                    {post.imageUrl ? (
                        <Image
                            src={post.imageUrl || ""}
                            alt={post.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement
                                img.style.display = "none"
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-muted-foreground">No image</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-balance">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{truncatedContent}</p>

                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                        <span>By {post.author.name}</span>
                        <span>{formatDate(post.createdAt)}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
