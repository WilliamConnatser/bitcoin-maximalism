<template>
    <div ref="success">
        <form v-if="!submitted" @submit.prevent="submitted=true">
            <div class="block">
                <label>Donation Amount (BTC)</label>
                <input id="donation-amount" type="text" v-model="donationAmount">
                <div class="description">
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
                    <div class="description">
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
                    <div class="description">
                        The content of the argument.
                    </div>
                </div>
                <div class="block">
                    <div class="description">
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
        <div v-else>
            <h2>Success!</h2>

            If the donation was completed successfully, then your edit has been submitted to the administrators for
            review. From this point forward, you may track the status of the edit you've submitted on the user
            <router-link to="/account">Account Panel</router-link>.
        </div>
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
                            emailValidated
                            active
                            admin
                            allegiance
                            maximalist
                        }
                    }
                `
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../sass/variables.scss";

    .block {
        margin: 3rem;
    }

    input {
        text-align: center;
        display: inline-block;
        max-width: 65rem;
        width: 90%;
        height: 4rem;
        border: 0.1rem solid $color-white;
        color: $color-white;
        background-color: $color-green;
    }

    #donation-amount {
        font-size: 2rem;
        max-width: 20rem;
    }

    textarea {
        text-align: center;
        display: inline-block;

        width: 100%;
        height: 30rem;
        font-size: 2rem;
        border: 0.1rem solid $color-white;
        color: $color-white;
        background-color: $color-green;
    }

    label {
        color: $color-white;
        display: inline-block;
        width: 100%;
        font-size: 1.9rem;
    }

    button {
        color: $color-white;
        background-color: $color-green;
        font-size: 1.5rem;
        width: 35%;
        height: 5rem;
        padding: .5rem;
        margin: .5rem;
        border: 0.1rem solid $color-white;
    }

    .description {
        font-size: 1.5rem;
    }
</style>