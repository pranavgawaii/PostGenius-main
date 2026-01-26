export type WorkflowType = 'social_media' | 'github_readme' | 'resume' | 'notes' | 'linkedin';

export interface WorkflowDefinition {
    id: WorkflowType;
    name: string;
    icon: string;
    description: string;
    bestFor: string;
    inputPlaceholder: string;
    requiresFirecrawl: boolean;
    acceptedUrls: string;
}

export const workflows: WorkflowDefinition[] = [
    {
        id: 'social_media',
        name: 'Social Media Captions',
        icon: '📱',
        description: 'Generate captions for multiple platforms',
        bestFor: 'Instagram, LinkedIn, Twitter, Facebook',
        inputPlaceholder: 'Paste article, video, or blog URL...',
        requiresFirecrawl: true,
        acceptedUrls: 'Any URL'
    },
    {
        id: 'github_readme',
        name: 'GitHub README',
        icon: '📝',
        description: 'Generate professional README.md file',
        bestFor: 'GitHub projects, documentation',
        inputPlaceholder: 'Paste GitHub repository URL...',
        requiresFirecrawl: false,
        acceptedUrls: 'GitHub repos only'
    },
    {
        id: 'resume',
        name: 'Resume Bullets',
        icon: '🎯',
        description: 'ATS-optimized resume bullet points',
        bestFor: 'Resume building, job applications',
        inputPlaceholder: 'Paste GitHub repository URL...',
        requiresFirecrawl: false,
        acceptedUrls: 'GitHub repos only'
    },
    {
        id: 'notes',
        name: 'Study Notes',
        icon: '📚',
        description: 'Exam-friendly structured notes',
        bestFor: 'Studying, revision, learning',
        inputPlaceholder: 'Paste article or tutorial URL...',
        requiresFirecrawl: true,
        acceptedUrls: 'Articles, videos, docs'
    },
    {
        id: 'linkedin',
        name: 'LinkedIn Post',
        icon: '💼',
        description: 'Professional placement-ready post',
        bestFor: 'Personal branding, networking',
        inputPlaceholder: 'Paste article or video URL...',
        requiresFirecrawl: true,
        acceptedUrls: 'Articles, videos, blogs'
    }
];
