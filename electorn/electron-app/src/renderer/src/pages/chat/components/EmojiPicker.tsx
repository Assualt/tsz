import { Layout, Row, Col, Button, Divider, Space } from 'antd'
import { SearchOutlined, SmileOutlined } from '@ant-design/icons'

interface PickEmoji {
  func: (emoji: string) => void
}

const EmojiPicker = (pros: PickEmoji): JSX.Element => {
  const EmojiPanel = (): JSX.Element => {
    // 更丰富的表情符号列表
    const EmojiList: string[] = [
      '😀',
      '😃',
      '😄',
      '😁',
      '😆',
      '😅',
      '😂',
      '🤣',
      '🥲',
      '🥹',
      '☺️',
      '😊',
      '😇',
      '🙂',
      '🙃',
      '😉',
      '😌',
      '😍',
      '🥰',
      '😘',
      '😗',
      '😙',
      '😚',
      '😋',
      '😛',
      '😝',
      '😜',
      '🤪',
      '🤨',
      '🧐',
      '🤓',
      '😎',
      '🥸',
      '🤩',
      '🥳',
      '🥴',
      '😵',
      '🤯',
      '🥱',
      '😴',
      '🤤',
      '😪',
      '😫',
      '😖',
      '😣',
      '😞',
      '😓',
      '😩',
      '😫',
      '🥺',
      '😢',
      '😭',
      '😤',
      '😠',
      '😡',
      '🤬',
      '🤯',
      '😳',
      '🥵',
      '🥶',
      '😱',
      '😨',
      '😰',
      '😥',
      '😓',
      '🤗',
      '🤔',
      '🤭',
      '🤫',
      '🤥',
      '😶',
      '😐',
      '😑',
      '😬',
      '🙄',
      '😯',
      '😦',
      '😧',
      '😮',
      '😲',
      '🥱',
      '😴',
      '🤤',
      '😪',
      '😵',
      '🤐',
      '🥴',
      '🤢',
      '🤮',
      '🤧',
      '😷',
      '🤒',
      '🤕',
      '🤑',
      '🤠',
      '😈',
      '👿',
      '👹',
      '👺',
      '💀',
      '☠️',
      '👻',
      '👽',
      '👾',
      '🤖',
      '🎃',
      '😺',
      '😸',
      '😹',
      '😻',
      '😼',
      '😽',
      '🙀',
      '😿',
      '😾'
    ]

    return (
      <>
        <Row>
          {EmojiList.map((emoji, index) => (
            // 修改 key 属性，使用 index 作为唯一标识
            <Col key={`emoji-${index}`} span={2} flex={1}>
              <Button
                type="text"
                style={{ fontSize: '20px' }}
                onClick={() => {
                  setClickedEmoji(emoji)
                }}
              >
                {emoji}
              </Button>
            </Col>
          ))}
        </Row>
      </>
    )
  }

  const { func } = pros
  const setClickedEmoji = (emoji: string): void => {
    if (!func) return
    func(emoji)
  }

  return (
    <>
      <Layout>
        <div style={{ width: '400px' }}>
          <EmojiPanel />
          <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
          <Space style={{ float: 'left' }}>
            <Button type="text" icon={<SearchOutlined />} />
            <Button type="text" icon={<SmileOutlined />} />
          </Space>
        </div>
      </Layout>
    </>
  )
}

export default EmojiPicker
