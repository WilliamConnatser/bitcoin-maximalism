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
            },
            getAmountDonatedSlugSpecific: {
                query: gql `query getAmountDonatedSlugSpecific($pro: Boolean!, $slug: String!) {
                                getAmountDonatedSlugSpecific(pro: $pro, slug: $slug)
                            }
                        `,
                variables() {
                    return {
                        pro: this.pro,
                        slug: this.slug
                    }
                }
            },
            getAmountDonatedModelSpecific: {
                query: gql `query getAmountDonatedModelSpecific($pro: Boolean!, $slug: String!, $onModel: String!, $documentID: ID!) {
                                getAmountDonatedModelSpecific(pro: $pro, slug: $slug, onModel: $onModel, documentID: $documentID)
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