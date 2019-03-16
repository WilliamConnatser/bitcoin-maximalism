<template>
    <main class="container apollo-response">
        <Login v-if="!currentUser" />
        <div v-if="currentUser">
            <section>
                <div>
                    <h1 class="heading">account panel</h1>
                    <a>
                        <router-link to="/submit-donation"><button>Add Influence</button></router-link>
                    </a>
                    <a>
                        <button @click="signoutUser">Signout</button>
                    </a>
                </div>
                <div>
                    Influence: {{currentUser.accruedDonations | formatBitcoinAmount}}
                </div>
                <div>
                    Referral Link: <br />
                    <a :href="refLink" class="small-uppercase-link">{{refLink}}</a>
                    <SocialIcons :currentUser="currentUser" />
                </div>
            </section>

            <div class="medium-margin-vertical">
                <h2>Account History</h2>
                <button @click="toggleHistoryTab('Donation')" :class="tabButtonStyle('Donation')">Donations</button>
                <button @click="toggleHistoryTab('Opinion')" :class="tabButtonStyle('Opinion')">Opinions</button>
                <button @click="toggleHistoryTab('Vote')" :class="tabButtonStyle('Vote')">Votes</button>
                <br />
                <button @click="toggleHistoryTab('Rhetoric')" :class="tabButtonStyle('Rhetoric')">Arguments</button>
                <button @click="toggleHistoryTab('BulletPoint')" :class="tabButtonStyle('BulletPoint')">Bulletpoints</button>
                <button @click="toggleHistoryTab('Resource')" :class="tabButtonStyle('Resource')">Resources</button>
            </div>
            <h2 v-if="$apollo.loading" class="loading">Loading...</h2>

            <div v-if="historyTab === 'Donation'" class="medium-margin">
                <h2>Donations</h2>
                <div v-if="currentUser.donations.length>0">
                    <ul v-for="donation in currentUser.donations" :key="donation._id" class="list">
                        <li>
                            <strong>{{donation.dateCreated | formatDate}}</strong>
                            <br />
                            Donation For: {{donationFor(donation.accruing, donation.onModel)}}
                            <br />
                            Status: <strong>{{status(donation)}}</strong>
                            <br />

                            <div v-if="!donation.active && !donation.paid">
                                This invoice expired without payment.
                            </div>
                            <div v-else-if="donation.paid">
                                This donation was paid!
                            </div>

                            <router-link :to="statusLink(donation)" class="uppercase small-uppercase-link">
                                Info
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-else class="small-text medium-margin">
                    You haven't made any donations yet.
                </div>
            </div>

            <div v-if="historyTab === 'Opinion'" class="medium-margin">
                <h2>Opinions</h2>
                <div v-if="currentUser.opinions.length>0">
                    <ul v-for="opinion in currentUser.opinions" :key="opinion._id" class="list">
                        <li>
                            <strong>{{opinion.dateCreated | formatDate}}</strong>
                            <br />
                            Influence:
                            <span v-if="calculateVotes(opinion.votes)>0">
                                + {{calculateVotes(opinion.votes) | formatBitcoinAmount}}
                            </span>
                            <span v-else-if="calculateVotes(opinion.votes)<0">
                                - {{calculateVotes(opinion.votes)*-1 | formatBitcoinAmount}}
                            </span>
                            <span v-else-if="calculateVotes(opinion.votes)===0">
                                {{calculateVotes(opinion.votes) | formatBitcoinAmount}}
                            </span>
                            <br />
                            {{opinion.opinion}}
                            <br />

                            <router-link :to="argumentLink(opinion.metaSlug, opinion.slug)" class="small-uppercase-link">
                                {{argumentLink(opinion.metaSlug,opinion.slug)}}
                            </router-link>

                            <div v-if="opinion.censored">
                                <div v-if="!approved">
                                    Removed From Website
                                </div>
                                <div v-else>
                                    Edited By Administrators
                                </div>
                                Reason: {{opinion.censoredCommentary}}
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-else class="small-text medium-margin">
                    You haven't submitted any opinions yet.
                </div>
            </div>

            <div v-if="historyTab === 'Vote'" class="medium-margin">
                <h2>Votes</h2>
                <div v-if="currentUser.votes.length>0">
                    <ul v-for="vote in currentUser.votes" :key="vote._id" class="list">
                        <li>
                            <strong>{{vote.dateCreated | formatDate}}</strong>
                            <br />

                            <span v-if="vote.upVote">Upvote +{{currentUser.accruedDonations | formatBitcoinAmount}}</span>
                            <span v-else>Downvote -{{currentUser.accruedDonations | formatBitcoinAmount}}</span>
                            <br />

                            <router-link :to="argumentLink(vote.metaSlug, vote.slug)" class="small-uppercase-link">
                                {{argumentLink(vote.metaSlug,vote.slug)}}
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-else class="small-text medium-margin">
                    You haven't submitted any votes yet.
                </div>
            </div>

            <div v-if="historyTab === 'Rhetoric'" class="medium-margin">
                <h2>Arguments</h2>
                <div v-if="currentUser.rhetoric.length>0">
                    <ul v-for="argument in currentUser.rhetoric" :key="argument._id" class="list">
                        <li>
                            <strong>{{argument.dateCreated | formatDate}}</strong>
                            <br />
                            {{argument.title}}

                            <div v-if="argument.dateApproved" class="small-text medium-margin">
                                <div v-if="argument.approved">
                                    This argument was approved on {{argument.dateApproved | formatDate}}
                                    <br />
                                    <router-link :to="argumentLink(argument.metaSlug, argument.slug)" class="small-uppercase-link">
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
                            <router-link :to="submissionStatusLink(argument)" class="small-uppercase-link">
                                Reference Link
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-else class="small-text medium-margin">
                    You haven't submitted any arguments yet.
                </div>
                <h2 v-if="currentUser.admin">Admin - Unapproved Arguments</h2>
                <div v-if="unapprovedRhetoric.length>0">
                    <ul v-for="argument in unapprovedRhetoric" :key="argument._id" class="list">
                        <li>
                            <strong>{{argument.dateCreated | formatDate}}</strong>
                            <br />
                            {{argument.title}}

                            <div v-if="argument.dateApproved">
                                <div v-if="argument.approved">
                                    This argument was approved on {{argument.dateApproved | formatDate}}
                                    <br />
                                    <router-link :to="argumentLink(argument.metaSlug, argument.slug)" class="small-uppercase-link">
                                        {{argumentLink(argument.metaSlug,argument.slug)}}
                                    </router-link>
                                </div>
                                <div v-else>
                                    This argument was denied approval on {{argument.dateApproved | formatDate}}
                                    <br />
                                    Reason Given: {{argument.approvalCommentary}}
                                </div>
                            </div>
                            <div v-else class="small-text medium-margin">
                                This argument has not been approved yet.
                            </div>
                            <router-link :to="submissionStatusLink(argument)" class="small-uppercase-link">
                                Reference Link
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-else-if="currentUser.admin" class="small-text medium-margin">
                    There aren't any unapproved arguments yet.
                </div>
            </div>

            <div v-if="historyTab === 'BulletPoint'" class="medium-margin">
                <h2>BulletPoints</h2>
                <div v-if="currentUser.bulletPoints.length>0">
                    <ul v-for="bulletPoint in currentUser.bulletPoints" :key="bulletPoint._id" class="list">
                        <li>
                            <strong>{{bulletPoint.dateCreated | formatDate}}</strong>
                            <br />
                            {{bulletPoint.content}}

                            <div v-if="bulletPoint.dateApproved">
                                <div v-if="bulletPoint.approved">
                                    This bulletpoint was approved on {{bulletPoint.dateApproved | formatDate}}
                                    <br />
                                    <router-link :to="argumentLink(bulletPoint.metaSlug, bulletPoint.slug)" class="small-uppercase-link">
                                        {{argumentLink(bulletPoint.metaSlug,bulletPoint.slug)}}
                                    </router-link>
                                </div>
                                <div v-else>
                                    This bulletpoint was denied approval on {{bulletPoint.dateApproved | formatDate}}
                                    <br />
                                    Reason Given: {{bulletPoint.approvalCommentary}}
                                </div>
                            </div>
                            <div v-else class="small-text medium-margin">
                                This bulletpoint has not been approved yet.
                            </div>
                            <router-link :to="submissionStatusLink(bulletPoint)" class="small-uppercase-link">
                                Reference Link
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-else class="small-text medium-margin">
                    You haven't submitted any bulletpoints yet.
                </div>
                <h2 v-if="currentUser.admin">Admin - Unapproved BulletPoints</h2>
                <div v-if="unapprovedBulletPoints.length>0">
                    <ul v-for="bulletPoint in unapprovedBulletPoints" :key="bulletPoint._id" class="list">
                        <li>
                            <strong>{{bulletPoint.dateCreated | formatDate}}</strong>
                            <br />
                            {{bulletPoint.content}}

                            <div v-if="bulletPoint.dateApproved">
                                <div v-if="bulletPoint.approved">
                                    This bulletpoint was approved on {{bulletPoint.dateApproved | formatDate}}
                                    <br />
                                    <router-link :to="argumentLink(bulletPoint.metaSlug, bulletPoint.slug)" class="small-uppercase-link">
                                        {{argumentLink(bulletPoint.metaSlug,bulletPoint.slug)}}
                                    </router-link>
                                </div>
                                <div v-else>
                                    This bulletpoint was denied approval on {{bulletPoint.dateApproved | formatDate}}
                                    <br />
                                    Reason Given: {{bulletPoint.approvalCommentary}}
                                </div>
                            </div>
                            <div v-else class="small-text medium-margin">
                                This bulletpoint has not been approved yet.
                            </div>
                            <router-link :to="submissionStatusLink(bulletPoint)" class="small-uppercase-link">
                                Reference Link
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-else-if="currentUser.admin" class="small-text medium-margin">
                    There are no unapproved bulletpoints yet.
                </div>
            </div>

            <div v-if="historyTab === 'Resource'" class="medium-margin">
                <h2>Resources</h2>
                <div v-if="currentUser.resources.length>0">
                    <ul v-for="resource in currentUser.resources" :key="resource._id" class="list">
                        <li>
                            <strong>{{resource.dateCreated | formatDate}}</strong>
                            <br />
                            <a :href="resource.link" class="unstyled-link">
                                <span class="media-type">
                                    { {{resource.media}} }
                                </span>
                                {{resource.title}}
                            </a>

                            <div v-if="resource.dateApproved">
                                <div v-if="resource.approved">
                                    This resource was approved on {{resource.dateApproved | formatDate}}
                                    <br />
                                    <router-link :to="argumentLink(resource.metaSlug, resource.slug)" class="small-uppercase-link">
                                        {{argumentLink(resource.metaSlug,resource.slug)}}
                                    </router-link>
                                </div>
                                <div v-else>
                                    This resource was denied approval on {{resource.dateApproved | formatDate}}
                                    <br />
                                    Reason Given: {{resource.approvalCommentary}}
                                </div>
                            </div>
                            <div v-else class="small-text medium-margin">
                                This resource has not been approved yet.
                            </div>
                            <router-link :to="submissionStatusLink(resource)" class="small-uppercase-link">
                                Reference Link
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-else class="small-text medium-margin">
                    You haven't submitted any resources yet.
                </div>
                <h2 v-if="currentUser.admin">Admin - Unapproved Resources</h2>
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
                            <div v-if="resource.dateApproved">
                                <div v-if="resource.approved">
                                    This resource was approved on {{resource.dateApproved | formatDate}}
                                    <br />
                                    <router-link :to="argumentLink(resource.metaSlug, resource.slug)" class="small-uppercase-link">
                                        {{argumentLink(resource.metaSlug,resource.slug)}}
                                    </router-link>
                                </div>
                                <div v-else>
                                    This resource was denied approval on {{resource.dateApproved | formatDate}}
                                    <br />
                                    Reason Given: {{resource.approvalCommentary}}
                                </div>
                            </div>
                            <div v-else class="small-text medium-margin">
                                This resource has not been approved yet.
                            </div>
                            <router-link :to="submissionStatusLink(resource)" class="small-uppercase-link">
                                Reference Link
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div v-else-if="currentUser && currentUser.admin" class="small-text medium-margin">
                    There aren't any unapproved resources.
                </div>
            </div>

            <div v-show="currentUser.admin">
                <h2>You so fancy! Look are you, Mr. Administrator...</h2>
            </div>
        </div>
    </main>
