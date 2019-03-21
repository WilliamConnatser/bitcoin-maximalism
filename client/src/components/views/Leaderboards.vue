<template>
    <main class="container">
        <h1 class="heading">leaderboards</h1>

        <router-link to="/leaderboards"><button :class="filterButtonStyle(undefined)">All</button></router-link>
        <router-link to="/leaderboards/arguments"><button :class="filterButtonStyle('arguments')">Arguments</button>
        </router-link>
        <router-link to="/leaderboards/bulletpoints"><button
                :class="filterButtonStyle('bulletpoints')">Bulletpoints</button></router-link>
        <br />
        <router-link to="/leaderboards/resources"><button :class="filterButtonStyle('resources')">Resources</button>
        </router-link>
        <router-link to="/leaderboards/opinions"><button :class="filterButtonStyle('opinions')">Opinions</button>
        </router-link>
        <router-link to="/leaderboards/users"><button :class="filterButtonStyle('users')">Users</button></router-link>
        <br />
        <router-link to="/leaderboards/projects"><button :class="filterButtonStyle('projects')">Projects</button>
        </router-link>
        <router-link to="/leaderboards/allegiances"><button
                :class="filterButtonStyle('allegiances')">Allegiances</button></router-link>

        <h2 v-if="$apollo.loading" class="loading">Loading...</h2>

        <section v-if="!leaderboardsCategory || leaderboardsCategory === 'opinions'">
            <div v-if="recentOpinions" class="medium-margin">
                <h2>
                    Recent Opinions
                </h2>

                <ol v-for="opinion in recentOpinions" :key="opinion._id" class="list">
                    <ViewSingles :singleDocument="opinion" v-on:opinions-changed="refetchQueries('opinions')" />
                </ol>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Recent Opinions</span>
            </div>

            <div v-if="mostUpvotedOpinions" class="medium-margin">
                <h2>
                    Most Upvoted Opinions
                </h2>

                <ol v-for="opinion in mostUpvotedOpinions" :key="opinion._id" class="list">
                    <ViewSingles :singleDocument="opinion" v-on:opinions-changed="refetchQueries('opinions')" />
                </ol>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Upvoted Opinions</span>
            </div>

            <div v-if="mostDownvotedOpinions" class="medium-margin">
                <h2>
                    Most Downvoted Opinions
                </h2>

                <ol v-for="opinion in mostDownvotedOpinions" :key="opinion._id" class="list">
                    <ViewSingles :singleDocument="opinion" v-on:opinions-changed="refetchQueries('opinions')" />
                </ol>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Downvoted Opinions</span>
            </div>
        </section>

        <section v-if="!leaderboardsCategory || leaderboardsCategory === 'arguments'">
            <div v-if="mostUpvotedArguments" class="medium-margin">
                <h2>
                    Most Upvoted Arguments
                </h2>

                <div v-for="argument in mostUpvotedArguments" :key="argument._id">
                    <ViewSingles :singleDocument="argument" v-on:arguments-changed="refetchQueries('arguments')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Upvoted Arguments</span>
            </div>

            <div v-if="mostDownvotedArguments" class="medium-margin">
                <h2>
                    Most Downvoted Arguments
                </h2>

                <div v-for="argument in mostDownvotedArguments" :key="argument._id">
                    <ViewSingles :singleDocument="argument" v-on:arguments-changed="refetchQueries('arguments')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Downvoted Arguments</span>
            </div>

            <div v-if="mostOpinionatedArguments" class="medium-margin">
                <h2>
                    Most Opinionated Arguments
                </h2>

                <div v-for="argument in mostOpinionatedArguments" :key="argument._id">
                    <ViewSingles :singleDocument="argument" v-on:arguments-changed="refetchQueries('arguments')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Opinionated Arguments</span>
            </div>

            <div v-if="leastOpinionatedArguments" class="medium-margin">
                <h2>
                    Least Opinionated Arguments
                </h2>

                <div v-for="argument in leastOpinionatedArguments" :key="argument._id">
                    <ViewSingles :singleDocument="argument" v-on:arguments-changed="refetchQueries('arguments')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Least Opinionated Arguments</span>
            </div>
        </section>

        <section v-if="!leaderboardsCategory || leaderboardsCategory === 'bulletpoints'">
            <div v-if="mostUpvotedBulletPoints" class="medium-margin">
                <h2>
                    Most Upvoted BulletPoints
                </h2>

                <div v-for="bulletPoint in mostUpvotedBulletPoints" :key="bulletPoint._id">
                    <ViewSingles :singleDocument="bulletPoint"
                        v-on:bulletpoints-changed="refetchQueries('bulletpoints')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Upvoted BulletPoints</span>
            </div>

            <div v-if="mostDownvotedBulletPoints" class="medium-margin">
                <h2>
                    Most Downvoted BulletPoints
                </h2>

                <div v-for="bulletPoint in mostDownvotedBulletPoints" :key="bulletPoint._id">
                    <ViewSingles :singleDocument="bulletPoint"
                        v-on:bulletpoints-changed="refetchQueries('bulletpoints')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Downvoted BulletPoints</span>
            </div>

            <div v-if="mostOpinionatedBulletPoints" class="medium-margin">
                <h2>
                    Most Opinionated BulletPoints
                </h2>

                <div v-for="bulletPoint in mostOpinionatedBulletPoints" :key="bulletPoint._id">
                    <ViewSingles :singleDocument="bulletPoint"
                        v-on:bulletpoints-changed="refetchQueries('bulletpoints')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Opinionated BulletPoints</span>
            </div>

            <div v-if="leastOpinionatedBulletPoints" class="medium-margin">
                <h2>
                    Least Opinionated BulletPoints
                </h2>

                <div v-for="bulletPoint in leastOpinionatedBulletPoints" :key="bulletPoint._id">
                    <ViewSingles :singleDocument="bulletPoint"
                        v-on:bulletpoints-changed="refetchQueries('bulletpoints')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Least Opinionated BulletPoints</span>
            </div>
        </section>

        <section v-if="!leaderboardsCategory || leaderboardsCategory === 'resources'">
            <div v-if="mostUpvotedResources" class="medium-margin">
                <h2>
                    Most Upvoted Resources
                </h2>

                <div v-for="resource in mostUpvotedResources" :key="resource._id">
                    <ViewSingles :singleDocument="resource" v-on:resources-changed="refetchQueries('resources')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Upvoted Resources</span>
            </div>

            <div v-if="mostDownvotedResources" class="medium-margin">
                <h2>
                    Most Downvoted Resources
                </h2>

                <div v-for="resource in mostDownvotedResources" :key="resource._id">
                    <ViewSingles :singleDocument="resource" v-on:resources-changed="refetchQueries('resources')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Downvoted Resources</span>
            </div>

            <div v-if="mostOpinionatedResources" class="medium-margin">
                <h2>
                    Most Opinionated Resources
                </h2>

                <div v-for="resource in mostOpinionatedResources" :key="resource._id">
                    <ViewSingles :singleDocument="resource" v-on:resources-changed="refetchQueries('resources')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Opinionated Resources</span>
            </div>

            <div v-if="leastOpinionatedResources" class="medium-margin">
                <h2>
                    Least Opinionated Resources
                </h2>

                <div v-for="resource in leastOpinionatedResources" :key="resource._id">
                    <ViewSingles :singleDocument="resource" v-on:resources-changed="refetchQueries('resources')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Least Opinionated Resources</span>
            </div>
        </section>

        <section v-if="!leaderboardsCategory || leaderboardsCategory === 'users'">
            <div v-if="mostInfluentialUsers" class="medium-margin">
                <h2>
                    Most Influential Users
                </h2>

                <ul class="list">
                    <li v-for="user in mostInfluentialUsers" :key="user._id" class="ordered-list">
                        {{user.username}} - {{user.accruedDonations | formatBitcoinAmount}}
                    </li>
                </ul>
            </div>

            <div v-if="mostReferrals" class="medium-margin">
                <h2>
                    Most User Referrals
                </h2>

                <ul class="list">
                    <li v-for="user in mostReferrals" :key="user._id" class="ordered-list">
                        {{user.username}} - {{user.referralAmount}} Referrals
                    </li>
                </ul>
            </div>

            <div v-if="mostReferralInfluence" class="medium-margin">
                <h2>
                    Most Referral Influence
                </h2>

                <ul class="list">
                    <li v-for="user in mostReferralInfluence.slice(0,5)" :key="user._id" class="ordered-list">
                        {{user.username}} - {{user.referralInfluence | formatBitcoinAmount}}
                    </li>
                </ul>
            </div>
        </section>

        <section v-if="!leaderboardsCategory || leaderboardsCategory === 'projects'">
            <div v-if="mostDonatedProjects" class="medium-margin">
                <h2>
                    Most Donated Projects
                </h2>

                <div v-for="project in mostDonatedProjects" :key="project._id">
                    <ViewSingles :singleDocument="project" v-on:projects-changed="refetchQueries('projects')" />
                </div>
            </div>
            <div v-if="mostUpvotedProjects" class="medium-margin">
                <h2>
                    Most Upvoted Projects
                </h2>

                <div v-for="project in mostUpvotedProjects" :key="project._id">
                    <ViewSingles :singleDocument="project" v-on:projects-changed="refetchQueries('projects')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Upvoted Projects</span>
            </div>

            <div v-if="mostDownvotedProjects" class="medium-margin">
                <h2>
                    Most Downvoted Projects
                </h2>

                <div v-for="project in mostDownvotedProjects" :key="project._id">
                    <ViewSingles :singleDocument="project" v-on:projects-changed="refetchQueries('projects')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Downvoted Projects</span>
            </div>

            <div v-if="mostOpinionatedProjects" class="medium-margin">
                <h2>
                    Most Opinionated Projects
                </h2>

                <div v-for="project in mostOpinionatedProjects" :key="project._id">
                    <ViewSingles :singleDocument="project" v-on:projects-changed="refetchQueries('projects')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Opinionated Projects</span>
            </div>

            <div v-if="leastOpinionatedProjects" class="medium-margin">
                <h2>
                    Least Opinionated Projects
                </h2>

                <div v-for="project in leastOpinionatedProjects" :key="project._id">
                    <ViewSingles :singleDocument="project" v-on:projects-changed="refetchQueries('projects')" />
                </div>
            </div>
            <div v-else-if="!$apollo.loading">
                <span>No Least Opinionated Projects</span>
            </div>
        </section>
    </main>
