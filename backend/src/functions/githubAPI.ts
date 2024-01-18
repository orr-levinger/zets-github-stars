import axios from 'axios';

const GITHUB_TOKEN = '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'; // Replace with your GitHub token
const GITHUB_API_URL = 'https://api.github.com';

const PER_PAGE = 10; // Max number of items per page

async function fetchRepositories(page: number) {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/search/repositories`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` },
            params: { q: 'stars:>1', sort: 'stars', order: 'desc', per_page: PER_PAGE, page }
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching data from GitHub API:', error);
        return [];
    }
}

async function fetchTopRepositories(pages: number): Promise<{name:string, stars: string}[]> {
    let page = 1;
    let allRepos = [];
    let repos;

    do {
        repos = await fetchRepositories(page);
        allRepos = allRepos.concat(repos);
        page++;
    } while (repos.length === PER_PAGE || page === pages); // Continue if the page was full, indicating there might be more results

    return allRepos.map(repo => ({
        name: repo.full_name,
        stars: repo.stargazers_count
    }));
}

fetchTopRepositories(3).then(repos => {
    repos.forEach(repo => {
        console.log(`Repository: ${repo.name}, Stars: ${repo.stars}`);
    });
});
