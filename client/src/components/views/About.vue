<template>
    <div class="container apollo-response">

        <h1 class="heading">
            about bitcoinmaximalism.com
        </h1>

        <div class="medium-margin">
            <button class="large-button medium-margin">
                <router-link to="/account" class="unstyled-link normal-text">Register Here</router-link>
            </button>
        </div>

        <div class="medium-margin">
            <h2>
                what
            </h2>
            BitcoinMaximalism.com is a highly-specific informational website based solely on the nuance surrounding the
            <strong>Bitcoin Maximalism</strong> and <strong>Multicoinism</strong> investment theses. Each participants'
            influence is directly proportional to the amount of Bitcoins donated. A user's upvotes and downvotes are
            weighted proportionally to the amount they've donated. Don't want to donate? Share your referral link to
            gain influence from those that do, or simply write high quality opinions which are likely to get uploaded.
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
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'github-square' }" class="extra-large-icon unstyled-link" />
            </a> <br />
            Please report technical and bug issues via Github by creating an issue.
        </div>

        <div class="medium-margin">
            <a href="mailto:admin@BitcoinMaximalism.com" target="_blank" rel="noopener">
                <font-awesome-icon :icon="{ prefix: 'fas', iconName: 'envelope-square' }" class="extra-large-icon unstyled-link" />
            </a> <br />
            Please report donation and account issues via Email.
        </div>
    </div>
</template>

<script>
    export default {
        name: "About"
    };
</script>