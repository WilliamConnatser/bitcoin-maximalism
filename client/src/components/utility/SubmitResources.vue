<template>
    <div class="submission-form">
        <form v-if="!submitted" @submit.prevent="submitResource()">
            <h2 class="medium-margin-vertical">submit resource</h2>
            <div class="medium-margin-vertical">
                <label>resource title</label>
                <textarea v-model="title" maxlength=280 name="title" class="short-textarea"></textarea>
                <label>resource link</label>
                <textarea v-model="link" name="link" class="short-textarea"></textarea>
                <label>resource type</label>
                <select v-model="media" class="wide-input">
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
                <div class="extra-small-text medium-margin-vertical">
                    Please look over the already existing resources and the rhetoric contained within them. New
                    resources should only be submitted if you are certain that the other resources do not already
                    cover the content that you are submitting. The title of the article should be written
                    exactly how it is typed on the original source.
                </div>

                <div class="extra-small-text medium-margin-vertical">
                    Foul language and namecalling is not allowed. Please remain respectful of others, on topic, and
                    intellectually honest. We retain the right to reject any new resources for any reason. Please
                    read our <router-link to='/terms'>Terms</router-link> for more information. By clicking Agree
                    &amp; Submit below you agree that you have read and understand to those Terms.
                </div>
            </div>

            <button type="submit">Agree &amp; Submit</button>
        </form>
        <div v-else class="medium-margin large-margin-vertical">
            Your resource was submitted successfully. {{submitted}}
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "SubmitResources",
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
            submitResource: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else if (this.validTitle(this.title) && this.validMedia(this.media) && this.validLink(this.link)) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitResource($metaSlug: String!, $slug: String!, $title: String!, $media: String!, $link:String!){
                                submitResource(metaSlug: $metaSlug, slug: $slug, title: $title, media: $media, link:$link)
                            }
                        `,
                        variables: {
                            metaSlug: this.metaSlug,
                            slug: this.slug,
                            title: this.title,
                            media: this.media,
                            link: this.link
                        }
                    }).then(({data}) => {
                        this.submitted = data.submitResource;
                        //Redirect to status page
                    }).catch(() => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            validTitle(title) {
                if (title.length > 280) {
                    this.title = title.slice(0, 280);
                    this.$toasted.show('Titles must be 280 characters or less', {
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
            validMedia(media) {
                if (media !== "article" && media !== "blog" && media !== "podcast" && media !== "video" && media !==
                    "whitepaper") {
                    this.media = "article";
                    this.$toasted.show('Invalid media type submitted', {
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
                } else if (media.trim() === "") {
                    this.$toasted.show('You must enter a media type', {
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
            validLink(link) {
                if (link.trim() === "") {
                    this.$toasted.show('You must enter a link', {
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
            },
            media(newMedia) {
                this.validMedia(newMedia);
            },
            link(newLink) {
                this.validLink(newLink);
            }
        },
        computed: {
            slug() {
                return this.$route.params.slug;
            },
            metaSlug() {
                return this.$route.params.metaSlug;
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