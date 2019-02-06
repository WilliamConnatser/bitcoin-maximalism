<template>
    <div class="container normal-text">
        <div class="medium-margin">
            <h1>
                What?
            </h1>
            A highly-specific social media platform based solely on the nuance surrounding the Bitcoin Maximalism and
            Multicoinism investment theses. Each participants' influence is directly proportional to the amount of
            Bitcoins donated
            to the website.
        </div>

        <div class="medium-margin">
            <h1>
                Why?
            </h1>
            All other Social Media platforms where such discussions are taking place are unfortunately filled with
            bots, sockpuppets, spam, and other low-value content. BitcoinMaximalism.com is an attempt to filter
            out such noise by adding a Sybil-resistant mechanism which entails gaining influence on the site through
            Bitcoin donations.
        </div>

        <div class="medium-margin">
            <h1>
                How?
            </h1>
            After registering for an account, and verifying your email, you may donate Bitcoins to the website in your
            User Account Panel. Once the Bitcoin transaction has been confirmed, a proportional amount of influence
            will be added to your account. You may make an unlimited amount of donations in order to boost your influence.
        </div>

        <div class="medium-margin">
            <h1>
                When?
            </h1>
            Right now you silly goose! What are you waiting for?!
            All donations received during our Open Beta will be given a <strong>25% influence bonus</strong>.
            Refer your friends and receive a <strong>10% lifetime influence bonus</strong> proportional to each of
            their donations!

            <h1 class="medium-margin uppercase fancy-link">
                <router-link to="/account"> Register Here</router-link>
            </h1>
        </div>
        <h1>Open Beta:</h1>
        <div class="medium-margin">
            <a href="https://github.com/WilliamConnatser/bitcoin-maximalism-v2" target="_blank" rel="noopener">
                <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'github-square' }" class="extra-large-social-icons fancy-link" />
            </a> <br/>
            Please report technical and bug issues via Github by creating an issue.
        </div>

        <div class="medium-margin">
            <a href="mailto:admin@BitcoinMaximalism.com" target="_blank" rel="noopener">
                <font-awesome-icon :icon="{ prefix: 'fas', iconName: 'envelope-square' }" class="extra-large-social-icons fancy-link" />
            </a> <br/>
            Please report donation and account issues via Email.
        </div>
    </div>
</template>

<script>
    export default {
        name: "About"
    };
</script>
