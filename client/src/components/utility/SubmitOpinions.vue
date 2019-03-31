<template>
    <div>
        <form v-if="!submitted" @submit.prevent="submitForm()">
            <div class="medium-margin">
                <h2 v-if="opinionDocument === undefined">submit opinion</h2>
                <h2 v-else>edit opinion</h2>

                <label>the opinion</label>
                <textarea v-model="opinion" maxlength=280></textarea>
                <div class="extra-small-text">
                    No foul language or namecalling is allowed. Please remain
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
            applicableDocument: Object,
            opinionDocument: Object
        },
        data() {

            const dataObject = {
                currentUser: null,
                submitted: false
            }

            if (this.opinionDocument === undefined) {
                dataObject.opinion = "";
            } else {
                dataObject.opinion = this.opinionDocument.opinion;
            }

            return dataObject;
        },
        methods: {
            submitForm() {
                if (this.opinionDocument === undefined) {
                    this.submitOpinion();
                } else {
                    this.submitEditOpinion();
                }
            },
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
                            documentID: this.applicableDocument._id,
                            onModel: this.applicableDocument.__typename,
                            opinion: this.opinion
                        }
                    }).then(() => {
                        this.submitted = true;

                        if (this.$route.fullPath.indexOf('leaderboards') > -1) {
                            if (this.applicableDocument.__typename === 'Rhetoric') {
                                this.$parent.$emit('arguments-changed');
                            } else if (this.applicableDocument.__typename === 'Opinion') {
                                this.$parent.$emit('opinions-changed');
                            } else if (this.applicableDocument.__typename === 'Resource') {
                                this.$parent.$emit('resources-changed');
                            } else if (this.applicableDocument.__typename === 'BulletPoint') {
                                this.$parent.$emit('bulletpoints-changed');
                            } else if (this.applicableDocument.__typename === 'Project') {
                                this.$parent.$emit('projects-changed');
                            }
                        } else {
                            if (this.applicableDocument.__typename === 'Rhetoric') {
                                this.$parent.$emit('update-tos-query');
                            } else if (this.applicableDocument.__typename === 'Opinion') {
                                this.$emit('update-view-opinion-query');
                            } else if (this.applicableDocument.__typename === 'BulletPoint' ||
                                this.applicableDocument.__typename === 'Resource') {
                                this.$parent.$emit('update-arguments-query');
                            } else if (this.applicableDocument.__typename === 'Project') {
                                this.$parent.$emit('update-projects-query');
                            }
                        }
                    }).catch(() => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            submitEditOpinion: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else if (!this.currentUser.admin) {
                    this.$toasted.show('You are not authorized to do this', {
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
                } else if (this.validOpinion(this.opinion)) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitEditOpinion($documentID: ID!, $opinion: String!){
                                submitEditOpinion(documentID: $documentID, opinion: $opinion)
                            }
                        `,
                        variables: {
                            documentID: this.opinionDocument._id,
                            opinion: this.opinion
                        }
                    }).then(() => {
                        this.submitted = true;

                        if (this.$route.fullPath.indexOf('leaderboards') > -1) {
                            if (this.applicableDocument.__typename === 'Rhetoric') {
                                this.$parent.$emit('arguments-changed');
                            } else if (this.applicableDocument.__typename === 'Opinion') {
                                this.$parent.$emit('opinions-changed');
                            } else if (this.applicableDocument.__typename === 'Resource') {
                                this.$parent.$emit('resources-changed');
                            } else if (this.applicableDocument.__typename === 'BulletPoint') {
                                this.$parent.$emit('bulletpoints-changed');
                            } else if (this.applicableDocument.__typename === 'Project') {
                                this.$parent.$emit('projects-changed');
                            }
                        } else {
                            if (this.applicableDocument.__typename === 'Rhetoric') {
                                this.$parent.$emit('update-tos-query');
                            } else if (this.applicableDocument.__typename === 'Opinion') {
                                this.$emit('update-view-opinion-query');
                            } else if (this.applicableDocument.__typename === 'BulletPoint' ||
                                this.applicableDocument.__typename === 'Resource') {
                                this.$parent.$emit('update-arguments-query');
                            } else if (this.applicableDocument.__typename === 'Project') {
                                this.$parent.$emit('update-projects-query');
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