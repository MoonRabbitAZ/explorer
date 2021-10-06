export const ENDPOINTS = Object.freeze({
  moonRabbitDraftNet: {
    name: 'Moon rabbit draft net',
    providers: {
      main: 'wss://node.hole.moonrabbit.com',
    },
    linked: [],
  },
  moonRabbit: {
    name: 'Moon rabbit',
    providers: {
      main1: 'wss://main.hole.moonrabbit.com',
      main2: 'wss://main2.hole.moonrabbit.com',
    },
    linked: [
      {
        name: '',
        paraId: '2000',
        providers: [],
      },
    ],
  },
})
