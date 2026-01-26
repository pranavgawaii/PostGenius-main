import { WorkflowType } from "./workflows";

export function getWorkflowIcon(workflow: string): string {
    const icons: Record<string, string> = {
        social_media: '📱',
        github_readme: '📝',
        resume: '🎯',
        notes: '📚',
        linkedin: '💼'
    };
    return icons[workflow] || '📝';
}

export function getWorkflowName(workflow: string): string {
    const names: Record<string, string> = {
        social_media: 'Social Media Captions',
        github_readme: 'GitHub README',
        resume: 'Resume Bullets',
        notes: 'Study Notes',
        linkedin: 'LinkedIn Post'
    };
    return names[workflow] || 'Generation';
}

export function validateInput(workflow: WorkflowType, url: string): string | null {
    // Check if URL is valid
    try {
        new URL(url);
    } catch {
        return 'Please enter a valid URL';
    }

    // GitHub workflow validation
    if ((workflow === 'github_readme' || workflow === 'resume') && !url.includes('github.com')) {
        return '⚠️ Please provide a GitHub repository URL (github.com/username/repo)';
    }

    // YouTube length warning (optional)
    if (workflow === 'notes' && (url.includes('youtube.com') || url.includes('youtu.be'))) {
        return null; // Just a potential warning in UI, but valid for processing
    }

    return null; // Valid
}
