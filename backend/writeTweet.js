import fs from 'fs'
import readline from 'readline'

export function writeToQueue(tweet) {
    const queuePath = 'queue.json'
    let queue = []

    if (fs.existsSync(queuePath)) {
        queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'))
    }

    queue.push(tweet)
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 4))
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const promptInput = () => {
    rl.question("Write the Tweet: ", (tweetText) => {
        const tweet = { text: tweetText }

        writeToQueue(tweet)
        console.log(tweet, ' added to queue')

        rl.close()
    })
}

promptInput()
