<template>
    <main >
        <h1 class="heading">donation status</h1>
        <h2 v-if="$apollo.loading" class="loading">Loading...</h2>
        <apollo-response v-else class="apollo-response" />
        
        <ul v-if="docIDSpecificDonation" class="list">
            <h2>Donation</h2>
            <li v-if="docIDSpecificDonation.active && !docIDSpecificDonation.paid">
                <iframe :src="docIDSpecificDonation.invoiceURL" scrolling="no" class="btcpay-iframe">
                    Pay Here: {{docIDSpecificDonation.invoiceURL}}
                </iframe>
                <div class="medium-margin">
                    <button @click="refetchCheckDonation()">Donation Paid</button>
                </div>
            </li>
            <li>
                <strong>Date Created</strong>: {{ docIDSpecificDonation.dateCreated | formatDate}}
            </li>
            <li>
                <strong>Created By</strong>: {{docIDSpecificDonation.createdBy.username}}
            </li>
            <li>
                <strong>Created For</strong>: {{docIDSpecificDonation.createdFor.username}}
            </li>
            <li>
                <strong>Attributed Towards</strong>: {{donationFor}}
            </li>
            <li v-if="!docIDSpecificDonation.active">
                <strong>Inactive</strong> Unpaid or Expired Invoice
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
            <li v-if="!docIDSpecificDonation.accruing">
                <strong>Applicable Document</strong>: {{ docIDSpecificDonation.onModel }} - {{ docIDSpecificDonation.documentID }}
            </li>
            <li>
                <strong>Donation ID</strong>: <router-link :to="donationLink" class="small-uppercase-link">{{docIDSpecificDonation._id}}</router-link>
            </li>
            <li>
                <strong>Invoice ID</strong>: <a :href="docIDSpecificDonation.invoiceURL">{{ docIDSpecificDonation.invoiceID }}</a>
            </li>
        </ul>
        <div v-else-if="!$apollo.loading" class="medium-margin">
            <h2>You're not authorized to view this donation.</h2>
        </div>
    </main>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "DonationStatus",
        data: () => {
            return {
                docIDSpecificDonation: null,
                checkDonation: null
            }
        },
        methods: {
            refetchCheckDonation() {
                if(this.$apollo.queries.checkDonation) this.$apollo.queries.checkDonation.refetch();
            }
        },
        computed: {
            donationLink() {
                return '/donation-status/' + this.docIDSpecificDonation._id;
            },
            donationFor() {
                if (this.docIDSpecificDonation.accruing) return 'Influence';
                else if (this.docIDSpecificDonation.onModel === 'Certificate') return 'Certificate';
            }
        },
        apollo: {
            currentUser: {
                query: gql `
                    query currentUser {
                        currentUser {
                            _id
                        }
                    }
                `
            },
            checkDonation: {
                query: gql `query checkDonation($_id: ID!) {
                        checkDonation(_id: $_id)
                    }
                `,
                variables() {
                    return {
                        _id: this.$route.params._id
                    }
                },
                skip(){
                    if(!this.$route.params || !this.$route.params._id) return true
                    else return false
                },
                result({data}){
                    if(data.checkDonation && this.docIDSpecificDonation && !this.docIDSpecificDonation.paid) {
                        this.$apollo.queries.docIDSpecificDonation.refetch();
                    }
                },
                pollInterval: 30000
            },
            docIDSpecificDonation: {
                query: gql `query docIDSpecificDonation($_id: ID!) {
                    docIDSpecificDonation(_id: $_id) {
                        _id
                        createdBy {
                            username
                        }
                        createdFor {
                            username
                        }
                        dateCreated
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
                skip(){
                    if(!this.$route.params || !this.$route.params._id) return true
                    else return false
                },
                result({data}){
                    if(data.docIDSpecificDonation.paid) {
                        this.$apollo.queries.checkDonation.stopPolling();
                    }
                }
            }
        }
    };
</script>