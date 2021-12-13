# Changelog
All notable changes to this project will be documented in this file

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
#### Added
- Gilt queue list
- Gilt summary
- Council lists
- Council summary
- Motions list
- Dispatch queue list and Scheduled list on Dispatch tab

## [0.1.0] - 2021-11-26
#### Added
- Collection loader
- Ethereum bridge  tab
- Metamask form
- Web3 provider module
- Link to open this site of the metamask mobile application
- Link terms of use
- Owner check NFT on bridge
- No data message on staking tab
- Crowdloan list and crowdloan info
- Open graph meta information
- Data to connect the network in metamask
- Full balance tooltip
- Bids list logic parachains auction tab
- Chunks of webpack from pages

#### Changed
- Version api packages
- Temples icons
- Chain error message on bridge
- Logic native token deposit

#### Fixed
- Display amount on unfinished flow list
- Balance display on validators
- Getting NFT on Bridge tokens form
- Bridge contract on Withdraw NFT
- Gitlab CI
- Localization `mainet` -> `mainnet`

#### Removed
- Module `@intlify/vue-i18n-loader`

## [0.1.0-rc.3] - 2021-10-19
#### Added
- Auctions tab shell
- Crowdloan tab shell
- Gilt page shell
- Society page shell
- Democracy page shell
- Council page shell
- Treasury page shell
- Bounties page shell
- Tech comm page shell
- Tooltip directive
- Params info on recent events

#### Removed
- Tooltip component

## [0.1.0-rc.2] - 2021-10-15
#### Added
- Temples icons
- Amount on staking account row 
- Social links on footer
- Progress bar component
- Progress bar on epoch time
- Unstake logic for staking
- Staking balance on account balances
- Parachains page
- Parathreads tab
- Settings page

#### Changed
- Component i18n to global
- Link design
- App style structure 
- Fields disabled color
- Logo on mobile display

## [0.1.0-rc.1] - 2021-09-25
#### Added
- Validators
- Lodash
- Moment
- I18n
- StatusMessage
- ErrorHandler
- Initiated Api
- Subscription to block headers and events
- Block info
- Blockchain header and event in state
- Event calendar page
- Branding
- Navigation
- Footer
- Page topbar
- Event calendar design
- Chain info design
- Loaders
- Clipboard field
- Custom icons
- Tooltip
- System events on Block info
- Logs on Block info
- No data message
- App button
- Input fields
- Search field on Block Info
- No data message on Block Info
- Account balances
- Account address
- Wallet page
- `husky`
- Select field
- Generate and Create account form
- Account name on account row
- Steps component
- Transfer form
- ApiCaller
- Account deposit on Account row
- Status message on transfer form
- Holders page
- Blockchain events constants
- Map page
- Staking form
- Staking tab

#### Changed
- Folders structure
- Refactor components:
  `useSheduled`
  `useCall`
  `vuex modules`
- Icon on account row
- Design status message

#### Fixed
- Display zero block number information
- Last blocks and recent event design

#### Removed
- Explorer helper
- `Hooks` folder

#### Initial project release
- Initiated project with vue cli

[Unreleased]: https://gitlab.com/tokend/polkadot/new-web-client/compare/0.1.0...HEAD
[0.1.0]: https://gitlab.com/tokend/polkadot/new-web-client/compare/0.1.0-rc.3...0.1.0
[0.1.0-rc.3]: https://gitlab.com/tokend/polkadot/new-web-client/compare/0.1.0-rc.2...0.1.0-rc.3
[0.1.0-rc.2]: https://gitlab.com/tokend/polkadot/new-web-client/compare/0.1.0-rc.1...0.1.0-rc.2
[0.1.0-rc.1]: https://gitlab.com/tokend/polkadot/new-web-client/tags/0.1.0-rc.1
