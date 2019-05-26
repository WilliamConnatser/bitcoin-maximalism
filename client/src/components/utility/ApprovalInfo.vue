<template>
    <div class="small-text medium-margin">
        <div v-if="object.dateApproved || object.__typename === 'Opinion'" class="small-text medium-margin">
            <div v-if="object.__typename === 'Opinion' && object.approved">
                This {{title}} was automatically approved.
                <br />
                <ArgumentLink :object="object" />
            </div>
            <div v-else-if="object.approved">
                This {{title}} was approved on {{object.dateApproved | formatDate}}
                <br />
                <ArgumentLink :object="object" />
            </div>
            <div v-else>
                This {{title}} was denied approval on {{object.dateApproved | formatDate}}
                <br />
                Reason Given: {{object.approvalCommentary}}
            </div>
        </div>
        <div v-else>
            This {{title}} has not been approved yet.
        </div>
    </div>
</template>


<script>
    import ArgumentLink from './ArgumentLink';

    export default {
        name: "ApprovalInfo",
        props: {
            object: Object,
            title: String
        },
        components: {
            ArgumentLink
        }
    }
</script>