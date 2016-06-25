const NEW_PEER = 'NEW_PEER'
export function newPeer(peer) {
  return {type: NEW_PEER, peer}
}

const NEW_MESSAGE = 'NEW_MESSAGE'
export function newMessage(peerId, message) {
  return {type: NEW_MESSAGE, peerId, message}
}

const SELECT_PEER = 'SELECT_PEER'
export function selectPeer(peerId) {
  return {type: SELECT_PEER, peerId}
}

const MARK_UNREAD = 'MARK_UNREAD'
export function markUnread(peerId, unread) {
  return {type: MARK_UNREAD, peerId, unread}
}

const INITIAL_STATE = {
  peers: {},
}

function reduce(state=INITIAL_STATE, action) {
  switch(action.type) {

    case NEW_PEER: {
      return {
        ... state,
        peers: {
          ... state.peers,
          [action.peer.id]: {
            messages: [],
            ... state.peers[action.peer.id],
            ... action.peer,
          },
        },
      }
    }

    case NEW_MESSAGE: {
      let peer = state.peers[action.peerId]
      if(! peer) return state
      if(peer.messages[action.message.id]) return state
      return {
        ... state,
        peers: {
          ... state.peers,
          [peer.id]: {
            ... peer,
            messages: {
              ... peer.messages,
              [action.message.id]: {
                ... action.message,
                time: new Date(action.message.time),
              }
            },
          },
        },
      }
    }

    case SELECT_PEER: {
      return {
        ... state,
        selectedPeerId: action.peerId,
      }
    }

    case MARK_UNREAD: {
      let peer = state.peers[action.peerId]
      if(! peer) return state
      return {
        ... state,
        peers: {
          ... state.peers,
          [peer.id]: {
            ... peer,
            unread: action.unread,
          }
        }
      }
    }

    default: {
      return state
    }

  }
}

export function createStore() {
  return Redux.createStore(reduce)
}
