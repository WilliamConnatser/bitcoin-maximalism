const getCurrentUser = gql `
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

const getAllProtagonisticRhetoric = gql `
        query getAllProtagonisticRhetoric {
            getAllProtagonisticRhetoric {
                _id
                dateCreated
                active
                slug
                pro
                title
                approved
                dateApproved
                approvedBy
                approvalCommentary
                bulletPoints {
                    _id
                    dateCreated
                    active
                    slug
                    pro
                    content
                    approved
                    dateApproved
                    approvedBy
                    approvalCommentary
                    edits
                    opinions
                    donations
                }
                resources {
                    _id
                    dateCreated
                    slug
                    pro
                    title
                    media
                    link
                    approved
                    dateApproved
                    approvedBy
                    approvalCommentary
                    edits
                    opinions
                    donations
                }
                opinions {
                    _id
                    dateCreated
                    slug
                    pro                                
                    comment
                    approved
                    dateApproved
                    approvedBy
                    approvalCommentary
                    document
                    onModel
                    donations
                }
                edits {
                    _id
                    dateCreated
                    slug
                    pro
                    old
                    new
                    onModel
                    approved                                
                    dateApproved
                    approvedBy
                    approvalCommentary
                    opinions
                    donations
                }
                donations {
                    _id
                    dateCreated
                    slug
                    pro
                    ticker
                    amount
                    username
                    document
                    onModel
                } 
            }
        }
    `

const getAllAntagonisticRhetoric = gql `
        query getAllAntagonisticRhetoric {
            getAllAntagonisticRhetoric {
                _id
                dateCreated
                active
                slug
                pro
                title
                approved
                dateApproved
                approvedBy
                approvalCommentary
                bulletPoints {
                    _id
                    dateCreated
                    active
                    slug
                    pro
                    content
                    approved
                    dateApproved
                    approvedBy
                    approvalCommentary
                    edits
                    opinions
                    donations
                }
                resources {
                    _id
                    dateCreated
                    slug
                    pro
                    title
                    media
                    link
                    approved
                    dateApproved
                    approvedBy
                    approvalCommentary
                    edits
                    opinions
                    donations
                }
                opinions {
                    _id
                    dateCreated
                    slug
                    pro                                
                    comment
                    approved
                    dateApproved
                    approvedBy
                    approvalCommentary
                    document
                    onModel
                    donations
                }
                edits {
                    _id
                    dateCreated
                    slug
                    pro
                    old
                    new
                    onModel
                    approved                                
                    dateApproved
                    approvedBy
                    approvalCommentary
                    opinions
                    donations
                }
                donations {
                    _id
                    dateCreated
                    slug
                    pro
                    ticker
                    amount
                    username
                    document
                    onModel
                }
            }
        }
    `