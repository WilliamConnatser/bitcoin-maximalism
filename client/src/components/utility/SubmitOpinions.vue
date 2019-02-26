<template>
    <div>
        <form v-if="!submitted" @submit.prevent="submitOpinion()">
            <div class="medium-margin">
                <h2>submit opinion</h2>
                <label>Your Opinion</label>
                <textarea v-model="opinion" maxlength=280></textarea>
                <div class="extra-small-text">
                    No hyperlinks (for security purposes), foul language or namecalling is allowed. Please remain
                    respectful of others, on topic, and intellectually honest.
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
        name: "SubmitOpinions",
        props: {
            arrayItemProp: Object
        },
        data() {
            return {
                currentUser: null,
                submitted: false,
                opinion: ""
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