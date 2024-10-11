import { useState } from "react";

export const TwitterOAuth = () => {
    const [pin, setPin] = useState('');
    const [tweet, setTweet] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [oauthToken, setOauthToken] = useState(null);
    const [oauthTokenSecret, setOauthTokenSecret] = useState(null);

    // this is a shit show right now, the backend isn't setup at all
    // we probably don't need to auth, we just call the function itself?
    // 
    // Function to start the OAuth flow
    // probably can simplify because the oauth needs to be manual anyway
    const startOAuthFlow = async () => {
        try {
            // Step 1: Request authorization URL from the backend
            const authResponse = await fetch('/auth/twitter', { method: 'POST' });
            const { url, oauth_token, oauth_token_secret } = await authResponse.json();

            // Open the authorization URL in a new window/tab
            window.open(url, '_blank');

            // Store tokens for use in the next step
            setOauthToken(oauth_token);
            setOauthTokenSecret(oauth_token_secret);

            setIsAuthorized(true);
        } catch (error) {
            console.error('Error starting OAuth flow:', error);
        }
    };

    // Function to complete OAuth flow and send a tweet
    const submitTweet = async () => {
        try {
            // Step 2: Send the verifier PIN to the backend to complete OAuth
            const response = await fetch('/auth/twitter/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oauth_token: oauthToken,
                    oauth_token_secret: oauthTokenSecret,
                    verifier: pin,
                    tweet: tweet,
                }),
            });

            const data = await response.json();
            console.log('Tweet Response:', data);

            // Clear the form after success
            setPin('');
            setTweet('');
            setIsAuthorized(false);
        } catch (error) {
            console.error('Error submitting tweet:', error);
        }
    };

    return (
        <div>
            <h2>Post a Tweet via OAuth</h2>

            {!isAuthorized ? (
                <button onClick={startOAuthFlow}>Authorize Twitter</button>
            ) : (
                <div>
                    <label htmlFor="pin">Enter PIN from Twitter:</label>
                    <input
                        type="text"
                        id="pin"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />

                    <label htmlFor="tweet">Your Tweet:</label>
                    <input
                        type="text"
                        id="tweet"
                        value={tweet}
                        onChange={(e) => setTweet(e.target.value)}
                    />

                    <button onClick={submitTweet}>Submit Tweet</button>
                </div>
            )}
        </div>
    );
};
