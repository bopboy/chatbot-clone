import React from 'react'
import { List, Icon, Avatar } from 'antd'

function Message(props) {
    const avatarSrc = props.who === 'bot' ? <Icon type="robot" /> : <Icon type="smile" />
    return (
        <List.Item style={{ padding: '1rem' }}>
            <List.Item.Meta
                avatar={<Avatar icon={avatarSrc} />}
                title={props.who}
                description={props.text}
            />
        </List.Item>
    )
}

export default Message
