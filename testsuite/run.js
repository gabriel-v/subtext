import Mocha from 'mocha'

const mocha = new Mocha()
mocha.addFile('testsuite/messages.js')
mocha.addFile('testsuite/publicApi.js')
mocha.run()
