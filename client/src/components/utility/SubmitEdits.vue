<template>
    <div ref="success">
        <form @submit.prevent="submitted=true">
            <div class="block">
                <label>Donation Amount (BTC)</label>
                <input id="donation-amount" type="text" v-model="donationAmount">
                <div class="small-text">
                    Your edit is more (or less) likely to be reviewed depending on the donation's value.
                    Please keep in mind the amount of time it may take to validate what you are submitting.
                    For example, if your edit needs to be researched and analyzed, then the donation could be more,
                    but if your edit is a correction of a typo (or simple re-wording) then it could be less.
                </div>
            </div>

            <div v-if="arrayItemProp.__typename == 'Resource'">
                <div class="block">
                    <label>Title</label>
                    <input type="text" v-model="resourceTitle">
                    <div class="description">
                        The title of the resource.
                    </div>
                </div>
                <div class="block">
                    <label>Link</label>
                    <input type="url" v-model="resourceLink">
                    <div class="description">
                        The link to the resource.
                    </div>
                </div>
                <div class="block">
                    <label>Media Type</label>
                    <input type="text" v-model="resourceMedia">
                    <div class="description">
                        The type of media of the link.
                    </div>
                </div>

                <div class="block">
                    <div class="small-text">
                        Submitting an edit and making a donation does not guarantee that your
                        edit will be approved. We reserve the right to not publish an edit or alter your edit for any
                        reason we deem necessary, so please remain respectful of others and intellectually honest.
                        All donations are non-binding, no products or services are guaranteed in lieu of a donation,
                        and absolutely no refunds will be performed no matter your edit is published or edited. By
                        continuing you are agreeing to accept the <router-link to="/terms">Terms</router-link> &amp;
                        <router-link to="/privacy">Privacy Policy</router-link>.
                    </div>
                </div>

            </div>

            <div v-if="arrayItemProp.__typename == 'BulletPoint'">
                <div class="block">
                    <label>Content</label>
                    <textarea v-model="bulletPointContent" maxlength=280></textarea>
                    <div class="small-text">
                        The content of the argument.
                    </div>
                </div>
                <div class="block">
                    <div class="small-text">
                        Submitting an edit and making a donation does not guarantee that your
                        edit will be approved. We reserve the right to not publish an edit or alter your edit for any
                        reason we deem necessary, so please remain respectful of others and intellectually honest.
                        All donations are non-binding, no products or services are guaranteed in lieu of a donation,
                        and absolutely no refunds will be performed no matter your edit is published or edited. By
                        continuing you are agreeing to accept the <router-link to="/terms">Terms</router-link> &amp;
                        <router-link to="/privacy">Privacy Policy</router-link>.
                    </div>
                </div>
            </div>

            <button type="submit">I Agree</button>
        </form>
    </div>
</template>

<script>
    import gql from 'graphql-tag';

    export default {
        name: "SubmitEdits",
        props: {
            arrayItemProp: Object,
            metaSlug: String
        },
        data() {
            return {
                currentUser: null,
                viewOpinions: null,
                viewEdits: null,
                donationAmount: 0,
                bulletPointContent: this.arrayItemProp.content,
                resourceTitle: this.arrayItemProp.title,
                resourceLink: this.arrayItemProp.link,
                resourceMedia:  this.arrayItemProp.media,
                submitted: null
            }
        },
        methods: {
            scrollToTop() {
                var element = this.$refs.success;
                var top = element.offsetTop;
                window.scrollTo(0, top);
            }
        },
        watch: {
            submitted(newValue) {
                if (newValue) this.scrollToTop();
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
            }
        }
    };
</script>