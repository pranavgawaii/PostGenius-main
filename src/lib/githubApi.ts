export interface GitHubRepoData {
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    topics: string[];
    readme: string;
    owner: string;
    url: string;
    fileStructure?: string;
}

/**
 * Fetches repository data from GitHub public API
 * @param repoUrl Full GitHub repository URL
 * @returns Parsed repository data
 */
export async function fetchGitHubRepo(repoUrl: string): Promise<GitHubRepoData> {
    // 1. URL Parsing
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
        throw new Error("Invalid GitHub URL. Must be in format: github.com/owner/repo");
    }

    const [, owner, repo] = match;
    const cleanRepo = repo.replace('.git', ''); // Handle .git suffix

    const headers = {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    };

    try {
        // 2. API Calls - Repo Data (with retry logic for Node.js timeout issues)
        let repoResponse: Response | null = null;
        let data: any = null;
        const maxRetries = 3;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`GitHub API attempt ${attempt}/${maxRetries}...`);
                repoResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
                    headers,
                    signal: AbortSignal.timeout(30000) // 30s timeout
                });

                if (repoResponse.status === 404) {
                    throw new Error("Repository not found. Make sure the repository is public.");
                }

                if (!repoResponse.ok) {
                    throw new Error(`GitHub API Error: ${repoResponse.statusText}`);
                }

                data = await repoResponse.json();
                console.log(`✓ GitHub API succeeded on attempt ${attempt}`);
                break; // Success
            } catch (err: any) {
                if (err.message.includes("Repository not found")) {
                    throw err; // Don't retry 404s
                }

                console.warn(`GitHub API attempt ${attempt} failed:`, err.message);

                if (attempt < maxRetries) {
                    const backoffMs = Math.pow(2, attempt) * 1000;
                    console.log(`Retrying in ${backoffMs}ms...`);
                    await new Promise(resolve => setTimeout(resolve, backoffMs));
                } else {
                    throw new Error(`GitHub API failed after ${maxRetries} attempts: ${err.message}`);
                }
            }
        }

        // 3. API Calls - README
        let readme = "No README found";
        const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/readme`, {
            headers: {
                ...headers,
                'Accept': 'application/vnd.github.raw' // Request raw content
            }
        });

        if (readmeResponse.ok) {
            readme = await readmeResponse.text();
        }

        // 4. API Calls - File Tree (Optional, limited)
        let fileStructure = "";
        /* 
         * Skipping file tree for now to keep it simple and fast. 
         * Can be uncommented if needed later.
         */

        // 5. Return Data
        return {
            name: data.name,
            description: data.description || "No description provided",
            stars: data.stargazers_count,
            forks: data.forks_count,
            language: data.language || "Not specified",
            topics: data.topics || [],
            readme: readme,
            owner: data.owner.login,
            url: data.html_url,
            fileStructure: fileStructure
        };

    } catch (error: any) {
        console.error("GitHub Fetch Error:", error);
        // Rethrow specific errors, wrap others
        if (error.message.includes("Repository not found") || error.message.includes("Invalid GitHub URL")) {
            throw error;
        }
        throw new Error("Failed to fetch repository data from GitHub");
    }
}
