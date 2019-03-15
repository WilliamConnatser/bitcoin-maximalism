<template>
    <main>
        <h1 class="heading">submission status</h1>
        <h2 v-if="$apollo.loading" class="loading">Loading...</h2>
        <span v-else class="apollo-response" />

        <div v-if="documentType==='argument'">
            <h2>Unapproved Argument</h2>
            <div v-if="unapprovedRhetoric.length>0">
                <ul v-for="argument in unapprovedRhetoric" :key="argument._id" class="list">
                    <li>
                        <div>
                            <strong>{{argument.dateCreated | formatDate}}</strong><br />
                            {{argument.title}}
                            <div v-if="argument.dateApproved" class="small-text medium-margin">
                                <div v-if="argument.approved">
                                    This argument was approved on {{argument.dateApproved | formatDate}}
                                    <br />
                                    <router-link class="extra-small-text" :to="argumentLink(argument.metaSlug, argument.slug)">
                                        {{argumentLink(argument.metaSlug,argument.slug)}}
                                    </router-link>
                                </div>
                                <div v-else>
                                    This argument was denied approval on {{argument.dateApproved | formatDate}}
                                    <br />
                                    Reason: {{argument.approvalCommentary}}
                                </div>
                            </div>
                            <div v-else class="small-text medium-margin">
                                This argument has not been approved yet.
                            </div>
                        </div>
                        <div v-if="currentUser && (currentUser.admin || (argument.createdBy._id === currentUser._id && !argument.dateApproved))">
                            <div class="list-submissions-toolbar small-text medium-margin">
                                <span @click="show('editRhetoric'), cancel('approveRhetoric')" class="small-text icon-group cursor-pointer">
                                    <font-awesome-icon v-if="!editRhetoric" icon="pen-square" class="large-icon" />
                                    <font-awesome-icon v-else icon="minus-square" class="large-icon" />
                                    <span>edit argument</span>
                                </span>

                                <span v-if="currentUser && currentUser.admin" @click="show('approveRhetoric'), cancel('editRhetoric')"
                                    class="small-text icon-group cursor-pointer">
                                    <font-awesome-icon v-if="!approveRhetoric" icon="check-square" class="large-icon" />
                                    <font-awesome-icon v-else icon="minus-square" class="large-icon" />
                                    <span>approve argument</span>
                                </span>
                            </div>
                            <SubmitRhetoric v-if="editRhetoric" :rhetoricObject="argument" />
                            <ApproveSubmission v-if="approveRhetoric" :submissionObject="argument" />
                        </div>
                        <router-link class="extra-small-text" :to="submissionStatusLink(argument)">
                            Reference Link
                        </router-link>
                    </li>
                </ul>
            </div>
            <div v-else class="small-text medium-margin">
                There aren't any unapproved arguments yet.
            </div>
        </div>
        <div v-if="documentType==='bulletpoint'">
            <h2>Unapproved BulletPoint</h2>
            <div v-if="unapprovedBulletPoints.length>0">
                <ul v-for="bulletPoint in unapprovedBulletPoints" :key="bulletPoint._id" class="list">
                    <li>
                        <div>
                            <strong>{{bulletPoint.dateCreated | formatDate}}</strong>
                            <br />
                            {{bulletPoint.content}}

                            <div v-if="bulletPoint.dateApproved" class="small-text medium-margin">
                                <div v-if="bulletPoint.approved">
                                    This bulletpoint was approved on {{bulletPoint.dateApproved | formatDate}}
                                    <br />
                                    <router-link class="extra-small-text" :to="argumentLink(bulletPoint.metaSlug, bulletPoint.slug)">
                                        {{argumentLink(bulletPoint.metaSlug,bulletPoint.slug)}}
                                    </router-link>
                                </div>
                                <div v-else>
                                    This bulletpoint was denied approval on {{bulletPoint.dateApproved | formatDate}}
                                    <br />
                                    Reason: {{bulletPoint.approvalCommentary}}
                                </div>
                            </div>
                            <div v-else class="small-text medium-margin">
                                This bulletpoint has not been approved yet.
                            </div>
                        </div>
                        <div v-if="currentUser && (currentUser.admin || (bulletPoint.createdBy._id === currentUser._id && !bulletPoint.dateApproved))">
                            <div class="list-submissions-toolbar small-text medium-margin">
                                <span @click="show('editBulletPoint'), cancel('approveBulletPoint')" class="small-text
                                    icon-group cursor-pointer">
                                    <font-awesome-icon v-if="!editBulletPoint" icon="pen-square" class="large-icon" />
                                    <font-awesome-icon v-else icon="minus-square" class="large-icon" />
                                    <span>edit bulletpoint</span>
                                </span>
                                <span v-if="currentUser && currentUser.admin" @click="show('approveBulletPoint'), cancel('editBulletPoint')"
                                    class="small-text icon-group cursor-pointer">
                                    <font-awesome-icon v-if="!approveBulletPoint" icon="check-square" class="large-icon" />
                                    <font-awesome-icon v-else icon="minus-square" class="large-icon" />
                                    <span>approve bulletpoint</span>
                                </span>
                            </div>
                            <SubmitBulletPoints v-if="editBulletPoint" :bulletPointObject="bulletPoint" />
                            <ApproveSubmission v-if="approveBulletPoint" :submissionObject="bulletPoint" />
                        </div>
                        <router-link class="uppercase extra-small-text" :to="submissionStatusLink(bulletPoint)">
                            Reference Link
                        </router-link>
                    </li>
                </ul>
            </div>
            <div v-else class="small-text medium-margin">
                There are no unapproved bulletpoints yet.
            </div>
        </div>

        <div v-if="documentType==='resource'">
            <h2>Unapproved Resource</h2>
            <div v-if="unapprovedResources.length>0">
                <ul v-for="resource in unapprovedResources" :key="resource._id" class="list">
                    <li>
                        <strong>{{resource.dateCreated | formatDate}}</strong>
                        <br />
                        <a :href="resource.link" class="unstyled-link">
                            <span class="media-type">
                                { {{resource.media}} }
                            </span>
                            {{resource.title}}
                        </a>
                        <br />
                        <router-link v-if="resource.approved" :to="argumentLink(resource.metaSlug, resource.slug)">
                            {{argumentLink(resource.metaSlug, resource.slug)}}
                        </router-link>

                        <div v-if="resource.dateApproved" class="small-text medium-margin">
                            <div v-if="resource.approved">
                                This resource was approved on {{resource.dateApproved | formatDate}}
                                <br />
                                <router-link class="extra-small-text" :to="argumentLink(resource.metaSlug, resource.slug)">
                                    {{argumentLink(resource.metaSlug, resource.slug)}}
                                </router-link>
                            </div>
                            <div v-else>
                                This resource was denied approval on {{resource.dateApproved | formatDate}}
                                <br />
                                Reason: {{resource.approvalCommentary}}
                            </div>
                        </div>
                        <div v-else class="small-text medium-margin">
                            This resource has not been approved yet.
                        </div>
                        <div v-if="currentUser && (currentUser.admin || (resource.createdBy._id === currentUser._id && !resource.dateApproved))">
                            <div class="list-submissions-toolbar small-text medium-margin">
                                <span @click="show('editResource'), cancel('approveResource')" class="small-text icon-group cursor-pointer">
                                    <font-awesome-icon v-if="!editResource" icon="pen-square" class="large-icon" />
                                    <font-awesome-icon v-else icon="minus-square" class="large-icon" />
                                    <span>edit resource</span>
                                </span>

                                <span v-if="currentUser && currentUser.admin" @click="show('approveResource'), cancel('editResource')"
                                    class="small-text icon-group cursor-pointer">
                                    <font-awesome-icon v-if="!approveResource" icon="check-square" class="large-icon" />
                                    <font-awesome-icon v-else icon="minus-square" class="large-icon" />
                                    <span>approve resource</span>
                                </span>
                            </div>
                            <SubmitResources v-if="editResource" :resourceObject="resource" />
                            <ApproveSubmission v-if="approveResource" :submissionObject="resource" />
                        </div>
                        <router-link :to="submissionStatusLink(resource)">
                            Reference Link
                        </router-link>
                    </li>
                </ul>
            </div>
            <div v-else class="small-text medium-margin">
                There aren't any unapproved resources.
            </div>
        </div>
    </main>
