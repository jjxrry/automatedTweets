// remove the last item from the queue (most recent)
import fs from 'fs'

export function removeFirst() {
    const queuePath = 'queue.json'
    let queue = []

    if (fs.existsSync(queuePath)) {
        queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'))
    }

    let removedTweet = queue.pop()

    if (removedTweet) {
        console.log(removedTweet)
    } else {
        console.log("no tweet to remove")
    }
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 4))
}

removeFirst()
