"use client"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Post } from "@/app/page"
import Image from "next/image"



interface ProfilePostCardProps {
    post: Post
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

export function ProfilePostCard({ post, onEdit, onDelete }: ProfilePostCardProps) {
    const truncatedContent = post.content.slice(0, 100) + (post.content.length > 100 ? "..." : "")

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="p-4">
                <Link href={`/posts/${post.slug}?post_id=${post._id}`} className="hover:text-primary transition-colors">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-balance">{post.title}</h3>
                </Link>
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
                <p className="text-sm text-muted-foreground my-4 line-clamp-2">{truncatedContent}</p>

                <div className="flex justify-between items-center text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                    <span>{formatDate(post.createdAt)}</span>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onEdit(post._id)} asChild>
                        <Link href={`/posts/${post.slug}/edit?post_id=${post._id}`}>
                            <Edit size={16} className="mr-2" />
                            Edit
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:text-destructive bg-transparent"
                        onClick={() => onDelete(post._id)}
                    >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    )
}
