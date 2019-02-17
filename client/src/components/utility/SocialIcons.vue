<template>
    <social-sharing :url="currentURL"
                    title="Bitcoin Maximalism"
                    description="An unbiased overview of the nuance surrounding the arguments for and against Bitcoin Maximalism."
                    quote="An unbiased overview of the nuance surrounding the arguments for and against Bitcoin Maximalism."
                    hashtags="bitcoin,bitcoinmaximalism,multicoinism,crypto"
                    twitter-user="BTCMaximalism21"
                    inline-template>
        <div>
            <network network="twitter">
                <a class="fancy-link cursor-pointer"><font-awesome-icon :icon="{ prefix: 'fab', iconName: 'twitter-square' }" class="large-social-icons" /></a>
            </network>
            <network network="facebook">
                <a class="fancy-link cursor-pointer"><font-awesome-icon :icon="{ prefix: 'fab', iconName: 'facebook-square' }" class="large-social-icons" /></a>
            </network>
            <network network="reddit">
                <a class="fancy-link cursor-pointer"><font-awesome-icon :icon="{ prefix: 'fab', iconName: 'reddit-square' }" class="large-social-icons" /></a>
            </network>
            <network network="telegram">
                <a class="fancy-link cursor-pointer"><font-awesome-icon :icon="{ prefix: 'fab', iconName: 'telegram' }" class="large-social-icons" /></a>
            </network>
            <network network="weibo">
                <a class="fancy-link cursor-pointer"><font-awesome-icon :icon="{ prefix: 'fab', iconName: 'weibo' }" class="large-social-icons" /></a>
            </network>
            <network network="email">
                <a class="fancy-link cursor-pointer"><font-awesome-icon icon="envelope-square" class="large-social-icons" /></a>
            </network>
            <network network="sms">
                <a class="fancy-link cursor-pointer"><font-awesome-icon icon="sms" class="large-social-icons" /></a>
            </network>
        </div>
    </social-sharing>
</template>

<script>
    export default {
        name: "SocialIcons",
        props: {
            currentUser: Object
        },
        computed: {
            currentURL() {
                if(this.currentUser) {
                    return `https://www.BitcoinMaximalism.com${this.$route.path}?ref=${this.currentUser._id}`;
                } else {
                    return `https://www.BitcoinMaximalism.com${this.$route.path}`;
                }
            }
        }
    };
</script>