</template>

<script>
    import Login from '../auth/Login';
    import SocialIcons from '../utility/SocialIcons'
    import {
        defaultClient as apolloClient
    } from '../../apolloProvider';
    import gql from 'graphql-tag';

    export default {
        name: "Account",
        data() {
            return {
                currentUser: null,
                unapprovedRhetoric: [],
                unapprovedBulletPoints: [],
                unapprovedResources: [],
                approved: null,
                approvalCommentary: [],
                historyTab: 'Donation'
            }
        },
        created() {
            this.$apollo.queries.currentUser.refetch();
        },
        components: {
            Login,
            SocialIcons
        },
        computed: {
            refLink() {
                return `https://www.BitcoinMaximalism.com/?ref=${this.currentUser._id}`
            }
        },
        methods: {
            statusLink(donation) {
                return `/donation-status/${donation._id}`;
            },
            argumentLink(metaSlug, slug) {
                if (slug !== null) {
                    return `/arguments/${metaSlug}/${slug}`;
                } else {
                    return `/arguments/${metaSlug}`;
                }
            },
            submissionStatusLink(submission) {
                if (submission.__typename === 'Rhetoric') return `/submission-status/argument/${submission._id}`;
                if (submission.__typename === 'Resource') return `/submission-status/resource/${submission._id}`;
                if (submission.__typename === 'BulletPoint') return `/submission-status/bulletpoint/${submission._id}`;
                else return `/404`;
            },
            signoutUser() {
                //Remove token in localStorage
                localStorage.setItem("token", "");
                //End Apollo Client Session
                apolloClient.resetStore();
            },
            status(donation) {
                if (!donation.active) return 'Inactive'
                if (!donation.paid) return 'Unpaid'
                if (donation.paid) return 'Paid'
            },
            donationFor(accruing, onModel) {
                if (accruing) return 'Influence';
                else if (onModel === 'Certificate') return 'Certificate';
            },
            toggleHistoryTab(tabName) {
                this.historyTab = tabName;
            },
            tabButtonStyle(tabName) {
                if (tabName === this.historyTab) return "small-button selected-button ";
                else return "small-button ";
            },
            calculateVotes(voteArray) {
                let cumulativeVote = 0;
                voteArray.forEach(vote => {
                    if (vote.upVote) cumulativeVote += vote.createdBy.accruedDonations;
                    else cumulativeVote -= vote.createdBy.accruedDonations;
                });
                return cumulativeVote;
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
                            accruedDonations
                            donations {
                                _id
                                dateCreated
                                amount
                                active
                                paid
                                accruing
                            }
                            opinions {
                                _id
                                dateCreated
                                slug
                                metaSlug
                                opinion
                                onModel
                                documentID
                                approved
                                censored
                                censoredBy
                                censoredCommentary
                                votes {
                                    _id
                                    dateCreated
                                    createdBy {
                                        _id
                                        username
                                        accruedDonations
                                    }
                                }
                            }
                            votes {
                                _id
                                dateCreated
                                slug
                                metaSlug
                                onModel
                                documentID
                                upVote
                            }
                            bulletPoints {
                                _id
                                dateCreated
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
                            resources {
                                _id
                                dateCreated
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
                            rhetoric {
                                _id
                                dateCreated
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
                        }
                    }
                `
            },
            unapprovedRhetoric: {
                query: gql `query unapprovedRhetoric {
                    unapprovedRhetoric {
                        _id
                        dateCreated
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
                skip() {
                    if (this.currentUser && this.currentUser.admin) return false;
                    else return true;
                }
            },
            unapprovedBulletPoints: {
                query: gql `query unapprovedBulletPoints {
                    unapprovedBulletPoints {
                        _id
                        dateCreated
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
                skip() {
                    if (this.currentUser && this.currentUser.admin) return false;
                    else return true;
                }
            },
            unapprovedResources: {
                query: gql `query unapprovedResources {
                    unapprovedResources {
                        _id
                        dateCreated
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
                skip() {
                    if (this.currentUser && this.currentUser.admin) return false;
                    else return true;
                }
            }
        }
    };
</script>