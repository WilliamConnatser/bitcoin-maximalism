<template>
    <div>
        <div class="toolbar--votes">
            <span class="icon" @click='initialize(true)' title="Upvote">
                <font-awesome-icon icon="angle-up" />
            </span>
            <span class="amount-donated">
                ${{dynamicDollarAmountQuery}}
            </span>
            <span class="icon" @click='initialize(false)' title="Downvote">
                <font-awesome-icon icon="angle-down" />
            </span>
        </div>
        <div v-if="this.upvote !== null">
            <h2 v-if="upvote">Submit an Upvote</h2>
            <h2 v-else>Submit a Downvote</h2>
            <button @click="cancel()">Cancel Vote</button>
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
                slug: ""
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
            dynamicDollarAmountQuery() {
                if(this.arrayItemProp.__typename === "Rhetoric") {
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
                query: gql `query getAmountDonatedModelSpecific($pro: Boolean!, $slug: String!, $onModel: String!) {
                                getAmountDonatedModelSpecific(pro: $pro, slug: $slug, onModel: $onModel)
                            }
                        `,
                variables() {
                    return {
                        pro: this.pro,
                        slug: this.slug,
                        onModel: this.arrayItemProp.__typename
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
            font-size: 3rem;
        }
    }

    input {
        display: inline-block;
        width: 75vw;
        height: 4rem;
        font-size: 1.5rem;
        border: 0.1rem solid $color-white;
    }

    label {
        text-align: center;
        color: $color-white;
        display: inline-block;
        width: 80vw;
        font-size: 1.9rem;
        font-weight: 200;
    }

    button {
        color: $color-white;
        background-color: $color-green;
        font-size: 1.5rem;
        width: 40vw;
        height: 4rem;
        padding: .5rem;
        margin-bottom: 4rem;
        border: 0.1rem solid $color-white;
    }

    .block {
        margin: 3rem;
    }
</style>