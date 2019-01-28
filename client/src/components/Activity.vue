<template>
    <div class="Activity">

            <h1>Recent Activity</h1>

    </div>
</template>

<script>
    import gql from 'graphql-tag';
    
    export default {
        name: "Activity",
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
            },
            slugSpecificAmountDonated: {
                query: gql `query slugSpecificAmountDonated($pro: Boolean!, $slug: String!) {
                                slugSpecificAmountDonated(pro: $pro, slug: $slug)
                            }
                        `,
                variables() {
                    return {
                        pro: this.pro,
                        slug: this.slug
                    }
                }
            },
            docSpecificAmountDonated: {
                query: gql `query docSpecificAmountDonated($pro: Boolean!, $slug: String!, $onModel: String!, $documentID: ID!) {
                                docSpecificAmountDonated(pro: $pro, slug: $slug, onModel: $onModel, documentID: $documentID)
                            }
                        `,
                variables() {
                    return {
                        pro: this.pro,
                        slug: this.slug,
                        onModel: this.arrayItemProp.__typename,
                        documentID: this.arrayItemProp._id
                    }
                }
            }
        }
    }
</script>