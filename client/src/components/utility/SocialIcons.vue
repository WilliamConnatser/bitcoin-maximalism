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
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'twitter-square' }" class="large-social-icons" />
            </network>
            <network network="facebook">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'facebook-square' }" class="large-social-icons" />
            </network>
            <network network="reddit">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'reddit-square' }" class="large-social-icons" />
            </network>
            <network network="telegram">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'telegram' }" class="large-social-icons" />
            </network>
            <network network="weibo">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'weibo' }" class="large-social-icons" />
            </network>
            <network network="email">
                <font-awesome-icon icon="envelope-square" class="large-social-icons" />
            </network>
            <network network="sms">
                <font-awesome-icon icon="sms" class="large-social-icons" />
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