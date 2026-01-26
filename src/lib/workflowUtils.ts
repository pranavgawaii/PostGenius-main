/**
 * Parses raw AI output based on workflow type
 */
export function parseWorkflowOutput(workflow: string, rawOutput: string): any {
    switch (workflow) {
        case 'social_media':
            // Parse JSON (multi-platform captions)
            try {
                // Ensure we catch markdown code blocks if AI wraps it
                let cleanOutput = rawOutput.trim();
                if (cleanOutput.startsWith("```json")) {
                    cleanOutput = cleanOutput.replace(/^```json\n/, "").replace(/\n```$/, "");
                } else if (cleanOutput.startsWith("```")) {
                    cleanOutput = cleanOutput.replace(/^```\n/, "").replace(/\n```$/, "");
                }

                return JSON.parse(cleanOutput);
            } catch (error) {
                console.error("JSON Parse Error:", error);
                // Fallback if JSON parsing fails
                return {
                    error: 'Failed to parse social media captions',
                    raw: rawOutput
                };
            }

        case 'resume':
            // Parse bullet points (split by newline, filter bullets)
            // Removes markdown code blocks if present
            let cleanResume = rawOutput.trim();
            if (cleanResume.startsWith("```")) {
                cleanResume = cleanResume.replace(/^```.*\n/, "").replace(/\n```$/, "");
            }

            return cleanResume
                .split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.trim().replace(/^-\s+/, '').replace(/^-\s*/, '')); // Remove dash

        case 'github_readme':
            // Return markdown as-is
            // Strip wrapper quotes if AI adds them errantly
            let readme = rawOutput.trim();
            if (readme.startsWith("```markdown")) {
                readme = readme.replace(/^```markdown\n/, "").replace(/\n```$/, "");
            } else if (readme.startsWith("```")) {
                readme = readme.replace(/^```\n/, "").replace(/\n```$/, "");
            }
            return readme;

        case 'notes':
            // Return formatted notes as-is
            // Strip wrapper
            let notes = rawOutput.trim();
            if (notes.startsWith("```")) {
                notes = notes.replace(/^```.*\n/, "").replace(/\n```$/, "");
            }
            return {
                topic: extractSection(notes, "📌 Topic:"),
                keyConcepts: extractList(notes, "🎯 Key Concepts:"),
                definitions: extractDefinitions(notes, "📖 Important Definitions:"),
                examples: extractList(notes, "💡 Examples & Use Cases:"),
                revisionPoints: extractList(notes, "⚡ Quick Revision Points:"),
                relatedTopics: extractList(notes, "🔗 Related Topics to Explore:")
            };

        case 'linkedin':
            // Return post text structure
            let post = rawOutput.trim();
            if (post.startsWith("```")) {
                post = post.replace(/^```.*\n/, "").replace(/\n```$/, "");
            }

            // Simple extraction logic
            const hashtagsMatch = post.match(/#\w+/g);
            const hashtags = hashtagsMatch ? hashtagsMatch : [];
            const textWithoutTags = post.replace(/#\w+/g, "").trim();

            return {
                text: textWithoutTags,
                hashtags: hashtags
            };

        default:
            return { text: rawOutput.trim() };
    }
}

// Helpers for notes parsing
function extractSection(text: string, header: string): string {
    const match = text.match(new RegExp(`${header}\\s*(.*)`));
    return match ? match[1].trim() : "Untitled Topic";
}

function extractList(text: string, header: string): string[] {
    const section = text.split(header)[1]?.split(/\n\n[^\n]/)[0]; // Split by next section header (approx)
    if (!section) return [];

    return section
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && (line.startsWith('-') || line.startsWith('•') || /^\d+\./.test(line)))
        .map(line => line.replace(/^[-\•\d+\.]\s*/, ''));
}

function extractDefinitions(text: string, header: string): { term: string; definition: string }[] {
    const section = text.split(header)[1]?.split(/\n\n[^\n]/)[0];
    if (!section) return [];

    return section
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.includes(':'))
        .map(line => {
            const [term, ...defParts] = line.replace(/^[-\•]\s*/, '').split(':');
            return {
                term: term.trim(),
                definition: defParts.join(':').trim()
            };
        });
}


/**
 * Validates URL based on workflow requirements
 */
export function validateWorkflowInput(
    workflow: string,
    url: string
): { valid: boolean; error?: string } {
    // Check if URL is valid
    try {
        new URL(url);
    } catch {
        return { valid: false, error: 'Please enter a valid URL' };
    }

    // Workflow-specific validation
    if (workflow === 'github_readme' || workflow === 'resume') {
        if (!url.includes('github.com')) {
            return {
                valid: false,
                error: 'Please provide a GitHub repository URL (github.com/username/repo)'
            };
        }
    }

    return { valid: true };
}

/**
 * Returns metadata for each workflow
 */
export function getWorkflowMetadata(workflow: string) {
    const metadata: Record<string, any> = {
        social_media: {
            name: 'Social Media Captions',
            icon: '📱',
            usesFirecrawl: true,
            usesGitHubAPI: false
        },
        github_readme: {
            name: 'GitHub README',
            icon: '📝',
            usesFirecrawl: false,
            usesGitHubAPI: true
        },
        resume: {
            name: 'Resume Bullets',
            icon: '🎯',
            usesFirecrawl: false,
            usesGitHubAPI: true
        },
        notes: {
            name: 'Study Notes',
            icon: '📚',
            usesFirecrawl: true,
            usesGitHubAPI: false
        },
        linkedin: {
            name: 'LinkedIn Post',
            icon: '💼',
            usesFirecrawl: true,
            usesGitHubAPI: false
        }
    };

    return metadata[workflow] || metadata.social_media;
}
