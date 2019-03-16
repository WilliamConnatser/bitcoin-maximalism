<template>
    <div class="submission-form">
        <form v-if="!submitted" @submit.prevent="submitForm()">
            <h2 v-if="resourceObject === undefined" class="medium-margin-vertical">submit resource</h2>
            <h2 class="medium-margin-vertical">edit resource</h2>
            <div class="medium-margin-vertical">
                <label>argument type</label>
                <select v-model="metaSlug" class="wide-input" @change="metaSlugChanged()">
                    <option value="protagonistic" :selected="metaSlug === 'protagonistic'">
                        Protagonistic
                    </option>
                    <option value="antagonistic" :selected="metaSlug === 'antagonistic'">
                        Antagonistic
                    </option>
                </select>
                <label>argument slug</label>
                <select v-model="slug" class="wide-input">
                    <option v-if="slug===null" value="null">Pick a Slug...</option>
                    <option v-for="querySlug in allSlugs[metaSlug]" :value="querySlug" :selected="querySlug === slug"
                        :key="querySlug">
                        {{querySlug}}
                    </option>
                </select>
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
                    <option value="website" :selected="media === 'website'">
                        Website
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
                    read our <router-link to='/terms' class="small-uppercase-link">Terms</router-link> for more information. By clicking Agree
                    &amp; Submit below you agree that you have read and understand to those Terms.
                </div>
            </div>

            <button type="submit">
                Agree &amp; Submit
                <span v-if="resourceObject !== undefined">Edit</span>
            </button>
        </form>
        <div v-else-if="resourceObject === undefined" class="medium-margin large-margin-vertical">
            <h2>The resource was submitted successfully!</h2>
            You may track the status of your submission in your Account Panel or <router-link :to="submissionStatusLink(submitted)" class="small-uppercase-link">HERE</router-link>
        </div>
        <div v-else>
            <h2>The resource was edited successfully!</h2>
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "SubmitResources",
        props: {
            resourceObject: Object
        },
        data() {
            if (this.resourceObject === undefined) {
                return {
                    currentUser: null,
                    allSlugs: {},
                    submitted: false,
                    slug: this.$route.params.slug,
                    metaSlug: this.$route.params.metaSlug,
                    title: "",
                    media: "article",
                    link: ""
                }

            } else {
                return {
                    currentUser: null,
                    allSlugs: {},
                    submitted: false,
                    slug: this.resourceObject.slug,
                    metaSlug: this.resourceObject.metaSlug,
                    title: this.resourceObject.title,
                    media: this.resourceObject.media,
                    link: this.resourceObject.link
                }
            }
        },
        methods: {
            submitForm() {
                if (this.resourceObject) {
                    this.submitResourceEdit();

                } else {
                    this.submitResource();
                }
            },
            submitResourceEdit: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();

                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();

                } else if (this.validTitle(this.title) &&
                    this.validMedia(this.media) &&
                    this.validLink(this.link) &&
                    this.validMetaSlug(this.metaSlug) &&
                    this.validSlug(this.slug)) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitEditResource(
                                $documentID: ID!
                                $metaSlug: String!
                                $slug: String!
                                $title: String!
                                $media: String!
                                $link: String!
                            ) {
                                submitEditResource(
                                    documentID: $documentID
                                    metaSlug: $metaSlug
                                    slug: $slug
                                    title: $title
                                    media: $media
                                    link: $link
                                )
                            }
                        `,
                        variables: {
                            documentID: this.resourceObject._id,
                            metaSlug: this.metaSlug,
                            slug: this.slug,
                            title: this.title,
                            media: this.media,
                            link: this.link
                        }
                    }).then(() => {
                        this.submitted = true;
                        this.$apollo.queries.unapprovedResources.refetch();
                    }).catch(() => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            submitResource: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();

                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();

                } else if (this.validTitle(this.title) &&
                    this.validMedia(this.media) &&
                    this.validLink(this.link) &&
                    this.validMetaSlug(this.metaSlug) &&
                    this.validSlug(this.slug)) {
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
                    }).then(({
                        data
                    }) => {
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
                if (media !== "article" && media !== "blog" &&
                    media !== "podcast" && media !== "video" &&
                    media !== "whitepaper" && media !== "website") {
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
            },
            validSlug(slug) {
                if (!this.allSlugs[this.metaSlug].includes(slug)) {

                    if (this.resourceObject === undefined) {
                        this.slug = this.$route.params.slug;
                    } else {
                        this.slug = this.resourceObject.slug;
                    }

                    this.$toasted.show('You must choose a valid slug', {
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
                if (metaSlug === 'protagonistic' ||
                    metaSlug === 'antagonistic') {
                    return true;

                } else {
                    if (this.resourceObject === undefined) {
                        this.metaSlug = this.$route.params.metaSlug;
                    } else {
                        this.metaSlug = this.resourceObject.metaSlug;
                    }

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
                }
            },
            metaSlugChanged() {
                this.slug = null;
            },
            submissionStatusLink(_id) {
                return `/submission-status/argument/${_id}`;
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
            },
            allSlugs: {
                query: gql `
                    query allSlugs{
                        allSlugs{
                            protagonistic
                            antagonistic
                        }
                    }
                `
            },
            unapprovedResources: {
                query: gql `query unapprovedResources($_id: ID!) {
                    unapprovedResources(_id: $_id) {
                        _id
                        dateCreated
                        createdBy {
                            _id
                            username
                        }
                        active
                        slug
                        metaSlug
                        title
                        media
                        link
                        approved
                        dateApproved
                        approvedBy {
                            _id
                            username
                        }
                        approvalCommentary
                    }
                }`,
                variables() {
                    return {
                        _id: this.resourceObject._id
                    }
                },
                skip() {
                    if (this.resourceObject === undefined) return true;
                    else return false;
                }
            }
        }
    };
</script>