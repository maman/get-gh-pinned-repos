const express = require('express')

const app = express();

const {getPinnedRepos} = require('./src');

const PORT = process.env.PORT || 3001;

app.get('/:username', (req, res) => {
    const username = req.params.username;
    getPinnedRepos(username).then(data => {
        console.log(data);
        return res.json(data);
    }).catch(err => {
        console.error(err);
        return res.json({
            message: `Cannot pull pinned repos: ${err.message}`,
        });
    })
})

app.listen(PORT, (err) => {
    if (err) {
        console.error(`Cannot run server on port ${PORT}`)
    } else {
        console.error(`Server running on ${PORT}`)
    }
})
