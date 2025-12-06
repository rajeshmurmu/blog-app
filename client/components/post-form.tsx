"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ACCEPTED_IMAGE_TYPES, CreatePostSchema, createPostSchema } from "@/lib/post-schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import Image from "next/image"
import { X } from "lucide-react"
import { useCallback, useEffect } from "react"
import { generateSlug } from "@/lib/utils"

interface PostFormProps {
    initialData?: {
        _id?: string
        title: string
        slug?: string
        image: string | File
        content: string,

    }
    onSubmit: (data: CreatePostSchema) => Promise<void>
    mode?: "create" | "edit"
}

export function PostForm({
    initialData = { title: "", image: "", content: "", slug: "" },
    onSubmit,
    mode = "create",
}: PostFormProps) {
    const form = useForm(
        {
            resolver: zodResolver(createPostSchema),
            defaultValues: {
                title: initialData.title ?? "",
                slug: initialData.slug ?? "",
                image: initialData.image ?? undefined,
                content: initialData.content ?? "",
            },

        }
    )


    const handleSubmit = async (postCreateData: CreatePostSchema) => {
        await onSubmit(postCreateData)
        form.reset()
    }


    const blogImage = useWatch({
        control: form.control,
        name: "image",
    });

    const title = useWatch({
        control: form.control,
        name: "title",
    });

    const generatePostSlug = useCallback((title: string) => {
        if (title) {
            return generateSlug(title);
        }
        return "";
    }, []);

    useEffect(() => {
        if (mode === "create" && title) {
            const slug = generatePostSlug(title);
            form.setValue("slug", slug);
        }

        if (mode === "edit" && initialData?.slug) {

            form.setValue("slug", initialData.slug);
        }
    }, [title, generatePostSlug, form, mode, initialData.slug]);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-card rounded-lg shadow-lg p-8 space-y-6">
                {/* Slug Field */}
                <div>

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Slug will be generated automatically, you can edit it later" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>


                {/* Title Field */}
                <div>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter a professional title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                {/* Image Upload Field */}
                <div>
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Featured Image</FormLabel>
                                <FormControl>
                                    <div className="flex flex-col gap-2">
                                        <Input
                                            type="file"
                                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    field.onChange(file);
                                                }
                                            }}
                                        />
                                        {field.value instanceof File && (
                                            <p className="text-sm text-muted-foreground">
                                                Selected: {field.value.name}
                                            </p>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Image Upload Preview */}
                    <div className="my-4">
                        {blogImage ? (
                            <div className="">
                                <div className="relative group">
                                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                        {/* <span className="text-xs text-muted-foreground text-center p-2">
                                                    {file.name}
                                                </span> */}
                                        <Image
                                            src={blogImage instanceof File ? URL.createObjectURL(blogImage as File) : (blogImage as string)}
                                            alt={(blogImage as File).name || "Uploaded Image"}
                                            className="w-full h-full object-cover rounded-md"
                                            width={500}
                                            height={500}
                                        />

                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // remove the image
                                            form.setValue("image", undefined);
                                            form.resetField("image");

                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <X className="text-white h-3 w-3" />
                                    </button>
                                </div>

                            </div>
                        ) : null}


                    </div>

                    {/* Content Field */}
                    <div>
                        {/* Content */}
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={50}
                                            className="min-h-[300px]"
                                            placeholder="Write your content here..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                        <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1">
                            {form.formState.isSubmitting
                                ? mode === "create"
                                    ? "Creating..."
                                    : "Updating..."
                                : mode === "create"
                                    ? "Create Post"
                                    : "Update Post"}
                        </Button>
                        <Button type="button" variant="outline" disabled={form.formState.isSubmitting} asChild>
                            <Link href={mode === "create" ? "/" : `/posts/${initialData.slug}?post_id=${initialData._id}`}>{mode === "create" ? "Cancel" : "Back"}</Link>
                        </Button>
                    </div>
                </div>
            </form>
        </Form>

    )
}
