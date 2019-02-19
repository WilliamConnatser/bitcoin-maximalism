<template>
    <div class="container normal-text">
        <h1 class="heading">
            bitcoin maximalism
        </h1>

        <p>
            The term Bitcoin Maximalism was initially termed by Vitalik Buterin in a
            <a href="https://blog.ethereum.org/2014/11/20/bitcoin-maximalism-currency-platform-network-effects/">blog</a>
            post written on November 19, 2014, and has since been popularized throughout the cryptocurrency community
            to describe ardent Bitcoin supporters. Bitcoin Maximalism was originally coined as a sort of derogatory
            name for
            staunch Bitcoin proponents, but some Bitcoin proponents have ironically adopted the Bitcoin Maximalist
            title as a
            badge of honor! There are many immensly nuanced arguments for and against Bitcoin Maximalism, and
            BitcoinMaximalism.com
            is intended to serve as an objective* overview of Bitcoin Maximalism. The curated arguments which are
            outlined
            are only meant to give you an unbiased introduction to the nuance surrounding them. Please do
            your own research because there is a lot more to learn beyond what's within this site and the linked
            resources.
        </p>

        <p class="extra-small-text medium-margin">
            * Considering a human built this web site, and wrote the content, it is technically impossible to be 100%
            objective, but the human did give a good amount of effort in order to remain impartial.
        </p>

        <div class="medium-margin">
            <h2>
                what
            </h2>
            BitcoinMaximalism.com is a highly-specific social media platform based solely on the nuance surrounding the
            <strong>Bitcoin Maximalism</strong> and
            <strong>Multicoinism</strong> investment theses. Each participants' influence is directly proportional to
            the amount of
            Bitcoins donated. A user's upvotes and downvotes are weighted proportionally to the amount they've
            donated. Don't want to donate? Share your referral link to gain influence from those that do,
            or simply write high quality opinions which are likely to get uploaded.
        </div>

        <div class="medium-margin">
            <h2>
                why
            </h2>
            Most social media platforms where such discussions are taking place are unfortunately filled with
            bots, sockpuppets, spam, and other low-value content. BitcoinMaximalism.com is an attempt to filter
            out such noise by adding a Sybil-resistant mechanism which entails gaining influence on the site through
            Bitcoin donations, and by providing curated rhetoric which organizes the discussion and helps keep
            participants on topic.
        </div>

        <div class="medium-margin">
            <h2>
                how
            </h2>
            After registering for an account and verifying your email, you may donate Bitcoins by accessing your
            account panel. Once the Bitcoin transaction has been confirmed, a proportional amount of influence
            will be added to your account. You may make an unlimited amount of donations or share your referral
            link in order to boost your influence.
        </div>

        <div class="medium-margin">
            <h2>
                when
            </h2>
            Now! Feel free to take the site for a test drive! Please keep in mind this service is in open beta, so
            please let us know if you come accross any issues. All donations received during our open beta will be
            given a <strong>25% influence bonus</strong>. Refer your friends and receive a <strong>10%
                influence bonus</strong> that's permanently proportional to each of their donations!
        </div>

        <div class="medium-margin">
            <a href="https://github.com/WilliamConnatser/bitcoin-maximalism-v2" target="_blank" rel="noopener">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'github-square' }" class="extra-large-social-icons fancy-link" />
            </a> <br />
            Please report technical and bug issues via Github by creating an issue.
        </div>

        <div class="medium-margin">
            <a href="mailto:admin@BitcoinMaximalism.com" target="_blank" rel="noopener">
                <font-awesome-icon :icon="{ prefix: 'fas', iconName: 'envelope-square' }" class="extra-large-social-icons fancy-link" />
            </a> <br />
            Please report donation and account issues via Email.
        </div>

        <div class="medium-margin">
            <button class="large-button medium-margin">
                <router-link to="/account" class="fancy-link">Register Here</router-link>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "About"
    };
</script>