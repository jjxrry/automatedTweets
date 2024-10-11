import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TwitterOAuth } from './components/tweetForm'

function App() {
    const [tweet, setTweet] = useState('')

    return (
        <>
            <div>
                <div>
                    <p>hello world</p>
                    <TwitterOAuth />
                    {/* will need to change this into a form input submission
                    <label htmlFor='tweet-submission'>click this to tweet!</label>
                    <input type='text' placeholder='tweet here'></input>
                    <a onClick={tweetBot()}>submit here</a> */}
                </div>
            </div>
        </>
    )
}

export default App
