<template>
  <footer class="app-footer app__padding">
    <div class="app-footer__social-wrap">
      <template
        v-for="({link, iconName}, index) in socialLinks"
        :key="index"
      >
        <a
          v-if="link"
          class="app-footer__social-link"
          target="_blank"
          :href="link"
        >
          <icon
            class="app-footer__social-icon"
            :name="iconName"
          />
        </a>
      </template>
    </div>
    <div class="app-footer__info">
      <p class="app-footer__all-rights">
        {{ $t("all-rights") }}
      </p>
      <div class="app-footer__versions-wrap">
        <p class="app-footer__version">
          {{ systemInfo }}
        </p>
        <p class="app-footer__version">
          {{ apiVersion }}
        </p>
        <p class="app-footer__version">
          {{ appVersion }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
import Icon from '@/vue/common/Icon'

import { api } from '@api'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'
import CONFIG from '@/config'

export default {
  name: 'app-footer',

  components: { Icon },
  setup () {
    const store = useStore()
    const apiVersion = ref(api.libraryInfo.replace('@polkadot/', ''))
    const appVersion = ref(`apps v${CONFIG.BUILD_VERSION}`)
    const socialLinks = ref([
      {
        link: CONFIG.SOCIAL_TELEGRAM_LINK,
        iconName: 'telegram',
      },
      {
        link: CONFIG.SOCIAL_DISCORD_LINK,
        iconName: 'discord',
      },
      {
        link: CONFIG.SOCIAL_FACEBOOK_LINK,
        iconName: 'facebook',
      },
      {
        link: CONFIG.SOCIAL_GITHUB_LINK,
        iconName: 'github',
      },
      {
        link: CONFIG.SOCIAL_INSTAGRAM_LINK,
        iconName: 'instagram',
      },
      {
        link: CONFIG.SOCIAL_LINKEDIN_LINK,
        iconName: 'linkedin',
      },
      {
        link: CONFIG.SOCIAL_REDDIT_LINK,
        iconName: 'reddit',
      },
      {
        link: CONFIG.SOCIAL_TWITTER_LINK,
        iconName: 'twitter',
      },
    ])
    const systemInfo = computed(() =>
      store.getters[vuexTypes.systemChain] + ' ' +
        store.getters[vuexTypes.systemVersion].split('-')[0],
    )

    return {
      appVersion,
      systemInfo,
      apiVersion,
      socialLinks,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';
@import '~@scss/variables';

.app-footer {
  background: $col-app-block-bg;
  padding-bottom: 3rem;
  padding-top: 3rem;
}

.app-footer__social-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  margin-bottom: 2.2rem;
}

.app-footer__social-link {
  display: block;
  width: max-content;
  color: $col-app-text;

  &:hover {
    color: $col-app-accent;
  }
}

.app-footer__social-icon {
  width: 2.4rem;
  height: 2.4rem;
  color: inherit;
}

.app-footer__info {
  display: flex;
  justify-content: space-between;

  @include respond-to($tablet) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.app-footer__versions-wrap {
  min-width: 10rem;
  text-align: right;
  margin-left: 2rem;

  @include respond-to($tablet) {
    margin-left: 0;
    text-align: left;
    margin-top: 2.4rem;
  }
}

.app-footer__version {
  font-size: 1rem;
  line-height: 1.2rem;
}
</style>

<i18n>
{
  "en": {
    "all-rights": "Moon Rabbit AngoZaibatsu LLC © 2021. All Rights Reserved. This is not an investment solicitation or offering. USofA citizens, residents and legal entities are fully excluded. Versetti&Co Family Organisation",
  }
}
</i18n>
