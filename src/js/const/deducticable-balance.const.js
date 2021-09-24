import CONFIG from '@/config'
import { BN } from '@polkadot/util'

export const DEDUCTIBLE_BALANCE = new BN('80954000000000000000000')
export const ADMIN_ADDRESS = 'EksJMqhZGCbXfH2UaNA2z33xe2DjGsUnfdePycS2mzLXiZ1'
export const IS_MAIN_NODE = CONFIG.WSS_NODE === 'wss://main2.hole.moonrabbit.com'
