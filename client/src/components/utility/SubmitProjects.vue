<template>
    <div class="submission-form">
        <form v-if="!submitted" @submit.prevent="submitForm()">
            <h2 v-if="projectObject === undefined" class="medium-margin-vertical">submit project</h2>
            <h2 v-else class="medium-margin-vertical">edit project</h2>
            <div class="medium-margin-vertical">
                <label>project type</label>
                <select v-model="metaSlug" class="wide-input">
                    <option value="protagonistic" :selected="metaSlug === 'protagonistic'">
                        protagonistic (bitcoin-related)
                    </option>
                    <option value="antagonistic" :selected="metaSlug === 'antagonistic'">
                        antagonistic (ALT coin-related)
                    </option>
                </select>
                <label>project title</label>
                <textarea v-model="title" maxlength=280 name="title" class="short-textarea"></textarea>
                <label>project link</label>
                <textarea v-model="link" name="link" class="short-textarea"></textarea>
                <label>project description</label>
                <textarea v-model="description" name="link" class="short-textarea"></textarea>
                <div class="extra-small-text medium-margin-vertical">
                    Please look over the already existing projects and make certain the project you're submitting has
                    not already been submitted. The title of the article should be written exactly how it is typed on
                    the original source. We retain the right to reject any new projects for any reason. Please
                    read our <router-link to='/terms' class="small-uppercase-link">Terms</router-link> for more
                    information. By clicking Agree &amp; Submit below you agree that you have read and understand
                    those Terms.
                </div>
            </div>

            <button type="submit">
                Agree &amp; Submit
                <span v-if="projectObject !== undefined">Edit</span>
            </button>
        </form>
        <div v-else-if="projectObject === undefined" class="medium-margin large-margin-vertical">
            <h2>The project was submitted successfully!</h2>
            You may track the status of your submission in your Account Panel or <router-link :to="submissionStatusLink(submitted)"
                class="small-uppercase-link">HERE</router-link>
        </div>
        <div v-else>
            <h2>The project was edited successfully!</h2>
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "SubmitProjects",
        props: {
            projectObject: Object
        },
        data() {
            if (this.projectObject === undefined) {
                return {
                    currentUser: null,
                    submitted: false,
                    metaSlug: this.$route.params.metaSlug,
                    title: "",
                    description: "",
                    link: ""
                }

            } else {
                return {
                    currentUser: null,
                    submitted: false,
                    metaSlug: this.projectObject.metaSlug,
                    title: this.projectObject.title,
                    description: this.projectObject.description,
                    link: this.projectObject.link
                }
            }
        },
        methods: {
            submitForm() {
                if (this.projectObject) {
                    this.submitProjectEdit();

                } else {
                    this.submitProject();
                }
            },
            submitProjectEdit: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();

                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();

                } else if (this.validTitle(this.title) &&
                    this.validDescription(this.description) &&
                    this.validLink(this.link) &&
                    this.validMetaSlug(this.metaSlug)) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitEditProject(
                                $documentID: ID!
                                $metaSlug: String!
                                $title: String!
                                $link: String!
                                $description: String!
                            ) {
                                submitEditProject(
                                    documentID: $documentID
                                    metaSlug: $metaSlug
                                    title: $title
                                    link: $link
                                    description: $description
                                )
                            }
                        `,
                        variables: {
                            documentID: this.projectObject._id,
                            metaSlug: this.metaSlug,
                            title: this.title,
                            link: this.link,
                            description: this.description
                        }
                    }).then(() => {
                        this.submitted = true;
                        this.$parent.$apollo.queries.unapprovedProjects.refetch();
                    }).catch(() => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            submitProject: async function () {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();

                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();

                } else if (this.validTitle(this.title) &&
                    this.validDescription(this.description) &&
                    this.validLink(this.link) &&
                    this.validMetaSlug(this.metaSlug)) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation submitProject(
                                $metaSlug: String!
                                $title: String!
                                $link: String!
                                $description: String!
                            ) {
                                submitProject(
                                    metaSlug: $metaSlug
                                    title: $title                                  
                                    link: $link
                                    description: $description
                                )
                            }
                        `,
                        variables: {
                            metaSlug: this.metaSlug,
                            title: this.title,
                            link: this.link,
                            description: this.description
                        }
                    }).then(({
                        data
                    }) => {
                        this.submitted = data.submitProject;
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
            validDescription(title) {
                if (title.length > 1150) {
                    this.title = title.slice(0, 1150);
                    this.$toasted.show('Descriptions must be 1150 characters or less', {
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
                    this.$toasted.show('You must enter a description', {
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
                    this.$toasted.show('You must choose a project type', {
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
            submissionStatusLink(_id) {
                return `/submission-status/project/${_id}`;
            }
        },
        watch: {
            title(newTitle) {
                this.validTitle(newTitle);
            },
            description(newDescription) {
                this.validDescription(newDescription);
            },
            link(newLink) {
                this.validLink(newLink);
            },
            metaSlug(newMetaSlug) {
                this.validMetaSlug(newMetaSlug);
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
            unapprovedProjects: {
                query: gql `query unapprovedProjects($_id: ID!) {
                        unapprovedProjects(_id: $_id) {
                            _id
                            dateCreated
                            createdBy {
                                _id
                                username
                            }
                            active
                            metaSlug
                            title
                            description
                            link
                            approved
                            dateApproved
                            approvedBy {
                                _id
                                username
                            }
                            approvalCommentary
                        }
                    }
                `,
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