import { useState } from "react";

export const TwitterOAuth = () => {
    const [pin, setPin] = useState('');
    const [tweet, setTweet] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);

    // this is wrong, need to actually enqueue the form, then after that is successful, then immediately make the submitRequest
    // do we return the data object to the backend as tweetData or can we just do it all in the submitWriteRequest after we get the pin
    //
    // this shit dont work
    // authurl is invalid on request
    const pinRequest = () => {
        // maybe we check here instead, pass it into formatTweet(tweet) then we can pass it into submit request as an valid formatted object
        if (tweet === '') {
            console.log('tweet is empty')
            return
        }

        //formatTweet(tweet)

        fetch('http://localhost:3000/api/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    console.log('failed network response')
                }
                setIsAuthorized(true)
                console.log('auth set to true')
                return response.json()
            })
            .then(data => {
                console.log('auth url copied: ', data.authorizationURL)
                navigator.clipboard.writeText(data.authorizationURL).then(() => {
                    alert('auth href copied to clipboard')
                })
            })
    }

    // submit needs to have the tweet form filled out fully
    const submitRequest = (tweetData) => {
        //if (tweet === '') {
        //    console.log('tweet is empty')
        //    return
        //}
        fetch('http://localhost:3000/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    console.log('failed to write')
                }
                return response.json()
            })
    }

    return (
        <div>
            <h2>Post a Tweet via OAuth</h2>

            <label htmlFor="tweet">Your Tweet:</label>
            <input
                type="text"
                id="tweet"
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
            />

            <button onClick={pinRequest}>Request Auth</button>
            <button onClick={submitRequest}>Tweet to Queue</button>

            {!isAuthorized ? (
                <div>
                    <p>
                        wait for pin access
                    </p>
                </div>

            ) : (
                <div>
                    <label htmlFor="pin">Enter PIN from Twitter:</label>
                    <input
                        type="text"
                        id="pin"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};
