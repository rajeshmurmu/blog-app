"use client"

import { useState, useEffect } from "react"
import { ProfilePostCard } from "@/components/profile-post-card"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Post } from "../../page"
import LoadingState from "@/components/loading-state"
import { deletePost, fetchPostsByUser } from "@/lib/apiClient"
import { AxiosError } from "axios"
import toast from "react-hot-toast"



export default function ProfilePage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const { isAuthenticated } = useProtectedRoute()
    const { user, token, isLoading: isAuthLoading } = useAuth()


    if (isAuthLoading) {
        <LoadingState />
    }

    useEffect(() => {

        const fetchUserPosts = async () => {
            setIsLoading(true)
            setError("")
            try {
                const response = await fetchPostsByUser()
                setPosts(response?.data?.posts || [])
            } catch (err) {
                const message = err instanceof AxiosError ? err.response?.data?.message : "Failed to load posts"
                setError(message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserPosts()
    }, [user, token])

    const handleDeleteClick = (postId: string) => {
        setSelectedPostId(postId)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedPostId) return

        setIsDeleting(true)

        try {
            const response = await deletePost(selectedPostId)

            if (!response?.data?.success) {
                throw new Error("Failed to delete post")
            }
            setPosts((prev) => prev.filter((p) => p._id !== selectedPostId))
            setDeleteDialogOpen(false)
            toast.success(response.data?.message || "Post deleted successfully!")
        } catch (err) {
            const message = err instanceof AxiosError ? err.response?.data?.message : "Failed to delete post"
            setError(message)
        } finally {
            setIsDeleting(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <main className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center">
                        <p className="text-lg text-muted-foreground mb-4">You need to be logged in to view your profile.</p>
                    </div>
                </main>
            </div>
        )
    }

    if (isLoading) {
        return <LoadingState loadingText="Loading your posts..." />
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">My Posts</h1>
                    <Button asChild>
                        <Link href="/create">
                            <Plus size={18} className="mr-2" />
                            Create Post
                        </Link>
                    </Button>
                </div>

                {error && <div className="mb-8 p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-card rounded-lg h-64 animate-pulse" />
                        ))}
                    </div>
                )}

                {!isLoading && posts.length === 0 && (
                    <div className="text-center py-12 bg-card rounded-lg border border-border">
                        <p className="text-muted-foreground text-lg mb-6">You haven&apos;t created any posts yet.</p>
                        <Button asChild>
                            <Link href="/create">
                                <Plus size={18} className="mr-2" />
                                Create your first post
                            </Link>
                        </Button>
                    </div>
                )}

                {!isLoading && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <ProfilePostCard key={post._id} post={post} onEdit={() => { }} onDelete={handleDeleteClick} />
                        ))}
                    </div>
                )}
            </main>

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete Post"
                description="Are you sure you want to delete this post? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteDialogOpen(false)}
                isLoading={isDeleting}
            />
        </div>
    )
}
