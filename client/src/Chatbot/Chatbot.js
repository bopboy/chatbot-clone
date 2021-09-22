import React, { useEffect } from 'react'
import Axios from 'axios'

function Chatbot() {
    useEffect(() => {
        eventQuery('WelcomeToMyWorld')
    }, [])
    const keyPressHandle = (e) => {
        if (e.key === "Enter") {
            if (!e.target.value) return alert('뭔가 입력을 하세요')
            textQuery(e.target.value)
            e.target.value = ''
        }
    }
    const textQuery = async (text) => {
        let conversation = {
            who: 'user',
            content: {
                text: { text }
            }
        }
        const textQueryVariable = { text }
        try {
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariable)
            const content = response.data.fulfillmentMessages[0]
            conversation = {
                who: 'bot',
                content: { content }
            }
            console.log(conversation)
        } catch (err) {
            conversation = {
                who: 'bot',
                content: { text: { text: '에러 발생. 문제를 해결해!!' } }
            }
            console.log(conversation)
        }
    }
    const eventQuery = async (event) => {
        const eventQueryVariable = { event }
        try {
            const response = await Axios.post('/api/dialogflow/eventQuery', eventQueryVariable)
            const content = response.data.fulfillmentMessages[0]
            let conversation = {
                who: 'bot', content
            }
            console.log(conversation)
        } catch (err) {
            let conversation = {
                who: 'bot',
                content: { text: { text: '에러 발생. 문제를 해결해!!' } }
            }
            console.log(conversation)
        }
    }
    return (
        <div style={{ height: 700, width: 700, border: '1px solid black', borderRadius: '3px', textAlign: 'center', background: 'skyblue' }}>
            <div style={{ height: 644, width: '100%', overflow: 'auto' }}>

            </div>
            <input
                type="text"
                style={{ margin: '0px 1px', width: '99%', height: 50, borderRadius: '2px', padding: '3px', fontSize: '1rem' }}
                placeholder="Send a Message..."
                onKeyPress={keyPressHandle}
            />
        </div>
    )
}

export default Chatbot
