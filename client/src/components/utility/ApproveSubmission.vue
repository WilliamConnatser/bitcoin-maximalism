<template>
    <div class="submission-form">
        <form v-if="!submitted" @submit.prevent="submitApproval()">
            <h2 class="medium-margin-vertical">approve {{submissionObject.__typename.toLowerCase()}}</h2>
            <div class="medium-margin-vertical">

                <label @click="approved = !approved" for="agree" class="checkbox">
                    <input type="checkbox" name="agree" class=".checkbox">
                    <font-awesome-icon v-if="!approved" icon="square" title="Unchecked" class="checkbox__icon" />
                    <font-awesome-icon v-else icon="check-square" title="Checked" class="checkbox__icon" />
                </label>

                <label>approval reason</label>
                <textarea v-model="approvalReason" name="approval-reason" class="short-textarea"></textarea>

                <div class="extra-small-text medium-margin-vertical">
                    This form can be used to toggle approval for any submission.
                </div>
            </div>

            <button type="submit">
                <span v-if="approved">Approve Submission</span>
                <span v-else>Unapprove Submission</span>
            </button>
        </form>
        <div v-else class="medium-margin large-margin-vertical">
            Your resource was submitted successfully. {{submitted}}
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "ApproveSubmission",
        props: {
            submissionObject: Object
        },
        data() {
            if (this.submissionObject.approvalDate !== undefined) {
                return {
                    currentUser: null,
                    submitted: false,
                    approved: this.submissionObject.approved,
                    approvalReason: this.submissionObject.approvalReason
                }
            } else {
                return {
                    currentUser: null,
                    submitted: false,
                    approved: false,
                    approvalReason: ""
                }
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