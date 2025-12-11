"use client"

import { PostForm } from "@/components/post-form"
import { useAuth } from "@/lib/auth-context"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import LoadingState from "@/components/loading-state"
import { CreatePostSchema } from "@/lib/post-schema"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { createNewPost } from "@/lib/apiClient"

export default function CreatePostPage() {
    const { isAuthenticated } = useProtectedRoute()
    const { isLoading } = useAuth()

    if (isLoading) {
        return <LoadingState />
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <main className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center">
                        <p className="text-lg text-muted-foreground mb-4">You need to be logged in to create posts.</p>
                    </div>
                </main>
            </div>
        )
    }

    const handleSubmit = async (postData: CreatePostSchema) => {
        try {
            // API call to create the post
            const response = await createNewPost(postData)

            if (response.status === 201) {
                toast.success("Post created successfully!")
            } else {
                toast.error("Failed to create post.")
            }

        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(`Failed to create post: ${error.response.data.message}`)
                return
            }
            console.error("Error creating post:", error);

        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Create a New Post</h1>
                <PostForm onSubmit={handleSubmit} mode="create" />
            </main>
        </div>
    )
}
