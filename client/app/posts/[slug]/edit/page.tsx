"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PostForm } from "@/components/post-form"
import { useAuth } from "@/lib/auth-context"
import { ChevronLeft } from "lucide-react"
import { Post } from "@/app/page"
import toast from "react-hot-toast"
import { fetchPostById, updatePost } from "@/lib/apiClient"
import { CreatePostSchema } from "@/lib/post-schema"
import { AxiosError } from "axios"



export default function EditPostPage() {
    const [post, setPost] = useState<Post | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const { user, token } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const postId = searchParams.get("post_id") || ""


    const handleSubmit = async (updatedPostData: CreatePostSchema) => {
        try {
            const response = await updatePost(postId, updatedPostData)

            if (!response?.data?.success) {
                throw new Error("Failed to update post")
            }

            toast.success("Post updated successfully!")
            router.push(`/posts/${response.data.post.slug}?post_id=${postId}`)
        } catch (err) {
            const message = err instanceof AxiosError ? err.response?.data?.message : "Failed to update post"
            toast.error(message)
            throw err
        }
    }


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
    }, [postId, token, user, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-card rounded w-1/3" />
                        <div className="space-y-4">
                            <div className="h-10 bg-card rounded" />
                            <div className="h-10 bg-card rounded" />
                            <div className="h-32 bg-card rounded" />
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
                    <button onClick={() => router.back()} className="inline-flex items-center text-primary hover:underline mb-6">
                        <ChevronLeft size={18} className="mr-1" />
                        Back
                    </button>
                    <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
                        <p className="text-lg font-medium">{error}</p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
                <button onClick={() => router.back()} className="inline-flex items-center text-primary hover:underline mb-8">
                    <ChevronLeft size={18} className="mr-1" />
                    Back to Post
                </button>

                <h1 className="text-3xl font-bold mb-8">Edit Post</h1>

                {post && (
                    <PostForm
                        initialData={{
                            ...post,
                            image: post.imageUrl || "",
                        }}
                        onSubmit={handleSubmit}
                        mode="edit"
                    />
                )}
            </main>
        </div>
    )
}
