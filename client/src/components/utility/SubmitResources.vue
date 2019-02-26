<template>
    <div>
        <form v-if="!submitted" @submit.prevent="submitOpinion()">
            <div class="medium-margin">
                <h2>submit resource</h2>
                <label>Resource Title</label>
                <input v-model="title" class="wide-input">
                <label>Resource Type</label>
                <select v-model="media">
                <option value="article" :selected="media === 'article'">
                    Article
                </option>
                <option value="blog" :selected="media === 'blog'">
                    Blog
                </option>
                <option value="podcast" :selected="media === 'podcast'">
                    Podcast
                </option>
                <option value="video" :selected="media === 'video'">
                    Video
                </option>
                <option value="whitepaper" :selected="media === 'whitepaper'">
                    Whitepaper
                </option>
                <option value="book" :selected="media === 'book'">
                    Book
                </option>
            </select>
                <label>Resource Hyperlink</label>
                <input v-model="link" class="wide-input">
                <div class="extra-small-text medium-margin-vertical">
                    Please look over the already existing resources and the rhetoric contained within them. New
                    resources should only be submitted if you are certain that the other resources do not already
                    cover the content that you are submitting. The title of the article should be written
                    exactly how it is typed on the original source.
                </div>
                <div class="extra-small-text medium-margin-vertical">
                    Please do not include hyperlinks for security purposes, foul language or namecalling, and please
                    remain respectful of others, on topic, and intellectually honest. We retain the right to reject any
                    new arguments for any reason. Please read our <router-link to='/terms'>Terms</router-link> for more
                    information. By clicking Agree &amp; Submit below you agree that you have read and understand to
                    those Terms.
                </div>
                <button type="submit">Agree &amp; Submit</button>
            </div>
        </form>
        <div v-else class="medium-margin">
            Your opinion was submitted successfully.
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "SubmitResources",
        props: {
            arrayItemProp: Object
        },
        data() {
            return {
                currentUser: null,
                submitted: false,
                title: "",
                media: "article",
                link: ""
            }
        },
        methods: {
            submitOpinion: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else if (this.validOpinion(this.opinion)) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitOpinion($documentID: ID!, $onModel: String!, $opinion: String!){
                                submitOpinion(documentID: $documentID, onModel: $onModel, opinion: $opinion)
                            }
                        `,
                        variables: {
                            documentID: this.arrayItemProp._id,
                            onModel: this.arrayItemProp.__typename,
                            opinion: this.opinion
                        }
                    }).then(() => {
                        this.submitted = true;

                        if (this.$route.fullPath.indexOf('leaderboards') > -1) {
                            if (this.arrayItemProp.__typename === 'Rhetoric') {
                                this.$parent.$emit('arguments-changed');
                            } else if (this.arrayItemProp.__typename === 'Opinion') {
                                this.$parent.$emit('opinions-changed');
                            } else if (this.arrayItemProp.__typename === 'Resource') {
                                this.$parent.$emit('resources-changed');
                            } else if (this.arrayItemProp.__typename === 'BulletPoint') {
                                this.$parent.$emit('bulletpoints-changed');
                            }
                        } else {
                            if (this.arrayItemProp.__typename === 'Rhetoric') {
                                this.$parent.$emit('update-tos-query');
                            } else if (this.arrayItemProp.__typename === 'Opinion') {
                                this.$emit('update-view-opinion-query');
                            } else {
                                this.$parent.$emit('update-arguments-query');
                            }

                        }
                    }).catch(() => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            validOpinion(opinion) {
                if (opinion.length > 280) {
                    this.opinion.limit(280);
                    this.$toasted.show('Opinions must be 280 characters or less', {
                        duration: 5000,
                        position: 'bottom-center',
                        fullWidth: true,
                        fitToScreen: true,
                        singleton: true,
                        action: [{
                            text: 'Close',
                            onClick: (e, toastObject) => {
                                toastObject.goAway(0);
                            }
                        }]
                    });
                    return false;
                } else {
                    return true;
                }
            }
        },
        watch: {
            opinion(newOpinion) {
                this.validOpinion(newOpinion);
            }
        },
        apollo: {
            currentUser: {
                query: gql `
                    query currentUser {
                        currentUser {
                            _id
                            username
                            email
                            emailVerified
                            active
                            admin
                        }
                    }
                `
            }
        }
    };
</script>