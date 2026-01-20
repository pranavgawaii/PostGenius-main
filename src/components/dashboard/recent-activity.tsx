import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data
const recentActivity = [
    {
        user: {
            name: "Alice Smith",
            email: "alice@example.com",
            avatar: "/avatars/01.png",
        },
        action: "Scheduled a post",
        platform: "Instagram",
        time: "2 minutes ago",
    },
    {
        user: {
            name: "Bob Jones",
            email: "bob@example.com",
            avatar: "/avatars/02.png",
        },
        action: "Replied to comment",
        platform: "Twitter",
        time: "1 hour ago",
    },
    {
        user: {
            name: "You",
            email: "you@example.com",
            avatar: "/avatars/03.png",
        },
        action: "Generated AI Content",
        platform: "PostGenius AI",
        time: "3 hours ago",
    },
    {
        user: {
            name: "Sarah Lee",
            email: "sarah@example.com",
            avatar: "/avatars/04.png",
        },
        action: "Published new campaign",
        platform: "LinkedIn",
        time: "5 hours ago",
    },
    {
        user: {
            name: "Mike Brown",
            email: "mike@example.com",
            avatar: "/avatars/05.png",
        },
        action: "Updated analytics report",
        platform: "System",
        time: "Yesterday",
    },
];

export function RecentActivity() {
    return (
        <div className="space-y-8">
            {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center">
                    {/* Since we don't have shadcn Avatar yet, using simple div fallback if not present, but better to implement Avatar if high quality. 
               I'll implement Avatar component in next step if needed, but standard HTML + Tailwind works for now or I can add Avatar comp.
               Let's assume I will add Avatar component OR use a simple circle placeholder.
               To be safe and high quality I will add Avatar component in next step.
               For now using placeholder.
             */}
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs border border-primary/20">
                        {item.user.name.charAt(0)}
                    </div>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{item.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {item.action} on <span className="text-foreground">{item.platform}</span>
                        </p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                        {item.time}
                    </div>
                </div>
            ))}
        </div>
    );
}
