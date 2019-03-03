<template>
    <div>
        <form v-if="!submitted" @submit.prevent="submitRhetoric()">
            <h2 class="medium-margin-vertical">submit argument</h2>
            <div class="medium-margin-vertical">
                <label for="title">argument title</label>
                <textarea v-model="title" maxlength=75 name="title" class="small-textarea"></textarea>
                <div>
                    Please look over the already existing arguments and the rhetoric contained within them. New
                    arguments should only be submitted if you are certain that the other arguments do not already
                    contain the argument you are submitting. Arguments should be a succint title that properly
                    describes the overall argument and are limited to 80 characters.
                </div>
                <div class="extra-small-text medium-margin-vertical">
                    Foul language and namecalling is not allowed. Please remain respectful of others, on topic, and
                    intellectually honest. We retain the right to reject any new arguments for any reason. Please
                    read our <router-link to='/terms'>Terms</router-link> for more information. By clicking Agree
                    &amp; Submit below you agree that you have read and understand to those Terms.
                </div>
            </div>
            <button type="submit">Agree &amp; Submit</button>
        </form>

        <div v-else class="medium-margin">
            Your opinion was submitted successfully.
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "SubmitRhetoric",
        props: {
            arrayItemProp: Object
        },
        data() {
            return {
                currentUser: null,
                submitted: false,
                title: ""
            }
        },
        methods: {
            submitRhetoric: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else if (this.validTitle(this.title)) {
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
            validTitle(title) {
                if (title.length > 80) {
                    this.title = this.title.slice(0,80);
                    this.$toasted.show('Argument titles must be 80 characters or less', {
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
            title(newTitle) {
                this.validTitle(newTitle);
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