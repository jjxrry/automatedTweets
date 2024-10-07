const queue = [
    { text: "test queue tweet no 1" },
    { text: "Second tweet" },
    { text: "Third tweet" },
];

// Standard function to process the tweet queue
export function processTweetQueue(oAuthAccessToken, getRequest) {
    return new Promise(async (resolve, reject) => {
        if (queue.length === 0) {
            console.log('no tweets in the q')
            return resolve
        }

        const tweet = queue[0]

        try {
            const response = await getRequest(tweet, oAuthAccessToken);
            console.log('Tweet sent:', response);
            queue.shift()
        } catch (error) {
            console.error('Error sending tweet:', error);
        }
        resolve(); // Resolve the promise after processing all tweets
    });
}

export default queue;
