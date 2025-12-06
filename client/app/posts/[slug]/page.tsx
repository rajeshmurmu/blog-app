"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { formatDate } from "@/lib/utils"
import { ChevronLeft, Trash2, Edit } from "lucide-react"
import { Post } from "@/app/page"
import { deletePost, fetchPostById } from "@/lib/apiClient"
import toast from "react-hot-toast"
import { AxiosError } from "axios"



export default function PostDetailPage() {
    const [post, setPost] = useState<Post | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const { user, token } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const postId = searchParams.get("post_id") || ""

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true)
            setError("")

            try {
                const response = await fetchPostById(postId)
                if (!response?.data?.success) {
                    throw new Error("Post not found")
                }
                setPost(response.data.post)
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to load post"
                setError(message)
            } finally {
                setIsLoading(false)
            }
        }

        if (postId) {
            fetchPost()
        }
    }, [postId, token])

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            const response = await deletePost(postId)

            if (!response?.data?.success) {
                throw new Error("Failed to delete post")
            }

            toast.success("Post deleted successfully!")
            router.replace("/")
        } catch (err) {
            const message = err instanceof AxiosError ? err.response?.data?.message : "Failed to delete post"
            toast.error(message)
            console.error(message)
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
        }
    }

    const isOwner = user && post && user?._id?.toString() === post?.author?._id?.toString()

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-card rounded w-1/2" />
                        <div className="h-96 bg-card rounded" />
                        <div className="space-y-2">
                            <div className="h-4 bg-card rounded" />
                            <div className="h-4 bg-card rounded" />
                            <div className="h-4 bg-card rounded w-3/4" />
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                    <button onClick={() => router.back()} className="inline-flex items-center text-primary hover:underline mb-6">
                        <ChevronLeft size={18} className="mr-1" />
                        Back to Posts
                    </button>
                    <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
                        <p className="text-lg font-medium">{error || "Post not found"}</p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                <button onClick={() => router.back()} className="inline-flex items-center text-primary hover:underline mb-8">
                    <ChevronLeft size={18} className="mr-1" />
                    Back to Posts
                </button>

                <article className="bg-card rounded-lg shadow-md overflow-hidden">
                    {/* Header with Title */}
                    <div className="p-6 border-b border-border">
                        <h1 className="text-4xl font-bold mb-4 text-balance">{post.title}</h1>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-x-2">
                                    <p className="text-sm font-semibold">By</p>
                                    <p className="text-sm text-muted-foreground">{post.author.name}</p>
                                </div>
                                <div className="flex gap-x-2">
                                    <p className="text-sm font-semibold">Published</p>
                                    <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
                                </div>
                            </div>

                            {/* Edit and Delete Actions */}
                            {isOwner && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/posts/${post.slug}/edit/?post_id=${post._id}`}>
                                            <Edit size={16} className="mr-2" />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDeleteDialogOpen(true)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image */}
                    {post.imageUrl && (
                        <div className="relative w-full h-96 bg-secondary">
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    const img = e.currentTarget as HTMLImageElement
                                    img.style.display = "none"
                                }}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</p>
                        </div>
                    </div>
                </article>
            </main>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete Post"
                description="Are you sure you want to delete this post? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteDialogOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    )
}
