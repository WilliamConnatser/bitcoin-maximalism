<template>
    <div id="app">
        <Header :user="getCurrentUser" />
        <router-view class="view" />
        <Footer />
    </div>
</template>

<script>
    import Header from "./components/Header";
    import Footer from "./components/Footer";

    import gql from 'graphql-tag';

    export default {
        name: "app",
        components: {
            Header,
            Footer
        },
        data() {
            return {
                getCurrentUser: null
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
                            admin
                            allegiance
                            maximalist
                        }
                    }
                `
            },
            getAllProtagonisticRhetoric: {
                query: gql `
                    query getAllProtagonisticRhetoric($approved: Boolean) {
                        getAllProtagonisticRhetoric(approved: $approved) {
                            _id
                            slug
                            pro
                            title
                            dateCreated
                            dateLastEdited
                            approved
                            dateApproved
                            bulletPoints {
                                _id
                                slug
                                pro
                                dateCreated
                                dateLastEdited
                                content
                                approved
                                dateApproved
                            }
                            resources {
                                _id
                                slug
                                pro
                                dateCreated
                                dateLastEdited
                                title
                                media
                                link
                                approved
                                dateApproved
                            }
                            opinions {
                                _id
                                slug
                                pro
                                dateCreated
                                comment
                                approved
                                dateCreated
                            }
                            edits {
                                slug
                                pro
                                dateCreated
                                dateApproved
                            }  
                        }
                    }
                `,
                variables: {
                    approved: true
                }
            },
            getAllAntagonisticRhetoric: {
                query: gql `
                    query getAllAntagonisticRhetoric($approved: Boolean) {
                        getAllAntagonisticRhetoric(approved: $approved) {
                            _id
                            slug
                            pro
                            title
                            dateCreated
                            dateLastEdited
                            approved
                            dateApproved
                            bulletPoints {
                                _id
                                slug
                                pro
                                dateCreated
                                dateLastEdited
                                content
                                approved
                                dateApproved
                            }
                            resources {
                                _id
                                slug
                                pro
                                dateCreated
                                dateLastEdited
                                title
                                media
                                link
                                approved
                                dateApproved
                            }
                            opinions {
                                _id
                                slug
                                pro
                                dateCreated
                                comment
                                approved
                                dateCreated
                            }
                            edits {
                                slug
                                pro
                                dateCreated
                                dateApproved
                            }  
                        }
                    }
                `,
                variables: {
                    approved: true
                }
            }
        }
    };
</script>

<style lang="scss">
    @import "./sass/variables";

    *,
    *::after,
    *::before {
        margin: 0;
        padding: 0;
        box-sizing: inherit;
    }

    body,
    html {
        //This defines what 1REM is
        font-size: 62.5%;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        line-height: 1.7;
        height: 100%;

        box-sizing: border-box;
    }

    #app {
        color: $color-white;
    }

    .view {
        min-height: 92vh;
        padding: 2rem 2rem;
        background-color: $color-secondary;
        text-align: center;
        font-size: 1.5rem;
    }
</style>