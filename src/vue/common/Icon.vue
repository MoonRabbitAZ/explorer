<template>
  <div>
    <!-- eslint-disable max-len -->
    <copy-icon v-if="ICON_NAMES.copy === name" />
    <money-stack-icon v-if="ICON_NAMES.moneyStack === name" />
    <paper-plane-icon v-if="ICON_NAMES.paperPlane === name" />
    <alert-icon v-if="ICON_NAMES.alert === name" />
    <success-icon v-if="ICON_NAMES.success === name" />
    <info-icon v-if="ICON_NAMES.info === name" />
    <rotate-icon v-if="ICON_NAMES.rotate === name" />
    <metamask-icon v-if="ICON_NAMES.metamask === name" />
    <crown-icon v-if="ICON_NAMES.crown === name" />
    <ethereum-icon v-if="ICON_NAMES.ethereum === name" />

    <!-- Socila icons -->
    <discord-icon v-if="ICON_NAMES.discord === name" />
    <facebook-icon v-if="ICON_NAMES.facebook === name" />
    <github-icon v-if="ICON_NAMES.github === name" />
    <instagram-icon v-if="ICON_NAMES.instagram === name" />
    <linkedin-icon v-if="ICON_NAMES.linkedin === name" />
    <reddit-icon v-if="ICON_NAMES.reddit === name" />
    <snapchat-icon v-if="ICON_NAMES.snapchat === name" />
    <twitter-icon v-if="ICON_NAMES.twitter === name" />
    <coin-gecko-icon v-if="ICON_NAMES.coinGecko === name" />
    <coin-market-cap-icon v-if="ICON_NAMES.coinMarketCap === name" />
    <community-icon v-if="ICON_NAMES.community === name" />
    <telegram-icon v-if="ICON_NAMES.telegram === name" />
    <telegram-cn-icon v-if="ICON_NAMES.telegramCN === name" />
    <telegram-eng-icon v-if="ICON_NAMES.telegramENG === name" />
    <telegram-jp-icon v-if="ICON_NAMES.telegramJP === name" />
    <telegram-kr-icon v-if="ICON_NAMES.telegramKR === name" />
    <telegram-mc-icon v-if="ICON_NAMES.telegramMC === name" />
    <telegram-news-icon v-if="ICON_NAMES.telegramNews === name" />
    <telegram-ru-icon v-if="ICON_NAMES.telegramRU === name" />
    <telegram-tr-icon v-if="ICON_NAMES.telegramTR === name" />
    <weibo-icon v-if="ICON_NAMES.weibo === name" />
    <bitcoin-icon v-if="ICON_NAMES.bitcoin === name" />

    <!-- eslint-enable max-len -->
  </div>
</template>

<script>
import CopyIcon from '@/vue/common/icons/Copy-icon'
import MoneyStackIcon from '@/vue/common/icons/Money-stack-icon'
import PaperPlaneIcon from '@/vue/common/icons/Paper-plane-icon'
import AlertIcon from '@/vue/common/icons/Alert-icon'
import SuccessIcon from '@/vue/common/icons/Success-icon'
import InfoIcon from '@/vue/common/icons/Info-icon'
import RotateIcon from '@/vue/common/icons/Rotate-icon'
import MetamaskIcon from '@/vue/common/icons/Metamask-icon'
import CrownIcon from '@/vue/common/icons/Crown-icon'
import EthereumIcon from '@/vue/common/icons/Ethereum-icon'

// Socila icons
import DiscordIcon from '@/vue/common/icons/social/Discord-icon'
import FacebookIcon from '@/vue/common/icons/social/Facebook-icon'
import GithubIcon from '@/vue/common/icons/social/Github-icon'
import InstagramIcon from '@/vue/common/icons/social/Instagram-icon'
import LinkedinIcon from '@/vue/common/icons/social/Linkedin-icon'
import RedditIcon from '@/vue/common/icons/social/Reddit-icon'
import SnapchatIcon from '@/vue/common/icons/social/Snapchat-icon'
import TwitterIcon from '@/vue/common/icons/social/Twitter-icon'
import TelegramIcon from '@/vue/common/icons/social/Telegram-icon'
import BitcoinIcon from '@/vue/common/icons/social/Bitcoin-icon'
import CoinGeckoIcon from '@/vue/common/icons/social/Coin-gecko-icon'
import CoinMarketCapIcon from '@/vue/common/icons/social/Coin-market-cap-icon'
import CommunityIcon from '@/vue/common/icons/social/Community-icon'
import TelegramCnIcon from '@/vue/common/icons/social/Telegram-cn-icon'
import TelegramEngIcon from '@/vue/common/icons/social/Telegram-eng-icon'
import TelegramJpIcon from '@/vue/common/icons/social/Telegram-jp-icon'
import TelegramKrIcon from '@/vue/common/icons/social/Telegram-kr-icon'
import TelegramMcIcon from '@/vue/common/icons/social/Telegram-mc-icon'
import TelegramNewsIcon from '@/vue/common/icons/social/Telegram-news-icon'
import TelegramRuIcon from '@/vue/common/icons/social/Telegram-ru-icon'
import TelegramTrIcon from '@/vue/common/icons/social/Telegram-tr-icon'
import WeiboIcon from '@/vue/common/icons/social/Weibo-icon'

const ICON_NAMES = {
  copy: 'copy',
  moneyStack: 'money-stack',
  paperPlane: 'paper-plane',
  alert: 'alert',
  success: 'success',
  info: 'info',
  rotate: 'rotate',
  metamask: 'metamask',
  crown: 'crown',
  ethereum: 'ethereum',

  // Socila icons
  discord: 'discord',
  facebook: 'facebook',
  github: 'github',
  instagram: 'instagram',
  linkedin: 'linkedin',
  reddit: 'reddit',
  snapchat: 'snapchat',
  telegram: 'telegram',
  twitter: 'twitter',
  bitcoin: 'bitcoin',
  coinGecko: 'coin-gecko',
  coinMarketCap: 'coin-market-cap',
  community: 'community',
  telegramCN: 'telegram-cn',
  telegramENG: 'telegram-eng',
  telegramJP: 'telegram-jp',
  telegramKR: 'telegram-kr',
  telegramMC: 'telegram-mc',
  telegramNews: 'telegram-news',
  telegramRU: 'telegram-ru',
  telegramTR: 'telegram-tr',
  weibo: 'weibo',
}

export default {
  name: 'icon',
  components: {
    CopyIcon,
    MoneyStackIcon,
    PaperPlaneIcon,
    AlertIcon,
    SuccessIcon,
    InfoIcon,
    RotateIcon,
    DiscordIcon,
    FacebookIcon,
    GithubIcon,
    InstagramIcon,
    LinkedinIcon,
    RedditIcon,
    SnapchatIcon,
    TelegramIcon,
    TwitterIcon,
    BitcoinIcon,
    CoinGeckoIcon,
    CoinMarketCapIcon,
    CommunityIcon,
    TelegramCnIcon,
    TelegramEngIcon,
    TelegramJpIcon,
    TelegramKrIcon,
    TelegramMcIcon,
    TelegramNewsIcon,
    TelegramRuIcon,
    TelegramTrIcon,
    WeiboIcon,
    MetamaskIcon,
    CrownIcon,
    EthereumIcon,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      ICON_NAMES,
    }
  },
}
</script>
