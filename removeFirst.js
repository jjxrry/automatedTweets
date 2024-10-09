// remove the first item in the queue (next one in line)
import fs from 'fs'

export function removeFirst() {
    const queuePath = 'queue.json'
    let queue = []

    if (fs.existsSync(queuePath)) {
        queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'))
    }

    let removedTweet = queue.shift()

    if (removedTweet) {
        console.log(removedTweet)
    } else {
        console.log("no tweet to remove")
    }
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 4))
}

removeFirst()
