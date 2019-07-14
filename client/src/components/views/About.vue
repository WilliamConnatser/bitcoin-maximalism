<template>
    <div class="container apollo-response">

        <h1 class="heading">
            about us
        </h1>

        <div class="medium-margin-bottom">
            <router-link to="/account">
                <button class="large-button button-flash">
                    Register Here
                </button>
            </router-link>
        </div>

        <div class="medium-margin">
            <h2>
                what
            </h2>
            BitcoinMaximalism.com is a highly-specific informational website based solely on
            the nuances surrounding the
            <strong>Bitcoin Maximalism</strong>
            and
            <strong>Multicoinism</strong>
            investment theses. Each participants' influence (in the form of upvote and
            downvote weight) is directly proportional to the amount of Bitcoins donated.
            Don't want to donate? Share your referral link to gain influence from those that
            may donate, or simply write high quality opinions which are likely to get
            upvoted. Any Bitcoins received beyond what it costs to host and maintain the
            site will be donated to open source projects.
        </div>

        <div class="medium-margin">
            <h2>
                why
            </h2>
            Most social media platforms where such discussions are taking place are
            unfortunately filled with bots, sockpuppets, spam, and other low-value content.
            BitcoinMaximalism.com is an attempt to filter out such noise by adding a
            Sybil-resistant mechanism which involves gaining influence on the site through
            Bitcoin donations, and by providing rhetoric which has already been curated that
            is intended to organize the rhetoric and spark debate.
        </div>

        <div class="medium-margin">
            <h2>
                how
            </h2>
            <p>
                After registering for an account and verifying your email, you may donate
                Bitcoins by accessing your account panel. Once the Bitcoin transaction has been
                confirmed, influence proportional to the amount of your donation will be added
                to your account. You may make an unlimited amount of donations, or share your
                referral link in order to boost your influence.</p>
            <br/>
            <p>
                As mentioned above, any Bitcoins received beyond what it costs to host and
                maintain the website will be donated to open source projects, but only users who
                have donated have any say on who gets those donations. You may choose which
                faction you wish to support in your User Account Panel by aligning with either
                The Bitcoin Maximalists or The Multicoinists. The faction with the most vote
                weight support gets to choose which project gets the excess donations. The
                highest-voted project for that faction will receive all excess donations. See
                the Projects page to view which project is ahead for each fsaction, or the
                Leaderboards page to view which faction has the most vote weight.</p>
        </div>

        <div class="medium-margin">
            <h2>
                when
            </h2>
            Right now!! Feel free to take the site for a test drive! Please keep in mind
            this web application is in open beta, so please let us know if you come accross
            any issues. All donations received during our open beta will be given a
            <strong>25% influence bonus</strong>. Refer your friends and receive a
            <strong>10% influence bonus
            </strong>
            that's permanently proportional to each of their donations!
        </div>

        <div class="medium-margin">
            <a
                href="https://github.com/WilliamConnatser/bitcoin-maximalism-v2"
                target="_blank"
                rel="noopener">
                <font-awesome-icon
                    :icon="{ prefix: 'fab', iconName: 'github-square' }"
                    class="extra-large-icon unstyled-link"/>
            </a>
            <br/>
            Please report technical and bug issues via Github by creating an issue.
        </div>

        <div class="medium-margin">
            <a href="mailto:admin@BitcoinMaximalism.com" target="_blank" rel="noopener">
                <font-awesome-icon
                    :icon="{ prefix: 'fas', iconName: 'envelope-square' }"
                    class="extra-large-icon unstyled-link"/>
            </a>
            <br/>
            Please report donation and account issues via Email.
        </div>
    </div>
</template>

<script>
    export default {
        name : "About"
    };
</script>