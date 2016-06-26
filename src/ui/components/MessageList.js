import classNames from 'classnames'
import { h, sorted } from '../utils.js'
import Message from './Message.js'

export default class MessageList extends React.Component {

  render() {
    let {className, peer} = this.props
    let messages = sorted(Object.values(peer.messages), (m) => m.time)
    return (
      <ul className={classNames(className, 'messageList')}
          onScroll={h(() => { this.onScroll() })}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </ul>
    )
  }

  componentDidMount() {
    this.bottom = true
    this.updateScroll = () => {
      if(this.bottom) {
        let node = ReactDOM.findDOMNode(this)
        node.scrollTop = node.scrollHeight - node.offsetHeight
      }
    }
    window.addEventListener('resize', this.updateScroll)
  }

  onScroll() {
    let node = ReactDOM.findDOMNode(this)
    this.bottom = node.scrollTop >= node.scrollHeight - node.offsetHeight
  }

  componentDidUpdate() {
    this.updateScroll()
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.updateScroll)
  }
}
