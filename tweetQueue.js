import fs from 'fs'

const queue = JSON.parse(fs.readFileSync('queue.json', 'utf-8'))

// Standard function to process the tweet queue
export function processTweetQueue(oAuthAccessToken, getRequest) {
    return new Promise(async (resolve, reject) => {
        if (queue.length === 0) {
            console.log('no tweets in the q')
            return resolve
        }

        const tweet = queue[0]

        try {
            const response = await getRequest(oAuthAccessToken, tweet);
            console.log('Tweet sent:', response);
            queue.shift()
            fs.writeFileSync('queue.json', JSON.stringify(queue, null, 2))
        } catch (error) {
            console.error('Error sending tweet:', error);
        }
        resolve(); // Resolve the promise after processing all tweets
    });
}

export default queue;
