import { Users } from "lucide-react"

const SidebarSkeleton = () => {
    const skeletonContacts = Array(8).fill(null);

    return (
        <aside className="h-full w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Header Skeleton */}
            <div className="p-6 border-b border-gray-200">
                <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4 animate-pulse"></div>
                
                {/* Search Bar Skeleton */}
                <div className="h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Contact List Skeleton */}
            <div className="flex-1 overflow-y-auto">
                {skeletonContacts.map((_, index) => (
                    <div key={index} className="flex items-center gap-3 p-4">
                        {/* Avatar Skeleton */}
                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                        
                        {/* User Info Skeleton */}
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    )
}

export default SidebarSkeleton
