export function getWorkflowIcon(workflow: string): string {
    switch (workflow) {
        case 'social_media': return '📱';
        case 'github_readme': return '📝';
        case 'resume': return '🎯';
        case 'notes': return '📚';
        case 'linkedin': return '💼';
        default: return '✨';
    }
}

export function formatTimeAgo(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    return past.toLocaleDateString();
}

export function truncateEmail(email: string, maxLength: number = 20): string {
    if (email.length <= maxLength) return email;
    const [name, domain] = email.split('@');
    if (!domain) return email.substring(0, maxLength) + '...';

    const half = Math.floor((maxLength - domain.length - 4) / 2);
    if (half < 2) return email.substring(0, maxLength - 3) + '...';

    return name.substring(0, half) + '...' + '@' + domain;
}

export function formatCredits(plan: string, credits: number): string {
    if (plan === 'unlimited' || plan === 'pro') return '∞';
    return `${credits}/5`;
}
