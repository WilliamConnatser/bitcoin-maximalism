<template>
    <div id="app">
        <Header :user="getCurrentUser" />
        <full-page :options="options" id="fullpage" ref="fullpage">
            <BitcoinMaximalism />
            <ParentSlide :args="getAllProtagonisticRhetoric" :sectionSlug="'protagonistic'" :fullpage="this.$refs.fullpage" @slideMounted="reBuild" />
            <ParentSlide :args="getAllAntagonisticRhetoric" :sectionSlug="'antagonistic'" :fullpage="this.$refs.fullpage" @slideMounted="reBuild" />
            <Quiz />
            <Account :user="getCurrentUser" />
            <Terms />
            <Privacy />
        </full-page>
    </div>
</template>

<script>
    import Header from "./components/Header";
    import BitcoinMaximalism from "./components/BitcoinMaximalism";
    import ParentSlide from "./components/ParentSlide";
    import Quiz from "./components/Quiz";
    import Account from "./components/Account";
    import Terms from "./components/Terms";
    import Privacy from "./components/Privacy";

    import gql from 'graphql-tag';

    export default {
        name: "app",
        components: {
            Header,
            BitcoinMaximalism,
            ParentSlide,
            Quiz,
            Account,
            Terms,
            Privacy
        },
        data() {
            return {
                getCurrentUser: null,
                options: {
                    licenseKey: "9B5DE7FD-139843A3-B9E1EAF5-F1341360",
                    menu: "#menu",
                    scrollOverflow: true,
                    controlArrows: true,
                    scrollOverflowReset: true,
                    scrollBar: false,
                    paddingTop: '4em',
                    anchors: [
                        "bitcoin-maximalism",
                        "protagonistic",
                        "antagonistic",
                        "quiz",
                        "account",
                        "terms",
                        "privacy"
                    ],
                    sectionsColor: [
                        "#41b883",
                        "#0798ec",
                        "#ff5f45",
                        "#2c3e4f",
                        "#ba5be9",
                        "#fec401",
                        "#1bcee6",
                        "#ee1a59",
                        "#b4b8ab"
                    ]
                }
            }
        },
        methods: {
            reBuild() {
                this.$refs.fullpage.api.reBuild();
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

<style>
    #app {
        font-family: arial, helvetica
    }

    blockquote,
    body,
    dd,
    div,
    dl,
    dt,
    fieldset,
    form,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    input,
    li,
    ol,
    p,
    pre,
    td,
    textarea,
    th,
    ul {
        padding: 0;
        margin: 0
    }

    table {
        border-spacing: 0
    }

    fieldset,
    img {
        border: 0
    }

    address,
    caption,
    cite,
    code,
    dfn,
    em,
    strong,
    th,
    var {
        font-weight: 400;
        font-style: normal
    }

    strong {
        font-weight: 700
    }

    ol,
    ul {
        list-style: none;
        margin: 0;
        padding: 0
    }

    caption,
    th {
        text-align: left
    }

    q:after,
    q:before {
        content: ''
    }

    abbr,
    acronym {
        border: 0
    }

    * {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box
    }

    h1 {
        font-size: 5em;
        text-align: center;
        color: #fff;
        font-weight: 700
    }

    a:hover,
    a:active {
        color: darkred;
    }

    a:visited {
        color: black;
    }

    svg {
        fill: #fff;
        height: 3em;
        width: 3em;
    }

    span {
        font-size: 0.8em;
    }

    .section {
        position: relative;
        color: #fff;
        text-align: center;
    }

    .section a {
        padding: 0.25em;
        color: #3d3d3d;
        font-family: helvetica;
        text-transform: uppercase;
        text-decoration: underline;
    }

    .wrapper {
        margin: 3em 1em 3em 1em;
    }

    .slideWrapper {
        margin: 3em 3em 3em 3em;
    }

    .slideWrapper ul {
        list-style: none;
    }

    .slideWrapper li {
        padding: 0.5em;
    }

    @media screen and (min-width: 550px) and (max-width: 900px) {

        h1 {
            font-size: 3em;
        }
    }

    @media screen and (max-width: 550px) {

        h1 {
            font-size: 1.9em;
        }
    }
</style>