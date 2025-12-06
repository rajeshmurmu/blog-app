export function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-12">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="font-bold text-lg text-primary">DevBlogs</div>
                    <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} DevBlogs. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
