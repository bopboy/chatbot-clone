import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Axios from 'axios'
import { saveMessage } from '../_actions/message_actions'
import Message from './Sections/Message'
import { List, Icon, Avatar } from 'antd'
import Card from './Sections/Card'

function Chatbot() {
    const dispatch = useDispatch()
    const messageFromRedux = useSelector(state => state.message.messages)
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
        dispatch(saveMessage(conversation))
        console.log('message I sent : ', conversation)

        const textQueryVariable = { text }
        try {
            const response = await Axios.post('/api/dialogflow/textQuery', textQueryVariable)
            for (let content of response.data.fulfillmentMessages) {
                let conversation = {
                    who: 'bot',
                    content: content
                }
                // console.log(conversation)
                dispatch(saveMessage(conversation))
            }
        } catch (err) {
            conversation = {
                who: 'bot',
                content: { text: { text: '에러 발생. 문제를 해결해!!' } }
            }
            dispatch(saveMessage(conversation))
            // console.log(conversation)
        }
    }
    const eventQuery = async (event) => {
        const eventQueryVariable = { event }
        try {
            const response = await Axios.post('/api/dialogflow/eventQuery', eventQueryVariable)
            for (let content of response.data.fulfillmentMessages) {
                let conversation = {
                    who: 'bot',
                    content: content
                }
                // console.log(conversation)
                dispatch(saveMessage(conversation))
            }
        } catch (err) {
            let conversation = {
                who: 'bot',
                content: { text: { text: '에러 발생. 문제를 해결해!!' } }
            }
            // console.log(conversation)
            dispatch(saveMessage(conversation))
        }
    }
    const renderCards = (cards) => {
        return cards.map((card, i) => <Card key={i} cardInfo={card.structValue} />)
    }
    const renderOneMessage = (message, i) => {
        // console.log('message', message)
        if (message.content && message.content.text && message.content.text.text)
            return <Message key={i} who={message.who} text={message.content.text.text} />
        else if (message.content && message.content.payload.fields.card) {
            const avatarSrc = message.who === 'bot' ? <Icon type="robot" /> : <Icon type="smile" />
            return (
                <List.Item key={i} style={{ padding: '1rem' }}>
                    <List.Item.Meta
                        avatar={<Avatar icon={avatarSrc} />}
                        title={message.who}
                        description={renderCards(message.content.payload.fields.card.listValue.values)}
                    />
                </List.Item>
            )
        }
    }
    const renderMessage = (returndMessages) => {
        if (returndMessages) return returndMessages.map((message, i) => renderOneMessage(message, i))
        else return null
    }
    return (
        <div style={{ height: 700, width: 700, border: '1px solid black', borderRadius: '3px', background: 'skyblue' }}>
            <div style={{ height: 644, width: '100%', overflow: 'auto' }}>
                {renderMessage(messageFromRedux)}
            </div>
            <input
                type="text"
                style={{ margin: 0, width: '100%', height: 50, borderRadius: '2px', padding: '3px', fontSize: '1rem' }}
                placeholder="Send a Message..."
                onKeyPress={keyPressHandle}
            />
        </div>
    )
}

export default Chatbot