const axios = require('axios');
const cheerio = require('cheerio');

function getPinnedRepos(username) {
    return axios.get(`https://github.com/${username}`)
        .then(res => res.data)
        .then(cheerio.load)
        .then(cash => cash('.pinned-repo-item.public'))
        .then(repos => repos.map((_, link) => cheerio.load(link)('a').attr('href').replace(/^\//, '')).get())
        .then(repos => repos.map(repo => {
            const [user, name] = repo.split('/');
            return {
                name,
                user,
                href: `https://github.com/${repo}`,
            };
        }))
}

module.exports = {
    getPinnedRepos,
}
