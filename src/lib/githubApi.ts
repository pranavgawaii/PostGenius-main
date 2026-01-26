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
        // 2. API Calls - Repo Data
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, { headers });

        if (repoResponse.status === 404) {
            throw new Error("Repository not found. Make sure the repository is public.");
        }

        if (!repoResponse.ok) {
            throw new Error(`GitHub API Error: ${repoResponse.statusText}`);
        }

        const data = await repoResponse.json();

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
