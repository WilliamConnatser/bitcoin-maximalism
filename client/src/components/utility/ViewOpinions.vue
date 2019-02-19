<template>
    <div >
        <a class="cursor-pointer">
            <button @click="toggleSort('votes')" class="small-button">
                Votes
                <font-awesome-icon v-if="sortType==='votes' && sortDirection==='descending'" icon="sort-amount-down" title="Descending" />
                <font-awesome-icon v-if="sortType==='votes' && sortDirection==='ascending'" icon="sort-amount-up" title="Ascending" />
            </button>
        </a>
        <a class="cursor-pointer">
            <button @click="toggleSort('dateCreated')" class="small-button">
                Date
                <font-awesome-icon v-if="sortType==='dateCreated' && sortDirection==='descending'" icon="sort-amount-down"
                    title="Descending" />
                <font-awesome-icon v-if="sortType==='dateCreated' && sortDirection==='ascending'" icon="sort-amount-up"
                    title="Ascending" />
            </button>
        </a>

        <h2 v-if="$apollo.loading" class="loading">Loading...</h2>

        <ul v-if="docIDSpecificOpinions && docIDSpecificOpinions[0]">
            <li v-for="(opinion, forLoopIndex) in docIDSpecificOpinions" :key="forLoopIndex" class="opinion">
                <div>
                    <ToolbarVotes :arrayItemProp="opinion" v-on:update-view-opinion-query="updateOpinions" />
                    <strong class="uppercase">{{opinion.createdBy.username}}</strong>
                    {{opinion.dateCreated | formatDate }}
                </div>
                <div>
                    {{opinion.opinion}}
                </div>
                <hr v-if="docIDSpecificOpinions.length-1!==forLoopIndex">
            </li>
            <a class="pointer-cursor">
                <button @click="loadMore()" v-if="docIDSpecificOpinionCount>index+10" class="medium-margin">Load More
                    Opinions
                </button>
            </a>
        </ul>
        <div class="medium-margin" v-if="!$apollo.loading && (!docIDSpecificOpinions || !docIDSpecificOpinions[0])">
            No one's commented on this yet...
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag';
    import ToolbarVotes from './ToolbarVotes';

    export default {
        name: "ViewOpinions",
        props: {
            arrayItemProp: Object
        },
        components: {
            ToolbarVotes
        },
        data() {
            return {
                currentUser: null,
                viewOpinions: null,
                viewEdits: null,
                docIDSpecificOpinions: null,
                docIDSpecificOpinionCount: null,
                sortType: 'votes',
                sortDirection: 'descending',
                index: 0
            }
        },
        created() {
            this.$apollo.queries.docIDSpecificOpinions.refetch();
            this.$apollo.queries.docIDSpecificOpinionCount.refetch();
        },
        methods: {
            cancel(actionType) {
                this[actionType] = null;
            },
            show(actionType) {
                this[actionType] = true;
            },
            initialize(actionType) {
                this.currentUser ? this[actionType] = true : this.$toasted.global.log_in();
            },
            toggleSort(buttonClicked) {
                if (buttonClicked === this.sortType) {
                    if (this.sortDirection === 'descending') {
                        this.sortDirection = 'ascending';
                    } else {
                        this.sortDirection = 'descending';
                    }
                } else {
                    if (this.sortType === 'votes') {
                        this.sortType = 'dateCreated';
                        this.sortDirection = 'descending';
                    } else {
                        this.sortType = 'votes';
                        this.sortDirection = 'descending';
                    }
                }
            },
            loadMore() {
                this.index += 10;
            },
            updateOpinions() {
                this.$apollo.queries.docIDSpecificOpinions.refetch();
                this.$apollo.queries.docIDSpecificOpinionCount.refetch();
            }
        },
        computed: {
            opinionArray() {
                return this.topLastRandomOpinions;
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
            docIDSpecificOpinions: {
                query: gql `query docIDSpecificOpinions ($_id: String!, $onModel: String!, $sortType: String!, $sortDirection: String, $index: Int!) {
                    docIDSpecificOpinions(_id: $_id, onModel: $onModel, sortType: $sortType, sortDirection: $sortDirection, index: $index) {
                        _id
                        dateCreated
                        createdBy {
                            _id
                            username
                        }
                        opinion
                        votes {
                            upVote
                            createdBy {
                                _id
                                username
                                accruedDonations
                            }
                        }
                    }
                }`,
                variables() {
                    return {
                        _id: this.arrayItemProp._id,
                        onModel: this.arrayItemProp.__typename,
                        sortType: this.sortType,
                        sortDirection: this.sortDirection,
                        index: this.index
                    }
                }
            },
            docIDSpecificOpinionCount: {
                query: gql `query docIDSpecificOpinionCount($onModel: String!, $_id: ID!) {
                        docIDSpecificOpinionCount(onModel:$onModel, _id: $_id)
                    }
                `,
                variables() {
                    return {
                        onModel: this.arrayItemProp.__typename,
                        _id: this.arrayItemProp._id
                    }
                }
            }
        }
    };
</script>