</template>

<script>
    import gql from 'graphql-tag';
    import ViewSingles from '../utility/ViewSingles';

    export default {
        name: "leaderboards",
        components: {
            ViewSingles
        },
        data: () => {
            return {
                recentOpinions: null,
                mostUpvotedOpinions: null,
                mostDownvotedOpinions: null,

                mostUpvotedArguments: null,
                mostDownvotedArguments: null,
                mostOpinionatedArguments: null,
                leastOpinionatedArguments: null,

                mostUpvotedBulletPoints: null,
                mostDownvotedBulletPoints: null,
                mostOpinionatedBulletPoints: null,
                leastOpinionatedBulletPoints: null,

                mostUpvotedResources: null,
                mostDownvotedResources: null,
                mostOpinionatedResources: null,
                leastOpinionatedResources: null,

                mostDonatedProjects: null,
                mostUpvotedProjects: null,
                mostDownvotedProjects: null,
                mostOpinionatedProjects: null,
                leastOpinionatedProjects: null,

                mostInfluentialUsers: null,
                mostReferrals: null,
                mostReferralInfluence: null
            }
        },
        computed: {
            leaderboardsCategory() {
                let leaderboardsCategory = this.$route.params.leaderboardsCategory;

                if (leaderboardsCategory) {
                    if (leaderboardsCategory !== 'arguments' &&
                        leaderboardsCategory !== 'opinions' &&
                        leaderboardsCategory !== 'bulletpoints' &&
                        leaderboardsCategory !== 'resources' &&
                        leaderboardsCategory !== 'users' &&
                        leaderboardsCategory !== 'projects' &&
                        leaderboardsCategory !== 'allegiances') {
                        this.forwardTo404();
                    }
                }

                return leaderboardsCategory;
            }
        },
        methods: {
            filterButtonStyle(leaderboardsCategory) {
                if (leaderboardsCategory === this.leaderboardsCategory) {
                    return "small-button selected-button";
                } else {
                    return "small-button";
                }
            },
            forwardTo404() {
                this.$router.push({
                    path: '/not-found'
                });
            },
            refetchQueries(category) {

                switch (category) {
                    case 'opinions':
                        this.$apollo.queries.recentOpinions.refetch();
                        this.$apollo.queries.mostUpvotedOpinions.refetch();
                        this.$apollo.queries.mostDownvotedOpinions.refetch();
                        break;
                    case 'arguments':
                        this.$apollo.queries.mostUpvotedArguments.refetch();
                        this.$apollo.queries.mostDownvotedArguments.refetch();
                        this.$apollo.queries.mostOpinionatedArguments.refetch();
                        this.$apollo.queries.leastOpinionatedArguments.refetch();
                        break;
                    case 'bulletpoints':
                        this.$apollo.queries.mostUpvotedBulletPoints.refetch();
                        this.$apollo.queries.mostDownvotedBulletPoints.refetch();
                        this.$apollo.queries.mostOpinionatedBulletPoints.refetch();
                        this.$apollo.queries.leastOpinionatedBulletPoints.refetch();
                        break;
                    case 'resources':
                        this.$apollo.queries.mostUpvotedResources.refetch();
                        this.$apollo.queries.mostDownvotedResources.refetch();
                        this.$apollo.queries.mostOpinionatedResources.refetch();
                        this.$apollo.queries.leastOpinionatedResources.refetch();
                        break;
                    case 'projects':
                        this.$apollo.queries.mostDonatedProjects.refetch();
                        this.$apollo.queries.mostUpvotedProjects.refetch();
                        this.$apollo.queries.mostDownvotedProjects.refetch();
                        this.$apollo.queries.mostOpinionatedProjects.refetch();
                        this.$apollo.queries.leastOpinionatedProjects.refetch();
                        break;
                }

            }
        },
        apollo: {
            recentOpinions: {
                query: gql `
                    query recentOpinions($limit: Int!) {
                        recentOpinions(limit:$limit) {
                            _id
                            createdBy {
                                _id
                                username
                            }
                            metaSlug
                            slug
                            opinion
                            onModel
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                    }
                `,
                variables: {
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'opinions' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostUpvotedOpinions: {
                query: gql `
                    query mostUpvotedOpinions($descending: Boolean!, $limit: Int!) {
                        topOpinions(descending: $descending, limit: $limit) {
                            _id
                            createdBy {
                                _id
                                username
                            }
                            metaSlug
                            slug
                            opinion
                            onModel
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                    }
                `,
                update: data => (data.topOpinions),
                variables: {
                    descending: true,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'opinions' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostDownvotedOpinions: {
                query: gql `
                    query mostDownvotedOpinions($descending: Boolean!, $limit: Int!) {
                        topOpinions(descending: $descending, limit: $limit) {
                            _id
                            createdBy {
                                _id
                                username
                            }
                            metaSlug
                            slug
                            opinion
                            onModel
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                    }
                `,
                update: data => (data.topOpinions),
                variables: {
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'opinions' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostUpvotedArguments: {
                query: gql `
                    query mostUpvotedArguments($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topArguments(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            title
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                    }
                `,
                update: data => (data.topArguments),
                variables: {
                    onModel: 'Vote',
                    descending: true,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'arguments' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostDownvotedArguments: {
                query: gql `
                    query mostDownvotedArguments($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topArguments(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            title
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                    }
                `,
                update: data => (data.topArguments),
                variables: {
                    onModel: 'Vote',
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'arguments' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostOpinionatedArguments: {
                query: gql `
                    query mostOpinionatedArguments($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topArguments(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            title
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                    }
                `,
                update: data => (data.topArguments),
                variables: {
                    onModel: 'Opinion',
                    descending: true,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'arguments' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            leastOpinionatedArguments: {
                query: gql `
                    query leastOpinionatedArguments($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topArguments(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            title
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                    }
                `,
                update: data => (data.topArguments),
                variables: {
                    onModel: 'Opinion',
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'arguments' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostUpvotedBulletPoints: {
                query: gql `
                    query mostUpvotedBulletPoints($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topBulletPoints(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            content
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                    }
                `,
                update: data => (data.topBulletPoints),
                variables: {
                    onModel: 'Vote',
                    descending: true,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'bulletpoints' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostDownvotedBulletPoints: {
                query: gql `
                    query mostDownvotedBulletPoints($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topBulletPoints(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            content
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                    }
                `,
                update: data => (data.topBulletPoints),
                variables: {
                    onModel: 'Vote',
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'bulletpoints' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostOpinionatedBulletPoints: {
                query: gql `
                    query mostOpinionatedBulletPoints($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topBulletPoints(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            content
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }                    
                    }
                `,
                update: data => (data.topBulletPoints),
                variables: {
                    onModel: 'Opinion',
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'bulletpoints' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            leastOpinionatedBulletPoints: {
                query: gql `
                    query leastOpinionatedBulletPoints($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topBulletPoints(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            content
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                    }
                `,
                update: data => (data.topBulletPoints),
                variables: {
                    onModel: 'Opinion',
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'bulletpoints' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostUpvotedResources: {
                query: gql `
                    query mostUpvotedResources($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topResources(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            title
                            link
                            media
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                    }
                `,
                update: data => (data.topResources),
                variables: {
                    onModel: 'Vote',
                    descending: true,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'resources' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostDownvotedResources: {
                query: gql `
                    query mostDownvotedResources($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topResources(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            title
                            link
                            media
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                }`,
                update: data => (data.topResources),
                variables: {
                    onModel: 'Vote',
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'resources' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostOpinionatedResources: {
                query: gql `
                    query mostOpinionatedResources($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topResources(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            title
                            link
                            media
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                }`,
                update: data => (data.topResources),
                variables: {
                    onModel: 'Opinion',
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'resources' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            leastOpinionatedResources: {
                query: gql `
                    query leastOpinionatedResources($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topResources(onModel: $onModel, descending: $descending, limit:$limit) {
                            _id
                            title
                            link
                            media
                            metaSlug
                            slug
                            opinions {
                                _id
                            }
                            votes {
                                upVote
                                createdBy {
                                    _id
                                    accruedDonations
                                }
                            }
                        }
                }`,
                update: data => (data.topResources),
                variables: {
                    onModel: 'Opinion',
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'resources' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostInfluentialUsers: {
                query: gql `
                    query mostInfluentialUsers($limit: Int!) {
                        mostInfluentialUsers(limit:$limit) {
                            _id
                            username
                            accruedDonations
                        }
                    }
                `,
                variables: {
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'users' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostReferrals: {
                query: gql `
                    query mostReferrals($limit: Int!) {
                        mostReferrals(limit: $limit) {
                            _id
                            username
                            referralAmount
                        }
                    }
                `,
                variables: {
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'users' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostReferralInfluence: {
                query: gql `
                    query mostReferralInfluence($limit: Int!) {
                        mostReferralInfluence(limit: $limit) {
                            _id
                            username
                            referralInfluence
                        }
                    }
                `,
                variables: {
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'users' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostDonatedProjects: {
                query: gql `
                    query mostDonatedProjects($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topProjects(onModel: $onModel, descending: $descending, limit:$limit) {
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
                                preBonusAmount
                            }
                        }
                    }
                `,
                update: data => (data.topProjects),
                variables: {
                    onModel: 'Donation',
                    descending: true,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'projects' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostUpvotedProjects: {
                query: gql `
                    query mostUpvotedProjects($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topProjects(onModel: $onModel, descending: $descending, limit:$limit) {
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
                                preBonusAmount
                            }
                        }
                    }
                `,
                update: data => (data.topProjects),
                variables: {
                    onModel: 'Vote',
                    descending: true,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'projects' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostDownvotedProjects: {
                query: gql `
                    query mostDownvotedProjects($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topProjects(onModel: $onModel, descending: $descending, limit:$limit) {
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
                                preBonusAmount
                            }
                        }
                }`,
                update: data => (data.topProjects),
                variables: {
                    onModel: 'Vote',
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'projects' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostOpinionatedProjects: {
                query: gql `
                    query mostOpinionatedProjects($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topProjects(onModel: $onModel, descending: $descending, limit:$limit) {
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
                                preBonusAmount
                            }
                        }
                }`,
                update: data => (data.topProjects),
                variables: {
                    onModel: 'Opinion',
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'projects' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            leastOpinionatedProjects: {
                query: gql `
                    query leastOpinionatedProjects($onModel:String!, $descending: Boolean!, $limit:Int!) {
                        topProjects(onModel: $onModel, descending: $descending, limit:$limit) {
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
                                preBonusAmount
                            }
                        }
                }`,
                update: data => (data.topProjects),
                variables: {
                    onModel: 'Opinion',
                    descending: false,
                    limit: 5
                },
                skip() {
                    if (this.leaderboardsCategory !== 'projects' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    };
</script>