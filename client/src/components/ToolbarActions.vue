<template>
    <div>
        <div class="toolbar--actions">
            <font-awesome-icon @click="show('viewOpinions')" icon="comment" title="View Opinions" />
            <font-awesome-icon @click="show('viewEdits')" icon="pen-square" title="View Edits" />
        </div>

        <div v-if="this.viewOpinions !== null">
            <button @click="cancel('viewOpinions')">Hide Opinions</button>
            <button @click="cancel('opinion')">Submit Opinion</button>

            <ul class="opinions">
                <li id="top" class="opinion">
                    <div>
                        <strong class="opinion-label">Top: </strong>
                        <strong class="opinion-username">CoinHoarder</strong>
                    </div>
                    <div>
                        ($100 - 0.05 BTC)
                    </div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus labore consequatur explicabo
                    repellat. Porro,
                    aspernatur.
                </li>
                <li id="last" class="opinion">
                    <div>
                        <strong class="opinion-label">Last: </strong>
                        <strong class="opinion-username">CoinHoarder</strong>
                    </div>
                    <div>
                        ($0.10 - 0.0000000001 BTC)
                    </div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit facere sit nobis quae veniam
                    debitis?
                </li>
                <li id="random" class="opinion">
                    <div>
                        <strong class="opinion-label">Random: </strong>
                        <strong class="opinion-username">CoinHoarder</strong>
                    </div>
                    <div>
                        ($2.00 - 0.00000001 BTC)
                    </div>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab nemo libero voluptas minima at vel.
                </li>
            </ul>
        </div>

        <div v-if="this.viewEdits !== null">
            <h2>Suggest an Edit</h2>
            <button @click="cancel('viewEdits')">Hide Edits</button>
            <button @click="cancel('edit')">Submit Edit</button>

            <ul class="opinions">
                <li id="top" class="opinion">
                    <div>
                        <strong class="opinion-label">Last: </strong>
                        <strong class="opinion-username">CoinHoarder</strong>
                    </div>
                    <div>
                        ($100 - 0.05 BTC)
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
                        ($0.10 - 0.0000000001 BTC)
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
                        ($2.00 - 0.00000001 BTC)
                    </div>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab nemo libero voluptas minima at vel.
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "ToolbarActions",
        props: {
            arrayItemProp: Object,
            metaSlug: String
        },
        data() {
            return {
                getCurrentUser: null,
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
                this.getCurrentUser ? this[actionType] = true : this.$toasted.global.log_in();
            }
        },
        apollo: {
            getCurrentUser: {
                query: gql `
                    query getCurrentUser {
                        getCurrentUser {
                            _id
                            username
                            email
                            emailValidated
                            active
                            admin
                            allegiance
                            maximalist
                        }
                    }
                `
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../sass/variables.scss";

    .toolbar--actions {
        &>* {
            font-size: 2.5rem;
            font-weight: 400;
            margin: 1rem 2rem;
        }
    }

    input {
        display: inline-block;
        width: 75vw;
        height: 4rem;
        font-size: 1.5rem;
        border: 0.1rem solid $color-white;
    }

    label {
        text-align: center;
        color: $color-white;
        display: inline-block;
        width: 80vw;
        font-size: 1.9rem;
        font-weight: 200;
    }

    button {
        color: $color-white;
        background-color: $color-green;
        font-size: 1.5rem;
        width: 40vw;
        height: 4rem;
        padding: .5rem;
        border: 0.1rem solid $color-white;
    }

    .block {
        margin: 3rem;
    }

    .opinions {
        list-style-type: none;

        .opinion {
        margin: 1rem;
        padding: 1rem;

            .opinion-label {
                text-transform: uppercase;
            }
        }
    }
</style>