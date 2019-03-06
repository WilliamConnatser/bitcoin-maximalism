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
                <textarea v-model="approvalCommentary" name="approval reason" class="short-textarea"></textarea>

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
            The submission
            <span v-if="approved">approval</span>
            <span v-else>disproval</span>
            was submitted successfully.
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
            return {
                currentUser: null,
                submitted: false,
                approved: this.submissionObject.approved,
                approvalCommentary: this.submissionObject.approvalCommentary
            }
        },
        methods: {
            submitApproval: async function () {
                await this.$apollo.queries.currentUser.refetch();
                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else if (this.validApprovalCommentary(this.approvalCommentary) && this.validApproved(this.approved)) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation toggleApproval($onModel: String!, $documentID: ID!, $approved: Boolean!, $approvalCommentary: String!){
                                toggleApproval(onModel: $onModel, documentID: $documentID, approved: $approved, approvalCommentary: $approvalCommentary)
                            }
                        `,
                        variables: {
                            onModel: this.submissionObject.__typename,
                            documentID: this.submissionObject._id,
                            approved: this.approved,
                            approvalCommentary: this.approvalCommentary
                        }
                    }).then(({
                        data
                    }) => {
                        this.submitted = data.toggleApproval;
                        //Redirect to status page
                    }).catch(() => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
            },
            validApproved(approved) {
                if (typeof approved !== "boolean") {
                    this.approved = false;
                    this.$toasted.show('Approval commentary must be a boolean', {
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
            validApprovalCommentary(approved) {
                if (typeof approved !== "string") {
                    this.approved = false;
                    this.$toasted.show('Approval commentary must be a string', {
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
            approved(newApproved) {
                this.validApproved(newApproved);
            },
            approvalCommentary(newApprovalCommentary) {
                this.validApprovalCommentary(newApprovalCommentary);
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