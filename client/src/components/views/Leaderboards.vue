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
        <section v-if="!leaderboardsCategory || leaderboardsCategory === 'allegiances'">
            <div v-if="mostRaised" class="medium-margin">
                <h2>
                    Bitcoin Raised
                </h2>
                (for open source projects)
                <pie-chart :data="chartData(mostRaised)" :colors="['#41b883', '#fdfdfd']"></pie-chart>
                <strong>{{mostRaised[0].allegiance}}: </strong> {{mostRaised[0].amount | formatBitcoinAmount}} satoshis
                <br />
                <strong>{{mostRaised[1].allegiance}}: </strong> {{mostRaised[1].amount | formatBitcoinAmount}} satoshis
                <br />
            </div>
            <div v-if="mostInfluence" class="medium-margin">
                <h2>
                    Most Influence Acquired
                </h2>
                (total donated)
                <pie-chart :data="chartData(mostInfluence)" :colors="['#41b883', '#fdfdfd']"></pie-chart>
                <strong>{{mostInfluence[0].allegiance}}: </strong> {{mostInfluence[0].amount | formatBitcoinAmount}} satoshis
                <br />
                <strong>{{mostInfluence[1].allegiance}}: </strong> {{mostInfluence[1].amount | formatBitcoinAmount}} satoshis
                <br />
            </div>
            <div v-if="mostUpvotes" class="medium-margin">
                <h2>
                    Most Influence Upvoted
                </h2>
                (includes upvotes on arguments, bulletpoints, resources, projects, and opinions)
                <pie-chart :data="chartData(mostUpvotes)" :colors="['#41b883', '#fdfdfd']"></pie-chart>
                <strong>{{mostUpvotes[0].allegiance}}: </strong> {{mostUpvotes[0].amount | formatBitcoinAmount}} satoshis
                <br />
                <strong>{{mostUpvotes[1].allegiance}}: </strong> {{mostUpvotes[1].amount | formatBitcoinAmount}} satoshis
                <br />
            </div>
            <div v-if="mostOpinions" class="medium-margin">
                <h2>
                    Most Opinions
                </h2>
                (includes upvotes on arguments, bulletpoints, resources, and projects)
                <pie-chart :data="chartData(mostOpinions)" :colors="['#41b883', '#fdfdfd']"></pie-chart>
                <strong>{{mostOpinions[0].allegiance}}: </strong> {{mostOpinions[0].amount}} opinions
                <br />
                <strong>{{mostOpinions[1].allegiance}}: </strong> {{mostOpinions[1].amount}} opinions
                <br />
            </div>
            <div v-if="mostUsers" class="medium-margin">
                <h2>
                    Most Users
                </h2>
                (number of users)
                <pie-chart :data="chartData(mostUsers)" :colors="['#41b883', '#fdfdfd']"></pie-chart>
                <strong>{{mostUsers[0].allegiance}}: </strong> {{mostUsers[0].amount}} users
                <br />
                <strong>{{mostUsers[1].allegiance}}: </strong> {{mostUsers[1].amount}} users
                <br />
            </div>
            <div v-if="mostArguments" class="medium-margin">
                <h2>
                    Most Arguments
                </h2>
                (number of arguments)
                <pie-chart :data="chartData(mostArguments)" :colors="['#41b883', '#fdfdfd']"></pie-chart>
                <strong>{{mostArguments[0].allegiance}}: </strong> {{mostArguments[0].amount}} arguments
                <br />
                <strong>{{mostArguments[1].allegiance}}: </strong> {{mostArguments[1].amount}} arguments
                <br />
            </div>
            <div v-if="mostResources" class="medium-margin">
                <h2>
                    Most Resources
                </h2>
                (number of resources)
                <pie-chart :data="chartData(mostResources)" :colors="['#41b883', '#fdfdfd']"></pie-chart>
                <strong>{{mostResources[0].allegiance}}: </strong> {{mostResources[0].amount}} resources
                <br />
                <strong>{{mostResources[1].allegiance}}: </strong> {{mostResources[1].amount}} resources
                <br />
            </div>
            <div v-if="mostBulletPoints" class="medium-margin">
                <h2>
                    Most BulletPoints
                </h2>
                (number of bulletpoints)
                <pie-chart :data="chartData(mostBulletPoints)" :colors="['#41b883', '#fdfdfd']"></pie-chart>
                <strong>{{mostBulletPoints[0].allegiance}}: </strong> {{mostBulletPoints[0].amount}} bulletpoints
                <br />
                <strong>{{mostBulletPoints[1].allegiance}}: </strong> {{mostBulletPoints[1].amount}} bulletpoints
                <br />
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
                mostReferralInfluence: null,

                mostRaised: null,
                mostInfluence: null,
                mostUpvotes: null,
                mostOpinions: null,
                mostUsers: null,
                mostArguments: null,
                mostResources: null,
                mostBullePoints: null
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
                    case 'allegiances':
                        this.$apollo.queries.mostRaised.refetch();
                        this.$apollo.queries.mostInfluence.refetch();
                        this.$apollo.queries.mostUpvotes.refetch();
                        this.$apollo.queries.mostOpinions.refetch();
                        this.$apollo.queries.mostUsers.refetch();
                        this.$apollo.queries.mostArguments.refetch();
                        this.$apollo.queries.mostResources.refetch();
                        this.$apollo.queries.mostBullePoints.refetch();
                        break;
                }
            },
            chartData(queryResponse, analyze) {

                const parsedResponse = queryResponse.map(function (allegiance) {

                    const total = queryResponse.reduce((previous, current) => {
                        //If the the amount is votes, then the vote tally may be negative
                        //This would call division of 0 below, leaving only one amount of 0 being sent into the pie chart
                        //Whereas in reality the number represents 100% (or 1 in numerical form) of the votes
                        //So don't don't include negative amounts in the total
                        if (current.amount >= 0) return previous + current.amount;
                        else return previous;
                    }, 0);

                    //console.log("total", total, "amount", allegiance.amount)
                    //If both amounts are 0, then division by 0 would occur below
                    //When in actuality both amounts equal 50% (or .5 in numerical form) of the total.
                    if (total === 0 && allegiance.amount === 0) return [allegiance.allegiance, .5]
                    //If the amount is negative, then return an empty array
                    //The empy array is removed from the outer array using .filter() below
                    //You can't represent negative amounts on a Pie Chart
                    else if (allegiance.amount <= 0) return [];

                    else return [allegiance.allegiance, (allegiance.amount / total).toFixed(2)];
                }).filter(arrayItem => arrayItem.length > 0);

                return parsedResponse;
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
            },
            mostRaised: {
                query: gql `
                    query mostRaised($type:String!) {
                        topAllegiances(type: $type) {
                            allegiance
                            amount
                        }
                }`,
                update: data => (data.topAllegiances),
                variables: {
                    type: 'mostRaised',
                },
                skip() {
                    if (this.leaderboardsCategory !== 'allegiances' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostInfluence: {
                query: gql `
                    query mostInfluence($type:String!) {
                        topAllegiances(type: $type) {
                            allegiance
                            amount
                        }
                }`,
                update: data => (data.topAllegiances),
                variables: {
                    type: 'mostInfluence',
                },
                skip() {
                    if (this.leaderboardsCategory !== 'allegiances' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostUpvotes: {
                query: gql `
                    query mostUpvotes($type:String!) {
                        topAllegiances(type: $type) {
                            allegiance
                            amount
                        }
                }`,
                update: data => (data.topAllegiances),
                variables: {
                    type: 'mostUpvotes',
                },
                skip() {
                    if (this.leaderboardsCategory !== 'allegiances' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostOpinions: {
                query: gql `
                    query mostOpinions($type:String!) {
                        topAllegiances(type: $type) {
                            allegiance
                            amount
                        }
                }`,
                update: data => (data.topAllegiances),
                variables: {
                    type: 'mostOpinions',
                },
                skip() {
                    if (this.leaderboardsCategory !== 'allegiances' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostUsers: {
                query: gql `
                    query mostUsers($type:String!) {
                        topAllegiances(type: $type) {
                            allegiance
                            amount
                        }
                }`,
                update: data => (data.topAllegiances),
                variables: {
                    type: 'mostUsers',
                },
                skip() {
                    if (this.leaderboardsCategory !== 'allegiances' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostArguments: {
                query: gql `
                    query mostArguments($type:String!) {
                        topAllegiances(type: $type) {
                            allegiance
                            amount
                        }
                }`,
                update: data => (data.topAllegiances),
                variables: {
                    type: 'mostArguments',
                },
                skip() {
                    if (this.leaderboardsCategory !== 'allegiances' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostResources: {
                query: gql `
                    query mostResources($type:String!) {
                        topAllegiances(type: $type) {
                            allegiance
                            amount
                        }
                }`,
                update: data => (data.topAllegiances),
                variables: {
                    type: 'mostResources',
                },
                skip() {
                    if (this.leaderboardsCategory !== 'allegiances' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            mostBulletPoints: {
                query: gql `
                    query mostBulletPoints($type:String!) {
                        topAllegiances(type: $type) {
                            allegiance
                            amount
                        }
                }`,
                update: data => (data.topAllegiances),
                variables: {
                    type: 'mostBulletPoints',
                },
                skip() {
                    if (this.leaderboardsCategory !== 'allegiances' && this.leaderboardsCategory) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    };
</script>