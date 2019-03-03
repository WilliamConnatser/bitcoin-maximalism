<template>
    <div>
        <form v-if="!submitted" @submit.prevent="submitBulletPoint()">
            <h2 class="medium-margin-vertical">submit bulletpoint</h2>
            <div class="medium-margin-vertical">
                <label for="content">bulletpoint content</label>
                <textarea v-model="content" name="content"></textarea>
                <div>
                    Please read over the already existing rhetoric and bulletpoints. New bulletpoints should only
                    be submitted if you are certain that the other bulletpoints do not already contain the argument
                    you are submitting. New Bulletpoints are limited to 1150 characters.
                </div>

                <div class="extra-small-text medium-margin-vertical">
                    Foul language and namecalling is not allowed. Please remain respectful of others, on topic, and
                    intellectually honest. We retain the right to reject any new bulletpoints for any reason. Please
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
        name: "SubmitBulletPoints",
        props: {
            arrayItemProp: Object
        },
        data() {
            return {
                currentUser: null,
                submitted: false,
                content: ""
            }
        },
        methods: {
            submitBulletPoint: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else if (this.validBulletPoint(this.content)) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitBulletPoint($metaSlug: String!, $slug: String!, $content: String!){
                                submitBulletPoint(metaSlug: $metaSlug, slug: $slug, content: $content)
                            }
                        `,
                        variables: {
                            metaSlug: this.metaSlug,
                            slug: this.slug,
                            content: this.content
                        }
                    }).then(({data}) => {
                        console.log("new", data)
                        //Redirect to status page
                    }).catch(() => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            validBulletPoint(content) {
                if (content.length > 1150) {
                    this.content = this.content.slice(0,1150);
                    this.$toasted.show('Bulletpoints must be 1150 characters or less', {
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
            content(newcontent) {
                this.validBulletPoint(newcontent);
            }
        },
        computed: {
            slug() {
                return this.arrayItemProp.slug;
            },
            metaSlug() {
                return this.arrayItemProp.metaSlug;
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