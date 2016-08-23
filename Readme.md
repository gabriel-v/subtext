Subtext is a peer-to-peer chat app that's meant to be beautiful and hackable.

It comes in the form of a _NodeJS_ web app, which runs on your server, and a UI
built with _react.js_, that loads as a web page. The project places great
emphasis on privacy and personal control.

**Privacy**, because nobody should listen in on your conversations. So you host
your own data and there's end-to-end encryption with
[Curve25519](https://en.wikipedia.org/wiki/Curve25519) (needs the review of an
infosec expert - ping me if you are one!)

**Personal control**, because no company or individual should have a say in how
you read and write messages and who you talk to. So the UI is completely
hackable, you can even outright replace it. The message protocol is simple,
open to extension by the community, which will surely agree on mutually
acceptable messages, and write software that understands them.

[![Build Status](https://travis-ci.org/mgax/subtext.svg?branch=master)](https://travis-ci.org/mgax/subtext)

## Installation

1. Clone the repository, install dependencies, build the UI:

   ```shell
   git clone https://github.com/mgax/subtext.git
   cd subtext
   npm install
   ./run build
   ```

2. Set environment variables and run the server.

   `SUBTEXT_AUTH_TOKEN`: a password that will be required to access the UI, so
   that other people can't read your private conversations.

   `SUBTEXT_VAR`: path to a data folder where subtext will create its database

   `SUBTEXT_PUBLIC_URL`: the address where you log into the UI and where you
   receive messages from peers.

   ```shell
   export SUBTEXT_AUTH_TOKEN='something secret'
   export SUBTEXT_VAR='/var/lib/subtext'
   export SUBTEXT_PUBLIC_URL='http://me.example.com'
   ./run server
   ```

   The server will listen on port 8000; you can change this by setting the
   `PORT` environment variable.

3. Optionally set up a reverse proxy. This is what you'd write in the nginx
   config:

   ```nginx
   location / {
     proxy_pass http://localhost:8000;
     proxy_set_header Upgrade $http_upgrade;
     proxy_set_header Connection $http_connection;
   }
   ```

   It's a good idea to secure your server with https at this point.

4. Open the public URL in your browser. You will be asked for the
   `SUBTEXT_AUTH_TOKEN` set above.

   Then, add a peer (I'm at `https://subtext.grep.ro:30443/card`), and chat
   away!

### Loading a custom UI
An easy way to hack on a live server is to replace its UI. Normally the server
uses `build/ui.js`, generated by `./run build`, but you can change that, to any
file on the host. In the web console in your browser, run:

```javascript
S.setCustomUi('/home/john/customUi.js')
```

Then reload the page. To change it back, run `setCustomUi('')`.

If the custom UI becomes unusable, you can load the default UI, by visiting the
page `/vanilla` instead of the homepage.
