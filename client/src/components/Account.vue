<template>
    <div class="section">
        <div class="wrapper">
            <Login v-if="!user" />
            <div v-if="user">
                <h1>Welcome {{user.username}}!</h1>
                <p v-if="!user.allegiance">
                    You have not yet sworn allegiance to either faction. Your ancestors would be ashamed...
                </p>
                <p v-else>
                    You think you're a {{getAllegiance}}, huh? <br/>
                    <strong>
                        <a v-if="!user.passedQuiz" href="#quiz">Prove it!</a>
                    </strong>
                </p>
                    
                <button @click="setAllegiance('Maximalist')" :style="getStyle('Maximalist')">
                    I identify as a Bitcoin Maximalist
                </button>
                <button @click="setAllegiance('Multicoinist')" :style="getStyle('Multicoinist')">
                    I identify as a Multicoinist
                </button>

                <p v-show="user.admin">
                    You so fancy! Look are you, Mr. Administrator...
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import Login from './auth/Login';
    import gql from 'graphql-tag';

    export default {
        name: "Account",
        computed: {
            getAllegiance() {
                if (this.user.maximalist) {
                    return 'Bitcoin Maximalist';
                } else {
                    return 'Multicoinist';
                }
            }
        },
        components: {
            Login
        },
        props: [
            'user'
        ],
        methods: {
            getStyle(allegiance) {
                if (this.user.maximalist && allegiance === 'Maximalist') {
                    return 'background-color: #41b883';
                } else if (!this.user.maximalist && allegiance === 'Multicoinist') {
                    return 'background-color: #41b883';
                }
            },
            setAllegiance(allegiance) {
                //GraphQL Mutation
                this.$apollo.mutate({
                    mutation: gql `
                        mutation($allegiance: String!) {
                            setAllegiance(allegiance: $allegiance){
                                _id
                                username
                                email
                                admin
                                allegiance
                                maximalist
                            }
                        }
                    `,
                    variables: {
                        allegiance
                    }
                }).then(() => {
                    //Refresh the getCurrentUser query
                    this.$apollo.queries.getCurrentUser.refetch();
                }).catch(error => {
                    // Error :\
                    console.error(error);
                })
            }
        },
        apollo: {
            getCurrentUser: gql `
                query getCurrentUser {
                    getCurrentUser {
                        _id
                        username
                        email
                        admin
                        allegiance
                        maximalist
                    }
                }
            `
        }
    };
</script>