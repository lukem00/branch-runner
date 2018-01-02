const cmd = require('node-cmd');
const express = require('express');
const portfinder = require('portfinder');
const kill = require('tree-kill');
const fs = require('fs');
const path = require('path');

const app = express();

const processes = [];

app.get('/', (req, res) => {
    const src = fs.readFileSync(path.join(__dirname, 'bookmark.js'),{ encoding: 'utf8' });
    const instruction = `Bookmark this link or drag it to your bookmarks bar. Use it to run a given branch.`;
    const link = `<a href="javascript:${src}" onclick="alert('${instruction}');return false;">RunBranch</a>`;
    res.send(instruction + ' ' + link);
});

app.get('/list', (req, res) => {
    if (processes.length > 0) {
        res.send('Processes:\n<ul>' + processes.map(
            p => `<li>${p.pid} | :${p.port} | ${p.branch}</li>`
        ).join('\n') + '</ul>');
    } else {
        res.send('No processes found');
    }
});

app.get('/start', (req, res) => {
    
    if (processes.length > 0) console.log('Killing processes');
    processes.forEach(process => {
        kill(process.pid, err => console.log(`Process #${process.pid}: ` + 
            (err ? `ERROR killing process: ${err}` : 'Killed successfully ')));
    });
    // XXX Naively assume all processes were successfully killed
    processes.splice(0, processes.length);
    
    let branch = req.query && req.query.b || 'master';
    let url = req.query && req.query.h || 'about:blank';
    
    portfinder.getPort(function (err, port) {
        if (err) throw err;
        const process = cmd.get(`cd ../repo-sample-app && git checkout ${branch} && npm install && npm start -- --open --port=${port}`, function(err, data) {
            if (err) {
                console.log('PID: ' + process.pid);
                console.log('Command exit code: ' + err.code);
                console.log('Command terminated by signal: ' + err.signal);
                console.log('Command error: ' + err);
                return;
            }
            console.log('Command finished without error, output:\n' + data);
        });
        processes.push({
            pid: process.pid,
            port: port,
            branch: branch
        });
        console.log('Branch: ' + branch + '\nCommand invoked PID: ' + process.pid);
        res.send(`<ul>
            <li>URL: ${url}</li>
            <li>Branch: ${branch}</li>
            <li>PID: ${process.pid}</li>
            <li>Port: ${port}</li>
        </ul>`);
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log('Listening on port ' + PORT));
