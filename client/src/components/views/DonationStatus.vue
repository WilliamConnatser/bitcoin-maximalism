<template>
    <div class="normal-text">
        <h1>Donation Status</h1>
        <h1 v-if="$apollo.loading" class="loading">Loading...</h1>
        <ul v-if="docIDSpecificDonation" class="list">
            <li v-if="docIDSpecificDonation.active && !docIDSpecificDonation.paid">
                Get your friends to foot the bill! ;)
                <SocialIcons :currentUser="currentUser" />
                <iframe :src="docIDSpecificDonation.invoiceURL" scrolling="no">Pay Here: {{docIDSpecificDonation.invoiceURL}}</iframe>
            </li>
            <h2>Donation</h2>
            <li>
                <strong>Date Created</strong>: {{ docIDSpecificDonation.dateCreated | formatDate}}
            </li>
            <li>
                <strong>Donation ID</strong>: <router-link :to="donationLink">{{docIDSpecificDonation._id}}</router-link>
            </li>
            <li>
                <strong>Donation For</strong>: {{donationFor}}
            </li>
            <li>
                <strong>Applicable Document</strong>: {{ docIDSpecificDonation.onModel }} - {{ docIDSpecificDonation.documentID }}
            </li>
            <li>
                <strong>Active</strong>: {{ docIDSpecificDonation.active }}
            </li>
            <li>
                <strong>Invoice ID</strong>: {{ docIDSpecificDonation.invoiceID }}
            </li>
            <li>
                <strong>Invoice URL</strong>: <a :href="docIDSpecificDonation.invoiceURL">{{ docIDSpecificDonation.invoiceURL }}</a>
            </li>
            <li>
                <strong>Pre-Bonus Amount</strong>: {{ docIDSpecificDonation.preBonusAmount | formatBitcoinAmount}}
            </li>
            <li>
                <strong>Bonus Percentage</strong>: {{ docIDSpecificDonation.bonusPercentage}}
            </li>
            <li>
                <strong>Amount</strong>: {{ docIDSpecificDonation.amount | formatBitcoinAmount}}
            </li>
            <li>
                <strong>Paid</strong>: {{ docIDSpecificDonation.paid }}
            </li>
        </ul>
    </div>
</template>

<script>
    import gql from 'graphql-tag';
    import SocialIcons from '../utility/SocialIcons';

    export default {
        name: "DonationStatus",
        components: {
            SocialIcons
        },
        data: () => {
            return {
                docIDSpecificDonation: null
            }
        },
        methods: {
            argumentLink(metaSlug, slug) {
                var linkString = '/rhetoric/' + metaSlug;
                if(slug) linkString += '/' + slug;
                return linkString;
            }
        },
        computed: {
            donationLink() {
                return '/donation-status/' + this.docIDSpecificDonation._id;
            },
            donationFor() {
                if (!this.docIDSpecificDonation.accruing) return 'Influence';
                else if (this.docIDSpecificDonation.onModel === 'Certificate') return 'Certificate';
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
            docIDSpecificDonation: {
                query: gql `query docIDSpecificDonation($_id: ID!) {
                    docIDSpecificDonation(_id: $_id) {
                        _id
                        dateCreated
                        createdBy {
                            _id
                            username
                            accruedDonations
                        }
                        amount
                        bonusPercentage
                        preBonusAmount
                        accruing
                        documentID
                        onModel
                        active
                        paid
                        invoiceID
                        invoiceURL
                    }
                }`,
                variables() {
                    return {
                        _id: this.$route.params._id
                    }
                },
                pollInterval: 30000
            }
        }
    };
</script>