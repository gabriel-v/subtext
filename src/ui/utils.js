export waiter from '../waiter.js'

export function h(callback, ... args) {
  return function(e) {
    e.preventDefault()
    callback(e, ... args)
  }
}

export function sorted(list, keyFunc=((i) => i)) {
  return list.slice().sort((a, b) => {
    let ka = keyFunc(a)
    let kb = keyFunc(b)
    if(ka < kb) return -1
    if(ka > kb) return 1
    return 0
  })
}

export function any(list) {
  for(let item of list) {
    if(item) return true
  }
  return false
}

export function waiter(promise) {
  promise
    .then((rv) => { if(rv !== undefined) console.log(rv) })
    .catch((e) => { console.error(e.stack || e) })
}

export function errorScreen(message, ... log) {
  console.warn(... log)
  return <p>{message}</p>
}

export function timeMs() {
  return new Date().getTime()
}

export function escape(txt) {
  return txt
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&#34;')
    .replace(/'/g, '&#39;')
}

export class Logger {

  constructor() {
    this.level = {
      debug: !! localStorage.subtext_debug,
    }
  }

  error(... args) {
    console.error(... args)
  }

  warn(... args) {
    console.warn(... args)
  }

  info(... args) {
    console.log(... args)
  }

  debug(... args) {
    if(this.level.debug) console.debug(... args)
  }

}
