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

    <!-- Socila icons -->
    <discord-icon v-if="ICON_NAMES.discord === name" />
    <facebook-icon v-if="ICON_NAMES.facebook === name" />
    <github-icon v-if="ICON_NAMES.github === name" />
    <instagram-icon v-if="ICON_NAMES.instagram === name" />
    <linkedin-icon v-if="ICON_NAMES.linkedin === name" />
    <reddit-icon v-if="ICON_NAMES.reddit === name" />
    <snapchat-icon v-if="ICON_NAMES.snapchat === name" />
    <telegram-icon v-if="ICON_NAMES.telegram === name" />
    <twitter-icon v-if="ICON_NAMES.twitter === name" />
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

// Socila icons
import DiscordIcon from '@/vue/common/icons/social/Discord-icon'
import FacebookIcon from '@/vue/common/icons/social/Facebook-icon'
import GithubIcon from '@/vue/common/icons/social/Github-icon'
import InstagramIcon from '@/vue/common/icons/social/Instagram-icon'
import LinkedinIcon from '@/vue/common/icons/social/Linkedin-icon'
import RedditIcon from '@/vue/common/icons/social/Reddit-icon'
import SnapchatIcon from '@/vue/common/icons/social/Snapchat-icon'
import TelegramIcon from '@/vue/common/icons/social/Telegram-icon'
import TwitterIcon from '@/vue/common/icons/social/Twitter-icon'

const ICON_NAMES = {
  copy: 'copy',
  moneyStack: 'money-stack',
  paperPlane: 'paper-plane',
  alert: 'alert',
  success: 'success',
  info: 'info',
  rotate: 'rotate',

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
