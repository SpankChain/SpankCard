# SpankCard

> In-browser micropayments wallet.


# Usage

To use SpankCard one has to plug it into a web page as yet another javascript library. In future, it will be available as an NPM package.
For now, one has to put this to the web page code:

# Development

## Prerequisites

You are expected to have `yarn` package manager installed globally on your machine.
For installation instructions go to the [official web site](https://yarnpkg.com/en/docs/install).

## Install

```
git clone https://github.com/SpankChain/SpankCard
cd SpankCard
yarn install
```

Rename development.env to .env and set some environment variables:
```
FRAME_PORT=9090
HARNESS_PORT=9999
CONTRACT_ADDRESS=0x**************************
RPC_URL=
```

## Run
```
yarn run harness
```
That command starts a web server to play with SpankCard on localhost.
Open browser on `http://localhost:9999` and click on some buttons.

## WTF is Harness
It demonstrates SpankCard work on localhost. It runs a web page (SpankCard client) on localhost:9999.
Serves SpankCard frame (stores privateKeys a-la MetaMascara) from localhost:9090. Different ports
make the browser think the pages belong to different origins, thus should be secured
against each other malicious behaviour.

## Copyright Notice
SpankCard use icons from icons8.com
