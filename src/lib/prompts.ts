import { GitHubRepoData } from "./githubApi";

/**
 * Generates prompt for GitHub README workflow
 */
export function getGitHubReadmePrompt(repoData: GitHubRepoData): string {
    return `You are a technical documentation expert. Generate a professional GitHub README.md file for this project.

PROJECT INFORMATION:
- Name: ${repoData.name}
- Description: ${repoData.description}
- Primary Language: ${repoData.language}
- Topics/Tags: ${repoData.topics.join(', ')}
- Stars: ${repoData.stars}
- Repository URL: ${repoData.url}
${repoData.readme ? `\n- Existing README (for reference):\n${repoData.readme.substring(0, 1000)}` : ''}

Generate a complete, professional README.md with these sections:

# [Project Name]
[One-line description]

## 🚀 Features
- Feature 1
- Feature 2
- Feature 3
- Feature 4

## 🛠️ Tech Stack
- Technology 1
- Technology 2
- Technology 3

## 📦 Installation

\`\`\`bash
# Installation commands
git clone ${repoData.url}
cd ${repoData.name}
npm install
\`\`\`

## 💻 Usage

\`\`\`bash
# Usage commands
npm start
\`\`\`

## 🤝 Contributing
Guidelines for contributors

## 📄 License
MIT License

Output ONLY the markdown content, no explanations or meta-commentary.`;
}

/**
 * Generates prompt for Resume Bullets workflow
 */
export function getResumeBulletsPrompt(repoData: GitHubRepoData): string {
    return `You are a professional resume writer specializing in technical resumes for software engineers. Generate ATS-optimized resume bullet points for this GitHub project.

PROJECT DETAILS:
- Project Name: ${repoData.name}
- Description: ${repoData.description}
- Primary Technology: ${repoData.language}
- Topics: ${repoData.topics.join(', ')}
- Stars: ${repoData.stars}
- Forks: ${repoData.forks}
${repoData.readme ? `\n- README excerpt:\n${repoData.readme.substring(0, 800)}` : ''}

Generate 3-5 resume bullet points following this format:
-  [Strong action verb] + [What was built] + [Technologies used] + [Impact/Result/Metric]

REQUIREMENTS:
1. Start each bullet with a strong action verb (Built, Developed, Implemented, Designed, Optimized, Engineered, Created)
2. Include specific technologies and frameworks
3. Add quantifiable metrics when possible (users, performance, scale)
4. Each bullet should be 60-100 characters
5. ATS-friendly (use standard characters, avoid emojis in bullets)
6. Focus on achievements and impact
7. Use past tense for completed projects

EXAMPLE FORMAT:
-  Built a real-time chat application using React and Socket.io, supporting 100+ concurrent users
-  Implemented JWT authentication and role-based access control, reducing unauthorized access by 95%
-  Optimized database queries using indexing, improving response time by 40%

Output ONLY the bullet points (one per line with -  character), no explanations.`;
}

/**
 * Generates prompt for Study Notes workflow
 */
export function getStudyNotesPrompt(content: string): string {
    return `You are an educational content specialist. Create exam-friendly study notes from this content for a college student.

CONTENT:
${content.substring(0, 3500)}

Generate structured study notes in this EXACT format:

📌 Topic: [Main topic name]

🎯 Key Concepts:
-  Concept 1 with brief explanation
-  Concept 2 with brief explanation
-  Concept 3 with brief explanation
-  Concept 4 with brief explanation
-  Concept 5 with brief explanation

📖 Important Definitions:
-  Term 1: Clear, concise definition
-  Term 2: Clear, concise definition
-  Term 3: Clear, concise definition

💡 Examples & Use Cases:
1. Example 1 with brief context
2. Example 2 with brief context
3. Example 3 with brief context

⚡ Quick Revision Points:
-  One-liner point 1
-  One-liner point 2
-  One-liner point 3
-  One-liner point 4
-  One-liner point 5

🔗 Related Topics to Explore:
-  Related topic 1
-  Related topic 2
-  Related topic 3

GUIDELINES:
- Keep language simple and clear
- Focus on exam-relevant information
- Include formulas, dates, names if relevant
- Make revision points memorable
- Total length: 400-600 words

Output the notes in the exact format shown above with emoji headers.`;
}

/**
 * Generates prompt for LinkedIn Post workflow
 */
export function getLinkedInPostPrompt(content: string, userContext?: { name?: string; university?: string; major?: string }): string {
    return `You are a professional LinkedIn coach helping a BTech student create an engaging LinkedIn post. Write a professional post based on this content.

CONTENT:
${content.substring(0, 2500)}

STUDENT CONTEXT:
${userContext?.name ? `- Name: ${userContext.name}` : ''}
${userContext?.university ? `- University: ${userContext.university}` : '- University: [Your University]'}
${userContext?.major ? `- Major: ${userContext.major}` : '- Major: Computer Science Engineering'}
- Goal: Seeking placement opportunities, building professional network

Generate a LinkedIn post with this EXACT structure:

[HOOK - 1-2 punchy lines that grab attention]

[KEY INSIGHT - 3-4 lines explaining the main idea or learning]

[PERSONAL TAKEAWAY - 2-3 lines connecting this to your learning journey or career goals]

[CALL TO ACTION - 1 line encouraging engagement]

#Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4 #Hashtag5

REQUIREMENTS:
1. Total length: 250-400 characters (optimal for LinkedIn)
2. Professional but conversational tone
3. Use "As a CSE student..." or similar to add context
4. Focus on learning, growth, and career development narrative
5. Include relevant hashtags (3-5, no more)
6. Use short paragraphs (2-3 lines each) for readability
7. Avoid emojis in body text (LinkedIn professional standard)
8. End with engagement question or statement

AVOID:
- Generic motivational quotes
- Clickbait language
- Too much self-promotion
- Overly casual language

Output ONLY the post text in the exact format above, no meta-commentary.`;
}

/**
 * Generates captions for Social Media workflow (Existing)
 */
export function getSocialMediaCaptionsPrompt(content: string, platforms: string[]): string {
    return `Generate engaging social media captions for these platforms: ${platforms.join(', ')}

CONTENT:
${content.substring(0, 2000)}

For each platform, create a unique caption optimized for that platform's audience and format:

INSTAGRAM: Engaging, visual-focused, 150-200 chars, include emojis and hashtags
LINKEDIN: Professional, thought-leadership, 200-250 chars, minimal hashtags
TWITTER/X: Conversational, concise, under 280 chars, include relevant hashtags
FACEBOOK: Detailed, community-focused, 200-300 chars, storytelling approach

Output as JSON format with this structure:
{
  "instagram": { "text": "...", "hashtags": ["tag1", "tag2", "tag3"] },
  "linkedin": { "text": "...", "hashtags": ["tag1", "tag2"] },
  "twitter": { "text": "...", "hashtags": ["tag1", "tag2", "tag3"] },
  "facebook": { "text": "...", "hashtags": ["tag1", "tag2"] }
}

Generate captions for all requested platforms. Ensure each caption is unique and platform-optimized.`;
}
