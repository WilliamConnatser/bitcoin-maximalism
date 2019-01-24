<template>
    <div ref="success">
        <form v-if="!submitted" @submit.prevent="submitOpinionToServer()">
            <div class="block">
                <label>Donation Amount (BTC)</label>
                <input type="text" v-model="donationAmount">
                <div class="description">Your opinion is more (or less) likely to be seen depending on the donation's
                    value. You may view the opinions on what you are commenting on to see the likelihood your
                    opinion will be shown. Features may be implemented or deprecated in the future which reduce or
                    increase the weight of your upvote or downvote.</div>
            </div>
            <div class="block">
                <label>Opinion</label>
                <textarea v-model="opinion" maxlength=280></textarea>
                <div class="description">Submitting an opinion and making a donation does not guarantee that your
                    comment will be approved. We reserve the right to not publish an opinion for any reason we deem
                    necessary, so please remain respectful of others and intellectually honest. If published, opinions
                    will never be altered.
                </div>
            </div>
            <div class="block">
                <div class="description">
                    All donations are non-binding, no products or services are guaranteed in lieu of a donation, and
                    absolutely no refunds will be performed, whether your opinion is published- or not. By continuing
                    you are agreeing to accept the <router-link to="/terms">Terms</router-link> &amp;
                    <router-link to="/privacy">Privacy Policy</router-link>.
                </div>
            </div>

            <button type="submit">I Agree</button>
        </form>
        <div v-else>
            <h2>Success!</h2>

            If the donation was completed successfully, then your opinion has been submitted to the administrators for
            review. From this point forward, you may track the status of the opinion you've submitted on the user
            <router-link to="/account">Account Panel</router-link>.
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "SubmitOpinions",
        props: {
            arrayItemProp: Object
        },
        data() {
            return {
                getCurrentUser: null,
                viewOpinions: null,
                viewEdits: null,
                donationAmount: 0,
                opinion: null,
                submitted: null,
                incoiceURL: null
            }
        },
        methods: {
            scrollToTop() {
                var element = this.$refs.success;
                var top = element.offsetTop;
                window.scrollTo(0, top);
            },
            submitOpinionToServer() {
                if (!this.getCurrentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.getCurrentUser.allegiance) {
                    this.$toasted.global.assign_allegiance();
                } else {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                        mutation submitOpinionModelSpecific($amount: String!, $documentID: ID!, $onModel: String!, $opinion: String!){
                            submitOpinionModelSpecific(amount: $amount, documentID: $documentID, onModel: $onModel, opinion: $opinion)
                        }
                    `,
                        variables: {
                            amount: this.donationAmount,
                            documentID: this.arrayItemProp._id,
                            onModel: this.arrayItemProp.__typename,
                            opinion: this.opinion
                        }
                    }).then(async ({
                        data
                    }) => {
                        this.incoiceURL = data.submitOpinionModelSpecific;
                        this.submitted = true;
                    }).catch(error => {
                        // Error :\
                        // Error handled in main.js
                    });
                }
            }
        },
        watch: {
            submitted(newValue) {
                if (newValue) this.scrollToTop();
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
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../sass/variables.scss";

    .block {
        margin: 3rem;
    }

    input {
        text-align: center;
        display: inline-block;
        max-width: 15rem;
        width: 75%;
        height: 4rem;
        font-size: 2rem;
        border: 0.1rem solid $color-white;
        color: $color-white;
        background-color: $color-green;
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