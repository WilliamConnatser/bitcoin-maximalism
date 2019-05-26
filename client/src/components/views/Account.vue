<template>
    <main class="container apollo-response">
        <Login v-if="!currentUser" />
        <div v-if="currentUser">
            <section>
                <div>
                    <h1 class="heading">account panel</h1>
                    <router-link to="/submit-donation"><button class="large-button">Add Influence</button></router-link>
                    <button @click="signoutUser" class="large-button">Signout</button>
                </div>
                <h2>
                    Influence: {{currentUser.accruedDonations | formatBitcoinAmount}}
                </h2>
                
                <div v-if="currentUser.maximalist === null || changeAllegiance" class="medium-margin-vertical">
                    
                    <div v-if="currentUser.maximalist === null">
                        You have not yet sworn allegiance to either faction. Your ancestors would be ashamed...
                    </div>
                    <div v-else>
                        So you think you're enlightened now, huh? Go ahead, change your allegiance below...
                    </div>
                    <button @click="setAllegiance(true)" :class="allegianceButtonStyle(true)">
                        Bitcoin Maximalist
                    </button>
                    <button @click="setAllegiance(false)" :class="allegianceButtonStyle(false)">
                        Multicoinist
                    </button>
                </div>
                <div v-else class="medium-margin-vertical">
                    Allegiance: {{getAllegiance}}
                    <br/>
                    <button @click="changeAllegiance = true" class="large-button">
                        Change Allegiance
                    </button>
                </div>

                <div class="medium-margin-vertical">
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
                <br/>
                <button @click="toggleHistoryTab('Project')" :class="tabButtonStyle('Project')">Projects</button>
            </div>
            <h2 v-if="$apollo.loading" class="loading">Loading...</h2>

            <div v-if="historyTab === 'Donation'" class="medium-margin">
                <AccountTab title="Donations" :objectArray="currentUser.donations" :currentUser="currentUser" />
            </div>

            <div v-if="historyTab === 'Opinion'" class="medium-margin">
                <AccountTab title="Opinions" :objectArray="currentUser.opinions" :currentUser="currentUser" />
            </div>

            <div v-if="historyTab === 'Vote'" class="medium-margin">
                <AccountTab title="Votes" :objectArray="currentUser.votes" :currentUser="currentUser" />
            </div>

            <div v-if="historyTab === 'Rhetoric'" class="medium-margin">
                <AccountTab title="Arguments" :objectArray="currentUser.rhetoric" :currentUser="currentUser" />
                <AccountTab v-if="currentUser.admin" title="Unapproved Arguments" :objectArray="unapprovedRhetoric" :currentUser="currentUser" />
            </div>

            <div v-if="historyTab === 'BulletPoint'" class="medium-margin">
                <AccountTab title="BulletPoints" :objectArray="currentUser.bulletPoints" :currentUser="currentUser" />
                <AccountTab v-if="currentUser.admin" title="Unapproved BulletPoint" :objectArray="unapprovedBulletPoints" :currentUser="currentUser" />
            </div>

            <div v-if="historyTab === 'Resource'" class="medium-margin">
                <AccountTab title="Resources" :objectArray="currentUser.resources" :currentUser="currentUser" />
                <AccountTab v-if="currentUser.admin" title="Unapproved Resources" :objectArray="unapprovedResources" :currentUser="currentUser" />
            </div>

            <div v-if="historyTab === 'Project'" class="medium-margin">
                <AccountTab title="Projects" :objectArray="currentUser.projects" :currentUser="currentUser" />
                <AccountTab v-if="currentUser.admin" title="Unapproved Projects" :objectArray="unapprovedProjects" :currentUser="currentUser" />
            </div>

            <div v-show="currentUser.admin">
                <h2>You so fancy! Look are you, Mr. Administrator...</h2>
            </div>
        </div>
    </main>
</template>

<script>
    import Login from '../auth/Login';
    import SocialIcons from '../utility/SocialIcons';
    import AccountTab from '../utility/AccountTab';
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
                unapprovedProjects: [],
                approved: null,
                approvalCommentary: [],
                historyTab: 'Donation',
                changeAllegiance: false
            }
        },
        created() {
            this.$apollo.queries.currentUser.refetch();
        },
        components: {
            Login,
            SocialIcons,
            AccountTab
        },
        computed: {
            refLink() {
                return `https://www.BitcoinMaximalism.com/?ref=${this.currentUser._id}`
            },
            getAllegiance() {
                if (this.currentUser.maximalist) {
                    return "Bitcoin Maximalist";
                } else {
                    return "Multicoinist";
                }
            }
        },
        methods: {
            signoutUser() {
                //Remove token in localStorage
                localStorage.setItem("token", "");
                //End Apollo Client Session
                apolloClient.resetStore();
            },
            toggleHistoryTab(tabName) {
                this.historyTab = tabName;
            },
            tabButtonStyle(tabName) {
                if (tabName === this.historyTab) return "small-button selected-button";
                else return "small-button";
            },
            allegianceButtonStyle(maximalist) {
                if(this.currentUser.maximalist === maximalist) {
                    return "large-button selected-button";
                } else {
                    return "large-button"
                }
            },
            validAllegiance(allegiance) {
                return typeof allegiance === 'boolean' ? true : false;
            },
            setAllegiance: async function(maximalist) {
                await this.$apollo.queries.currentUser.refetch();

                if (!this.currentUser) {
                    this.$toasted.global.log_in();

                } else if (!this.currentUser.emailVerified) {
                    this.$toasted.global.verify_email();

                } else if (this.validAllegiance(maximalist)) {
                    //GraphQL Mutation
                    this.$apollo.mutate({
                        mutation: gql `
                            mutation setAllegiance($maximalist: Boolean!) {
                                setAllegiance(maximalist: $maximalist)
                            }
                        `,
                        variables: {
                            maximalist
                        }
                    }).then(() => {
                        this.$apollo.queries.currentUser.refetch();
                        this.changeAllegiance = false;
                    }).catch(() => {
                        // Errors handled in apolloProvider.js (client-side) and resolverHelpers.js (server-side)
                    });
                }
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
                            maximalist
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
                                active
                                approved
                                approvedBy
                                dateApproved
                                approvalCommentary
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
                            projects {
                                _id
                                metaSlug
                                title
                                link
                                description
                                approved
                                dateApproved
                                approvalCommentary
                                approvedBy {
                                    _id
                                    username
                                }
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
            },
            unapprovedProjects: {
                query: gql `query unapprovedProjects {
                    unapprovedProjects {
                        _id
                        metaSlug
                        title
                        link
                        description
                        votes {
                            _id
                            upVote
                            createdBy {
                                _id
                                username
                                accruedDonations
                            }
                        }
                        donations {
                            paid
                            preBonusAmount
                        }
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