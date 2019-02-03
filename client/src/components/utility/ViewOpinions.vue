<template>
<div class="normal-text">
    <h1 v-if="$apollo.loading">Loading...</h1>
    <ul v-if="docIDSpecificOpinions && docIDSpecificOpinions[0]" class="opinions">
        <button class="opinions-sort-button">Sort by Votes</button>
        <button class="opinions-sort-button">Sort By Date</button>
        <button class="opinions-sort-button">Random Sort</button>
        <li v-for="(opinion, _id) in docIDSpecificOpinions" class="opinion" :key="_id">
            <div>
                {{opinion.dateCreated | formatDate }}
                <strong class="opinion-username">{{opinion.createdBy.username}}</strong>
            </div>
            <div>
                {{opinion.opinion}}
            </div>
        </li>
    </ul>
    <span class="block" v-if="!$apollo.loading && (!docIDSpecificOpinions || !docIDSpecificOpinions[0])">
        No one's commented on this yet...
    </span>
</div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "ViewOpinions",
        props: {
            arrayItemProp: Object,
            metaSlug: String
        },
        data() {
            return {
                currentUser: null,
                viewOpinions: null,
                viewEdits: null,
                topLastRandomOpinions: null
            }
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
            title(index) {
                if(index === 0) return "top";
                if(index === 1) return "last";
                if(index === 2) return "random";
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
                            username
                        }                      
                        opinion
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
                }`,
                variables() {
                    return {
                        _id: this.arrayItemProp._id,
                        onModel: this.arrayItemProp.__typename,
                        sortType: 'votes',
                        sortDirection: 'descending',
                        index: 0
                    }
                }
            }
        }
    };
</script>