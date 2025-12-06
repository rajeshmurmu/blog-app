"use client"

import { useState, useEffect } from "react"
import { PostCard } from "@/components/post-card"
import { SearchBar } from "@/components/search-bar"
import { Pagination } from "@/components/pagination"
import { fetchPosts } from "@/lib/apiClient"

export interface Post {
  _id: string
  title: string
  imageUrl?: string
  content: string
  slug: string
  author: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
}

interface PaginationInfo {
  currentPage: number
  limit: number
  total: number
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    limit: 9,
    total: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")



  useEffect(() => {
    async function fetchAllPosts() {
      setIsLoading(true)
      const allPosts = await fetchPosts()

      if (allPosts?.data?.success) {
        setPosts(allPosts.data.posts)
        setPagination((prev) => ({
          ...prev,
          total: allPosts.data.posts.length,
        }))
        setError("")
      } else {
        setError("Failed to fetch posts")
      }
      setIsLoading(false)
    }
    fetchAllPosts()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // fetchPosts(1, query)
  }

  const handleNextPage = () => {
    // fetchPosts(pagination.currentPage + 1, searchQuery)
  }

  const handlePrevPage = () => {
    // fetchPosts(pagination.currentPage - 1, searchQuery)
  }

  const hasNextPage = pagination.currentPage * pagination.limit < pagination.total
  const hasPrevPage = pagination.currentPage > 1

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {error && <div className="mb-8 p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No posts found. Try adjusting your search.</p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {(hasNextPage || hasPrevPage) && (
              <Pagination
                currentPage={pagination.currentPage}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
