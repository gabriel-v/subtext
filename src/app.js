import 'babel-polyfill'
import classNames from 'classnames'
import './style.scss'
import { React, ReactRedux, sodium } from './vendor.js'
import { randomKeyPair, createBox, boxId } from './messages.js'
import {
  createStore,
  newPeer,
  newMessage,
} from './store.js'
const { Provider, connect } = ReactRedux

function h(callback, ... args) {
  return function(e) {
    e.preventDefault()
    callback(e, ... args)
  }
}

function sorted(list, keyFunc=((i) => i)) {
  return list.slice().sort((a, b) => {
    let ka = keyFunc(a)
    let kb = keyFunc(b)
    if(ka < kb) return -1
    if(ka > kb) return 1
    return 0
  })
}

function Compose({className, peer, sendMessage}) {
  function onSubmit(e) {
    let input = e.target.querySelector('[name=text]')
    waiter(sendMessage(peer.id, {
      type: 'Message',
      text: input.value,
    }), false)
    input.value = ''
  }

  return (
    <form onSubmit={h(onSubmit)}
        className={classNames(className, 'compose')}>
      <input name='text' placeholder='message ...' />
      <button type='submit'>send</button>
    </form>
  )
}

function Messages({className, peer}) {
  let messages = sorted(Object.values(peer.messages), (m) => m.time)
  return (
    <ul className={classNames(className, 'messageList')}>
      {messages.map((message) => (
        <li key={message.id}>
          <p className='message-sender'>{message.from}</p>
          <p className='message-time'>{''+message.time}</p>
          <p className='message-text'>{message.message.text}</p>
        </li>
      ))}
    </ul>
  )
}

function Conversation({peer, sendMessage}) {
  return (
    <div className='conversation'>
      <Messages className='conversation-messages' peer={peer} />
      <Compose
        className='conversation-compose'
        peer={peer}
        sendMessage={sendMessage}
        />
    </div>
  )
}

function Peer({peer, deletePeer}) {
  function onDelete() {
    if(! confirm(`delete ${peer.url}?`)) return
      deletePeer(peer.id)
  }

  return (
    <div className='peer'>
      {peer.url}
      <button onClick={h(onDelete)}>delete</button>
    </div>
  )
}

function App({peers, addPeer, deletePeer, sendMessage}) {
  let selectedPeerId = sorted(Object.keys(peers))[0]
  let selectedPeer = peers[selectedPeerId]

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-sm-4 app-peers'>
          <button
            onClick={h(() => {
              let url = prompt('peer url')
              addPeer(url)
            })}
            >add peer</button>
          <ul>
            {Object.values(peers).map((peer) => (
              <li key={peer.id}>
                <Peer peer={peer} deletePeer={deletePeer} />
              </li>
            ))}
          </ul>
        </div>
        {selectedPeer && (
          <div className='col-sm-8 app-conversation'>
            <Conversation peer={selectedPeer} sendMessage={sendMessage} />
          </div>
        )}
      </div>
    </div>
  )
}

function waiter(promise, printRv=true) {
  promise
    .then((rv) => { if(printRv || rv !== undefined) console.log(rv) })
    .catch((e) => { console.error(e.stack || e) })
}

window.main = function() { waiter((async function() {

  let store = createStore()
  const socket = io.connect('/')

  async function send(type, ... args) {
    let [err, res] = await new Promise((resolve) => {
      socket.emit(type, args, resolve)
    })
    if(err) throw new Error(err)
    return res
  }

  const ConnectedApp = connect((state) => state, mapDispatchToProps)(App)
  let app = ReactDOM.render((
    <Provider store={store}>
      <ConnectedApp />
    </Provider>
  ), document.querySelector('#app'))

  function mapDispatchToProps(dispatch) { return {

    addPeer: async function(url) {
      let peer = await send('addPeer', url)
      dispatch(newPeer(peer))
    },

    deletePeer: async function(peerId) {
      await send('deletePeer', peerId)
      window.location.reload()
    },

    sendMessage: async function(peerId, message) {
      await send('sendMessage', peerId, message)
    },

  }}

  window.S = {
    app: app,
    store: store,
    send: send,
    waiter: waiter,
  }

  async function loadState() {
    socket.on('message', (peerId, message) => {
      store.dispatch(newMessage(peerId, message))
    })
    let peers = await send('getPeers')
    for(let peer of peers) {
      store.dispatch(newPeer(peer))
      let messages = await send('getMessages', peer.id)
      for(let message of messages) {
        store.dispatch(newMessage(peer.id, message))
      }
    }
  }

  await loadState()

})(), false) }
