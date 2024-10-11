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

            // create archival object and archive the tweet
            let tweetObject = ({ ...tweet, response, timestamp: new Date().toISOString() });
            const archivePath = 'tweetArchive.json'
            let archive = []
            // check if the archive exists, if not then use the initialized archive
            if (fs.existsSync(archivePath)) {
                archive = JSON.parse(fs.readFileSync(archivePath, 'utf-8'))
            }
            archive.push(tweetObject)
            fs.writeFileSync(archivePath, JSON.stringify(archive, null, 4))

            queue.shift()
            fs.writeFileSync('queue.json', JSON.stringify(queue, null, 4))
        } catch (error) {
            console.error('Error sending tweet:', error);
            reject(error)
        }
        resolve();
    });
}

export default queue;
