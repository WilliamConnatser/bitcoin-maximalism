//Seed data for initial population of database
const initData = require('./initData');

//BTCPayServer client
const btcPayClient = require('./btcpay');

const startup = async models => {
    async function originalInitialization() {
        //Initialize the database on the first start up by inserting initData
        await models.User.findOne({}, async (err, result) => {
            if (!result) {
                const newUser = await new models.User(initData.adminUser).save();
            }
        });
        await models.BulletPoint.findOne({}, async (err, result) => {
            if (!result) await models.BulletPoint.insertMany(initData.bulletPoint)
        });
        await models.Resource.findOne({}, async (err, result) => {
            if (!result) await models.Resource.insertMany(initData.resource)
        });
        await models.Rhetoric.findOne({}, async (err, result) => {
            if (!result) await models.Rhetoric.insertMany(initData.rhetoric)
        });
    }

    function populateBulletPoints() {
        models.BulletPoint.find({}, async (err, results) => {
            for (const bulletPoint of results) {
                models.Rhetoric.findOne({
                    slug: bulletPoint.slug,
                    metaSlug: bulletPoint.metaSlug
                }, async (err, rhetoric) => {
                    let arrayToCompare = rhetoric.bulletPoints.map(function (v) {
                        return v.toString();
                    });
                    if (bulletPoint !== undefined) {
                        if (bulletPoint.slug === rhetoric.slug && bulletPoint.metaSlug === rhetoric.metaSlug) {
                            if (arrayToCompare.indexOf(bulletPoint._id.toString()) < 0) {
                                rhetoric.bulletPoints.push(bulletPoint._id);
                                rhetoric.save();
                            }
                        }
                    }
                });
            }
        });
    }

    function populateResources() {
        models.Resource.find({}, async (err, results) => {
            for (const resource of results) {
                models.Rhetoric.findOne({
                    slug: resource.slug,
                    metaSlug: resource.metaSlug
                }, async (err, rhetoric) => {
                    const arrayToCompare = rhetoric.resources.map(function (v) {
                        return v.toString();
                    });
                    if (resource !== undefined) {
                        if (resource.slug === rhetoric.slug && resource.metaSlug === rhetoric.metaSlug) {
                            if (arrayToCompare.indexOf(resource._id.toString()) < 0) {
                                rhetoric.resources.push(resource._id);
                                rhetoric.save();
                            }
                        }
                    }
                });
            }
        });
    }

    function populateResourceRhetoric() {
        models.Resource.find({}, (err, results) => {
            for (const resource of results) {
                models.Rhetoric.findOne({
                    slug: "resources",
                    metaSlug: resource.metaSlug
                }, (err, rhetoric) => {

                    const arrayToCompare = rhetoric.resources.map(function (v) {
                        return v.toString();
                    });
                    if (resource !== undefined) {
                        if (resource.metaSlug === rhetoric.metaSlug) {
                            if (arrayToCompare.indexOf(resource._id.toString()) < 0) {
                                rhetoric.resources.push(resource._id);
                                rhetoric.save();
                            }
                        }
                    }
                });
            }
        })
    }

    await originalInitialization();
    populateBulletPoints();
    populateResources();
    populateResourceRhetoric();

    function updateBitcoinValue() {
        btcPayClient.get_rates('BTC_USD', process.env.BTCPAY_STOREID)
            .then(async function (rates) {

                const cryptoDoc = await models.Crypto.findOne({
                    ticker: 'BTC'
                });

                if (cryptoDoc) {

                    cryptoDoc.valueUSD = Number(rates[0].rate);
                    cryptoDoc.save();

                } else {

                    const id = require('mongodb').ObjectID();
                    const newCrypto = new models.Crypto({
                        _id: id,
                        ticker: 'BTC',
                        valueUSD: Number(rates[0].rate)
                    }).save();
                }
            })
            .catch(err => console.log(err))
    }

    //Update the Bitcoin value on startup
    updateBitcoinValue();

    //Update the Bitcoin value every hour
    setInterval(function () {
        updateBitcoinValue();
    }, 60 * 60000);

    //Update user documents with new array which holds projects they've submitted
    const users = await models.User.find({}); 
    users.forEach(function(user) {
        console.log(user.projects)
        if(user.projects === undefined) {
            console.log("adding projects array")
            user.projects = [];
            user.save();
        }
    });
}

module.exports = startup;