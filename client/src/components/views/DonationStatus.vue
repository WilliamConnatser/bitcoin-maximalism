<template>
    <div>
        <h1>Donation Status</h1>
        <ul v-if="docIDSpecificDonation" class="basic-list">
            <li v-if="docIDSpecificDonation.active && !docIDSpecificDonation.paid">
                Get your friends to foot the bill! ;)
                <SocialIcons />
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
                <strong>Applicable Argument</strong>: <router-link :to="argumentLink(docIDSpecificDonation.pro, docIDSpecificDonation.slug)">{{argumentLink(docIDSpecificDonation.pro, docIDSpecificDonation.slug)}}</router-link>
            </li>
            <li>
                <strong>Applicable Document</strong>: {{ docIDSpecificDonation.onModel }} - {{ docIDSpecificDonation.documentID }}
            </li>
            <li>
                <strong>Donation For</strong>: {{donationFor}}
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
                <strong>Amount</strong>: {{ docIDSpecificDonation.amount | formatBitcoinAmount}}
            </li>
            <li>
                <strong>Paid</strong>: {{ docIDSpecificDonation.paid }}
            </li>
        </ul>
        <ul v-if="donationSpecificOpinion" class="basic-list">
            <h2>Opinion</h2>
            <li>
                <strong>Date Created</strong>: {{ donationSpecificOpinion.dateCreated | formatDate }}
            </li>
            <li>
                <strong>Opinion ID</strong>: {{ donationSpecificOpinion._id }}
            </li>
            <li>
                <strong>Applicable Argument</strong>: <router-link :to="argumentLink(donationSpecificOpinion.pro, donationSpecificOpinion.slug)">{{argumentLink(donationSpecificOpinion.pro, donationSpecificOpinion.slug)}}</router-link>
            </li>
            <li>
                <strong>Applicable Document</strong>: {{ donationSpecificOpinion.onModel }} - {{ donationSpecificOpinion.documentID }}
            </li>
            <li>
                <strong>Approved</strong>: {{ donationSpecificOpinion.approved }}
            </li>
            <li v-if="donationSpecificOpinion.approved">
                <strong>Date Approved</strong>: {{ donationSpecificOpinion.dateApproved }}
            </li>
            <li v-if="donationSpecificOpinion.approved">
                <strong>Approved By</strong>: {{ donationSpecificOpinion.approvedBy }}
            </li>
            <li v-if="donationSpecificOpinion.approved">
                <strong>Approval Commentary</strong>: {{ donationSpecificOpinion.approvalCommentary }}
            </li>
            <li>
                <strong>Opinion</strong>: {{ donationSpecificOpinion.opinion }}
            </li>
        </ul>
        <ul v-if="docIDSpecificRhetoric" class="basic-list">
            <h2>Argument</h2>
            <li>
                <strong>Argument ID</strong>: {{ docIDSpecificRhetoric._id }}
            </li>
            <li>
                <strong>Argument Link</strong>: <router-link :to="argumentLink(docIDSpecificRhetoric.pro, docIDSpecificRhetoric.slug)">{{argumentLink(docIDSpecificRhetoric.pro, docIDSpecificRhetoric.slug)}}</router-link>
            </li>
            <li>
                <strong>Title</strong>: {{ docIDSpecificRhetoric.title }}
            </li>
            <li>
                <strong>Accrued Votes</strong>: {{ docIDSpecificRhetoric.accruedVotes }}
            </li>
        </ul>
        <ul v-if="docIDSpecificBulletPoint" class="basic-list">
            <h2>BulletPoint</h2>
            <li>
                <strong>BulletPoint ID</strong>: {{ docIDSpecificBulletPoint._id }}
            </li>
            <li>
                <strong>Applicable Argument</strong>: <router-link :to="argumentLink(docIDSpecificBulletPoint.pro, docIDSpecificBulletPoint.slug)">{{argumentLink(docIDSpecificBulletPoint.pro, docIDSpecificBulletPoint.slug)}}</router-link>
            </li>
            <li>
                <strong>Accrued Votes</strong>: {{ docIDSpecificBulletPoint.accruedVotes }}
            </li>
            <li>
                <strong>Content</strong>: {{ docIDSpecificBulletPoint.content }}
            </li>
        </ul>
        <ul v-if="docIDSpecificResource" class="basic-list">
            <h2>Resource</h2>
            <li>
                <strong>Resource ID</strong>: {{ docIDSpecificResource._id }}
            </li>
            <li>
                <strong>Applicable Argument</strong>: <router-link :to="argumentLink(docIDSpecificResource.pro, docIDSpecificResource.slug)">{{argumentLink(docIDSpecificResource.pro, docIDSpecificResource.slug)}}</router-link>
            </li>
            <li>
                <strong>Accrued Votes</strong>: {{ docIDSpecificResource.accruedVotes }}
            </li>
            <li>
                <strong>Media</strong>: {{ docIDSpecificResource.media }}
            </li>
            <li>
                <strong>Title</strong>: {{ docIDSpecificResource.title }}
            </li>
            <li>
                <strong>Link</strong>: <a :href="docIDSpecificResource.link">{{ docIDSpecificResource.link }}</a>
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
                docIDSpecificDonation: null,
                donationSpecificOpinion: null,
                docIDSpecificRhetoric: null,
                docIDSpecificBulletPoint: null,
                docIDSpecificResource: null
            }
        },
        methods: {
            argumentLink(pro, slug) {
                var metaSlug = "";
                pro ? metaSlug = 'protagonistic' : metaSlug = 'antagonistic';
                return '/rhetoric/' + metaSlug + '/' + slug;
            }
        },
        computed: {
            donationLink() {
                return '/donation-status/' + this.docIDSpecificDonation._id;
            },
            donationFor() {
                if (!this.docIDSpecificDonation.votingDonation) return 'Opinion';
                else if (this.docIDSpecificDonation.upVote) return 'Upvote';
                else return 'Downvote';
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
            donationSpecificOpinion: {
                query: gql `query donationSpecificOpinion($_id: ID!) {
                    donationSpecificOpinion(_id: $_id) {
                        _id
                        dateCreated
                        createdBy
                        slug
                        pro
                        opinion
                        approved
                        dateApproved
                        approvedBy
                        approvalCommentary
                        documentID
                        onModel
                    }
                }`,
                variables() {
                    return {
                        _id: this.docIDSpecificDonation._id
                    }
                },
                skip() {
                    if (this.docIDSpecificDonation && !this.docIDSpecificDonation.votingDonation) {
                        return false
                    } else {
                        return true
                    }
                }
            },
            docIDSpecificDonation: {
                query: gql `query docIDSpecificDonation($_id: ID!) {
                    docIDSpecificDonation(_id: $_id) {
                        _id
                        dateCreated
                        createdBy
                        slug
                        pro
                        amount
                        documentID
                        onModel
                        active
                        paid
                        invoiceID
                        invoiceURL
                        votingDonation
                        upVote
                    }
                }`,
                variables() {
                    return {
                        _id: this.$route.params._id
                    }
                },
                pollInterval: 30000
            },
            docIDSpecificRhetoric: {
                query: gql `query docIDSpecificRhetoric($_id: ID!) {
                    docIDSpecificRhetoric(_id: $_id) {
                        _id
                        slug
                        pro
                        title
                        accruedVotes
                    }
                }`,
                variables() {
                    return {
                        _id: this.docIDSpecificDonation.documentID
                    }
                },
                skip() {
                    if (this.docIDSpecificDonation && this.docIDSpecificDonation.onModel === 'Rhetoric') {
                        return false
                    } else {
                        return true
                    }
                }
            },
            docIDSpecificBulletPoint: {
                query: gql `query docIDSpecificBulletPoint($_id: ID!) {
                    docIDSpecificBulletPoint(_id: $_id) {
                        _id
                        pro
                        slug
                        content
                        accruedVotes
                    }
                }`,
                variables() {
                    return {
                        _id: this.docIDSpecificDonation.documentID
                    }
                },
                skip() {
                    if (this.docIDSpecificDonation && this.docIDSpecificDonation.onModel === 'BulletPoint') {
                        return false
                    } else {
                        return true
                    }
                }
            },
            docIDSpecificResource: {
                query: gql `query docIDSpecificResource($_id: ID!) {
                    docIDSpecificResource(_id: $_id) {
                        _id
                        pro
                        slug
                        title
                        media
                        link
                        accruedVotes
                    }
                }`,
                variables() {
                    return {
                        _id: this.docIDSpecificDonation.documentID
                    }
                },
                skip() {
                    if (this.docIDSpecificDonation && this.docIDSpecificDonation.onModel === 'Resource') {
                        return false
                    } else {
                        return true
                    }
                }
            }
        }
    };
</script>