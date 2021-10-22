const http = require('http')

const createHandle = require('github-webhook-handle')

const {
    spawn
} = require('child_process')

const handle = createHandle({
    path: '/docker_deploy',
    secret: '*****'
})

function run_cmd(cmd, args, callback) {
    const child = spawn(cmd, args)
    let resp = ''
    child.stdout.on('data', function (buffer) {
        resp += buffer.toString()
    })
    child.stdout.on('end', function () {
        callback(resp)
    })
}

http.createServer((req, res) => {
    handle(req, res, err => {
        res.statusCode = 404
        res.end('no such location')
    })
}).listen(8888, () => {
    console.log('webhook :>>  at 8888'); // hk-log
})

handle.on('error', error => {
    console.log('error :>> ', error.message); // hk-log
})


handle.on('*', event => { // *号改成 push 就之后处理 push
    console.log(' Receive *:>> ', event.payload); // hk-log

    run_cmd('sh', ['./deploy-dev.sh'], function (text) {
        console.log('text :>> ', text); // hk-log
    })
})
