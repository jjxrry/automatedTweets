import { useState } from "react";

export const TwitterOAuth = () => {
    const [pin, setPin] = useState('');
    const [tweet, setTweet] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);

    // this is wrong, need to actually enqueue the form, then after that is successful, then immediately make the submitRequest
    const enqueueReqeust = () => {

    }

    const submitRequest = () => {
        fetch('http://localhost:3000/api/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok){
                    console.log('failed network response')
                }
                return response.json()
            })
            .then(data => {
                console.log('auth url copied: ', data.authorizationURL)
                navigator.clipboard.writeText(data.authorizationURL).then(() => {
                    alert('auth href copied to clipboard')
                })
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

            <button onClick={submitRequest}>Request Auth</button>

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
