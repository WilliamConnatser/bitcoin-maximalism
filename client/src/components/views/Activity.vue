<template>
    <div class="activity">
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
                            emailVerified
                            active
                            admin
                        }
                    }
                `
            },
            argumentSpecificAmountDonated: {
                query: gql `query argumentSpecificAmountDonated($pro: Boolean!, $slug: String!) {
                                argumentSpecificAmountDonated(pro: $pro, slug: $slug)
                            }
                        `,
                variables() {
                    return {
                        pro: this.pro,
                        slug: this.slug
                    }
                }
            },
            docIDSpecificAmountDonated: {
                query: gql `query docIDSpecificAmountDonated($pro: Boolean!, $slug: String!, $onModel: String!, $documentID: ID!) {
                                docIDSpecificAmountDonated(pro: $pro, slug: $slug, onModel: $onModel, documentID: $documentID)
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