</template>

<script>
    import gql from 'graphql-tag';
    import SubmitResources from '../utility/SubmitResources.vue';
    import SubmitRhetoric from '../utility/SubmitRhetoric.vue';
    import SubmitBulletPoints from '../utility/SubmitBulletPoints.vue';
    import ApproveSubmission from '../utility/ApproveSubmission.vue';

    export default {
        name: "SubmissionStatus",
        data() {
            return {
                unapprovedRhetoric: [],
                unapprovedBulletPoints: [],
                unapprovedResources: [],
                editRhetoric: false,
                approveRhetoric: false,
                editBulletPoint: false,
                approveBulletPoint: false,
                editResource: false,
                approveResource: false
            }
        },
        components: {
            ApproveSubmission,
            SubmitRhetoric,
            SubmitBulletPoints,
            SubmitResources
        },
        methods: {
            submissionStatusLink(submission) {
                if (submission.__typename === 'Rhetoric') return `/submission-status/argument/${submission._id}`;
                if (submission.__typename === 'Resource') return `/submission-status/resource/${submission._id}`;
                if (submission.__typename === 'BulletPoint') return `/submission-status/bulletpoint/${submission._id}`;
                else return `/404`;
            },
            cancel(actionType) {
                this[actionType] = null;
            },
            show: async function (actionType) {

                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();
                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();
                } else {
                    if (!this[actionType]) {
                        this[actionType] = true;
                    } else {
                        this[actionType] = false;
                    }
                }
            },
            argumentLink(metaSlug, slug) {
                if (slug !== null) {
                    return `/arguments/${metaSlug}/${slug}`;
                } else {
                    return `/arguments/${metaSlug}`;
                }
            }
        },
        computed: {
            documentType() {
                return this.$route.params.documentType;
            },
            documentID() {
                return this.$route.params.documentID;
            }
        },
        apollo: {
            currentUser: {
                query: gql `
                    query currentUser {
                        currentUser {
                            _id
                            admin
                            emailVerified
                        }
                    }
                `
            },
            unapprovedRhetoric: {
                query: gql `query unapprovedRhetoric($_id: ID!) {
                    unapprovedRhetoric(_id: $_id) {
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
                        _id: this.documentID
                    }
                },
                skip() {
                    if (this.documentType === "argument") return false;
                    else return true;
                }
            },
            unapprovedBulletPoints: {
                query: gql `query unapprovedBulletPoints($_id: ID!) {
                    unapprovedBulletPoints(_id: $_id) {
                        _id
                        dateCreated
                        createdBy {
                            _id
                            username
                        }
                        slug
                        metaSlug
                        content
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
                        _id: this.documentID
                    }
                },
                skip() {
                    if (this.documentType === "bulletpoint") return false;
                    else return true;
                }
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
                        _id: this.documentID
                    }
                },
                skip() {
                    if (this.documentType === "resource") return false;
                    else return true;
                }
            }
        }
    };
</script>