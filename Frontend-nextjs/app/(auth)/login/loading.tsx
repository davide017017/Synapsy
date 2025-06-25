/* app/(auth)/loading.tsx */
export default function AuthLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black/80 rounded">
            <span className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
