<template>
    <div>
        <h2>{{title}}</h2>
        <div v-if="objectArray.length>0">
            <ul v-for="object in objectArray" :key="object._id" class="list">

                <li v-if="object.__typename === 'Donation'">
                    <strong>{{object.dateCreated | formatDate}}</strong>
                    <br />
                    Donation For: {{donationFor(object.accruing, object.onModel)}}
                    <br />
                    Status: <strong>{{status(object)}}</strong>
                    <br />
                    <div v-if="!object.active && !object.paid">
                        This invoice expired without payment.
                    </div>
                    <StatusLink :object="object" />
                </li>

                <li v-else-if="object.__typename === 'Vote'">
                    <strong>{{object.dateCreated | formatDate}}</strong>
                    <br />
                    <span v-if="object.upVote">Upvote +{{currentUser.accruedDonations | formatBitcoinAmount}}</span>
                    <span v-else>Downvote -{{currentUser.accruedDonations | formatBitcoinAmount}}</span>
                    <br />

                    <ArgumentLink :object="object" />
                </li>

                <li v-else-if="object.__typename === 'Opinion'">
                    <strong>{{object.dateCreated | formatDate}}</strong>
                    <br />
                    Influence:
                    <span v-if="calculateVotes(object.votes)>0">
                        + {{calculateVotes(object.votes) | formatBitcoinAmount}}
                    </span>
                    <span v-else-if="calculateVotes(object.votes)<0">
                        - {{calculateVotes(object.votes)*-1 | formatBitcoinAmount}}
                    </span>
                    <span v-else-if="calculateVotes(object.votes)===0">
                        {{calculateVotes(object.votes) | formatBitcoinAmount}}
                    </span>
                    <br />
                    {{object.opinion}}
                    <br />
                    <ArgumentLink :object="object" />
                    <ApprovalInfo :object="object" title="opinion" />
                </li>

                <li v-else-if="object.__typename === 'Rhetoric'">
                    <strong>{{object.dateCreated | formatDate}}</strong>
                    <br />
                    {{object.title}}
                    <ApprovalInfo :object="object" title="argument" />
                    <StatusLink :object="object" />
                </li>

                <li v-else-if="object.__typename === 'Project'">
                    <strong>{{object.dateCreated | formatDate}}</strong>
                    <br />
                    <a :href="object.link" class="unstyled-link">
                        <span class="media-type">
                            { {{object.metaSlug}} }
                        </span>
                        {{object.title}}
                    </a>
                    <br />
                    {{object.description}}
                    <ApprovalInfo :object="object" title="project" />
                    <StatusLink :object="object" />
                </li>

                <li v-else-if="object.__typename === 'Resource'">
                    <strong>{{object.dateCreated | formatDate}}</strong>
                    <br />
                    <a :href="object.link" class="unstyled-link">
                        <span class="media-type">
                            { {{object.media}} }
                        </span>
                        {{object.title}}
                    </a>
                    <ApprovalInfo :object="object" title="resource" />
                    <StatusLink :object="object" />
                </li>

                <li v-else-if="object.__typename === 'BulletPoint'">
                    <strong>{{object.dateCreated | formatDate}}</strong>
                    <br />
                    {{object.content}}
                    <ApprovalInfo :object="object" title="bulletPoint" />
                    <StatusLink :object="object" />
                </li>
            </ul>
        </div>
        <div v-else class="small-text medium-margin">
            You haven't made any {{title.toLowerCase()}} yet.
        </div>
    </div>
</template>

<script>
    import ApprovalInfo from './ApprovalInfo';
    import ArgumentLink from './ArgumentLink';
    import StatusLink from './StatusLink';

    export default {
        name: "AccountTab",
        props: {
            title: String,
            objectArray: Array,
            currentUser: Object
        },
        components: {
            ApprovalInfo,
            ArgumentLink,
            StatusLink
        },
        methods: {
            status(donation) {
                if (!donation.active) return 'Inactive'
                if (!donation.paid) return 'Unpaid'
                if (donation.paid) return 'Paid'
            },
            donationFor(accruing, onModel) {
                if (accruing) return 'Influence';
                else if (onModel === 'Certificate') return 'Certificate';
            },
            toggleHistoryTab(tabName) {
                this.historyTab = tabName;
            },
            tabButtonStyle(tabName) {
                if (tabName === this.historyTab) return "small-button selected-button";
                else return "small-button";
            },
            calculateVotes(voteArray) {
                let cumulativeVote = 0;
                voteArray.forEach(vote => {
                    if (vote.upVote) cumulativeVote += vote.createdBy.accruedDonations;
                    else cumulativeVote -= vote.createdBy.accruedDonations;
                });
                return cumulativeVote;
            },
            validAllegiance(allegiance) {
                return typeof allegiance === 'boolean' ? true : false;
            }
        }
    };
</script>