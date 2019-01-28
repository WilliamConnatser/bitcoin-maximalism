<template>
    <ul class="opinions">
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
        width: 35%;
        height: 5rem;
        padding: .5rem;
        margin: 0rem .5rem;
        border: 0.1rem solid $color-white;
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