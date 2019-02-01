<template>
    <ul class="opinions">
        <h1 v-if="$apollo.loading">Loading...</h1>
        <li id="top" class="opinion">
            <div>
                <strong class="opinion-label">Last: </strong>
                <strong class="opinion-username">CoinHoarder</strong>
            </div>
            <div>
                0.05 BTC
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus labore consequatur explicabo
            repellat. Porro,
            aspernatur.
        </li>
        <li id="last" class="opinion">
            <div>
                <strong class="opinion-label">Second Last: </strong>
                <strong class="opinion-username">CoinHoarder</strong>
            </div>
            <div>
                0.0000000001 BTC
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit facere sit nobis quae veniam
            debitis?
        </li>
        <li id="random" class="opinion">
            <div>
                <strong class="opinion-label">Third Last: </strong>
                <strong class="opinion-username">CoinHoarder</strong>
            </div>
            <div>
                0.00000001 BTC
            </div>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab nemo libero voluptas minima at vel.
        </li>
    </ul>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "ViewEdits",
        props: {
            arrayItemProp: Object,
            metaSlug: String
        },
        data() {
            return {
                currentUser: null,
                viewOpinions: null,
                viewEdits: null
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