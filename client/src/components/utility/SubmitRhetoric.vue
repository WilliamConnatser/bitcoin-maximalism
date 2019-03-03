<template>
    <div>
        <form v-if="!submitted" @submit.prevent="submitRhetoric()">
            <h2 class="medium-margin-vertical">submit argument</h2>
            <div class="medium-margin-vertical">
                <label for="title">argument title</label>
                <textarea v-model="title" maxlength=75 name="title" class="short-textarea"></textarea>
                <label>argument type</label>
                <select v-model="metaSlug" class="wide-input">
                    <option value="protagonistic" :selected="metaSlug === 'protagonistic'">
                        Protagonistic
                    </option>
                    <option value="antagonistic" :selected="metaSlug === 'antagonistic'">
                        Antagonistic
                    </option>
                </select>
                <label for="slug">argument slug</label>
                <input v-model="slug" class="wide-input" name="slug">
                <div class="extra-small-text medium-margin-vertical">
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

        <div v-else class="medium-margin  large-margin-vertical">
            Your argument was submitted successfully. {{submitted}}
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "SubmitRhetoric",
        data() {
            return {
                currentUser: null,
                submitted: false,
                title: "",
                metaSlug: "protagonistic",
                slug: "argument-slug"
            }
        },
        methods: {
            submitRhetoric: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else if (this.validTitle(this.title) && this.validMetaSlug(this.metaSlug) && this.validSlug(this.slug)) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitRhetoric($metaSlug: String!, $slug: String!, $title: String!){
                                submitRhetoric(metaSlug: $metaSlug, slug: $slug, title: $title)
                            }
                        `,
                        variables: {
                            metaSlug: this.metaSlug,
                            slug: this.slug,
                            title: this.title
                        }
                    }).then(({data}) => {
                        this.submitted = data.submitRhetoric;
                        //Redirect to status page
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
                } else if (title.trim() === "") {
                    this.$toasted.show('You must enter a title', {
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
            },
            validMetaSlug(metaSlug) {
                if (metaSlug !== "protagonistic" && metaSlug !== "antagonistic") {
                    this.media = "protagonistic";
                    this.$toasted.show('Invalid argument type submitted', {
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
                } else if (metaSlug.trim() === "") {
                    this.$toasted.show('You must select a media type', {
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
            },
            validSlug(slug) {
                if (!/^[a-z0-9-]*$/.test(slug)) {
                    this.slug = "argument-slug";
                    this.$toasted.show('Slugs should only contain lower case letters and dashes (-)', {
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
                } else if (slug.trim() === "") {
                    this.slug = "argument-slug";
                    this.$toasted.show('You must enter a slug', {
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
                    this.slug = this.slug.toLowerCase();
                    return true;
                }
            }
        },
        watch: {
            title(newTitle) {
                this.validTitle(newTitle);
            },
            metaSlug(newMetaSlug) {
                this.validMetaSlug(newMetaSlug);
            },
            slug(newSlug) {
                this.validSlug(newSlug);
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