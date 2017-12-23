const express = require('express');
const cluster = require('cluster');

const app = express();

const {getPinnedRepos} = require('./src');

const PORT = process.env.PORT || 3001;
const CONCURRENCY = process.env.WEB_CONCURRENCY || 1;

if (cluster.isMaster) {
    for (let i = 0; i < CONCURRENCY; i+= 1) {
        cluster.fork();
    }

    cluster.on('online', worker => {
        console.log(`Worker ${worker.id} is online.`);
    })

    cluster.on('exit', worker => {
        console.log(`Worker ${worker.id} died. Replacing...`);
        cluster.fork();
    })
} else {
    app.get('/:username', (req, res) => {
        const username = req.params.username;
        getPinnedRepos(username).then(data => res.json(data)).catch(err => {
            console.error(err);
            return res.json({
                message: `Cannot pull pinned repos: ${err.message}`,
            });
        })
    })
    
    app.listen(PORT, err => {
        if (err) {
            console.error(`Cannot run server on port ${PORT}`)
        }
    })    
}
