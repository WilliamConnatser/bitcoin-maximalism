<template>
    <div>
        <div class="toolbar--votes">
            <span class="icon" @click='initialize(true)' title="Upvote">
                <font-awesome-icon icon="angle-up" />
            </span>
            <span class="amount-donated">
                {{totalDonationsQuery}}
                {{arrayItemProp._id}}
            </span>
            <span class="icon" @click='initialize(false)' title="Downvote">
                <font-awesome-icon icon="angle-down" />
            </span>
        </div>
        <div v-if="this.upvote !== null">
            <h2 v-if="upvote">Submit an Upvote</h2>
            <h2 v-else>Submit a Downvote</h2>
            <button @click="cancel()">Hide Vote</button>

            <div ref="success">
                <form v-if="!submitted" @submit.prevent="submitted=true">
                    <div class="block">
                        <label>Donation Amount (BTC)</label>
                        <input id="donation-amount" type="text" v-model="donationAmount">
                        <div class="description">Your upvote or downvote will be weighted an amount proportional to
                            your donation compared to the amount of all other donations. Features may be implemented or
                            deprecated
                            in the future which reduce or increase the weight of your upvotes or downvotes.</div>
                    </div>
                    <div class="block">
                        <div class="description">
                            All donations are non-binding. No products or services are guaranteed in lieu of a
                            donation, and no refunds will be performed whether your upvote or downvote is tallied or
                            not. By
                            continuing you are agreeing to accept the <router-link to="/terms">Terms</router-link>
                            &amp;
                            <router-link to="/privacy">Privacy Policy</router-link>.
                        </div>
                    </div>
                    <button type="submit">I Agree</button>
                </form>
                <div v-else>
                    <h2>Success!</h2>

                    If the donation was completed successfully, then your upvote or downvote should be attributed
                    shortly.
                    You may track the history of your upvotes and downvotes in the user <router-link to="/account">Account
                        Panel</router-link>.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "ToolbarVotes",
        props: {
            arrayItemProp: Object,
            metaSlug: String
        },
        data() {
            return {
                getCurrentUser: null,
                upvote: null,
                getAmountDonatedSlugSpecific: 0,
                getAmountDonatedModelSpecific: 0,
                slug: "",
                submitted: null,
                donationAmount: "",
                deActivate: true
            }
        },
        computed: {
            pro() {
                if (this.$route.params.metaSlug == "protagonistic") {
                    return true;
                } else {
                    return false;
                }
            },
            totalDonationsQuery() {
                if (this.arrayItemProp.__typename === "Rhetoric") {
                    return this.getAmountDonatedSlugSpecific;
                } else {
                    return this.getAmountDonatedModelSpecific;
                }

            }
        },
        methods: {
            initialize(upvote) {
                this.getCurrentUser ? this.upvote = upvote : this.$toasted.global.log_in();
            },
            cancel() {
                this.upvote = null;
            }
        },
        apollo: {
            getCurrentUser: {
                query: gql `
                    query getCurrentUser {
                        getCurrentUser {
                            _id
                            username
                            email
                            emailValidated
                            active
                            admin
                            allegiance
                            maximalist
                        }
                    }
                `
            },
            getAmountDonatedSlugSpecific: {
                query: gql `query getAmountDonatedSlugSpecific($pro: Boolean!, $slug: String!) {
                                getAmountDonatedSlugSpecific(pro: $pro, slug: $slug)
                            }
                        `,
                variables() {
                    return {
                        pro: this.pro,
                        slug: this.slug
                    }
                }
            },
            getAmountDonatedModelSpecific: {
                query: gql `query getAmountDonatedModelSpecific($pro: Boolean!, $slug: String!, $onModel: String!, $documentID: ID!) {
                                getAmountDonatedModelSpecific(pro: $pro, slug: $slug, onModel: $onModel, documentID: $documentID)
                            }
                        `,
                variables() {
                    return {
                        pro: this.pro,
                        slug: this.slug,
                        onModel: this.arrayItemProp.__typename,
                        documentID: this.arrayItemProp._id
                    }
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../sass/variables.scss";

    .toolbar--votes {
        .icon {
            font-size: 3rem;
            font-weight: 600;
            margin: 1rem 2rem;
        }

        .amount-donated {
            font-size: 2rem;
        }
    }

    .block {
        margin: 3rem;
    }

    input {
        text-align: center;
        display: inline-block;
        max-width: 65rem;
        width: 90%;
        height: 4rem;
        border: 0.1rem solid $color-white;
        color: $color-white;
        background-color: $color-green;
    }

    #donation-amount {
        font-size: 2rem;
        max-width: 20rem;
    }

    textarea {
        text-align: center;
        display: inline-block;

        width: 100%;
        height: 30rem;
        font-size: 2rem;
        border: 0.1rem solid $color-white;
        color: $color-white;
        background-color: $color-green;
    }

    label {
        color: $color-white;
        display: inline-block;
        width: 100%;
        font-size: 1.9rem;
    }

    button {
        color: $color-white;
        background-color: $color-green;
        font-size: 1.5rem;
        width: 35%;
        height: 5rem;
        padding: .5rem;
        margin: .5rem;
        border: 0.1rem solid $color-white;
    }

    .description {
        font-size: 1.5rem;
    }
</style>