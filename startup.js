//Seed data for initial population of database
const initData = require('./initData');

//BTCPayServer client
const btcPayClient = require('./btcpay');

//Mongoose Models
const Rhetoric = require('./models/Rhetoric');
const Edit = require('./models/Edit');
const Opinion = require('./models/Opinion');
const Resource = require('./models/Resource');
const Certificate = require('./models/Certificate');
const Donation = require('./models/Donation');
const BulletPoint = require('./models/BulletPoint');
const User = require('./models/User');
const Crypto = require('./models/Crypto');

const startup = async models => {
    async function originalInitialization() {
        //Initialize the database on the first start up
        await models.BulletPoint.findOne({}, async (err, result) => {
            if (!result) await models.BulletPoint.collection.insertMany(initData.bulletPoint)
        });
        await models.Resource.findOne({}, async (err, result) => {
            if (!result) await models.Resource.collection.insertMany(initData.resource)
        });
        await models.Rhetoric.findOne({}, async (err, result) => {
            if (!result) await models.Rhetoric.collection.insertMany(initData.rhetoric)
        });
    }

    function populateBulletPoints() {
        models.BulletPoint.find({}, async (err, results) => {
            for (const bulletPoint of results) {
                Rhetoric.findOne({
                    slug: bulletPoint.slug,
                    pro: bulletPoint.pro
                }, async (err, rhetoric) => {
                    var arrayToCompare = rhetoric.bulletPoints.map(function (v) {
                        return v.toString();
                    });
                    if (bulletPoint !== undefined) {
                        if (bulletPoint.slug === rhetoric.slug && bulletPoint.pro === rhetoric.pro) {
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
                Rhetoric.findOne({
                    slug: resource.slug,
                    pro: resource.pro
                }, async (err, rhetoric) => {
                    var arrayToCompare = rhetoric.resources.map(function (v) {
                        return v.toString();
                    });
                    if (resource !== undefined) {
                        if (resource.slug === rhetoric.slug && resource.pro === rhetoric.pro) {
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
                Rhetoric.findOne({
                    slug: "resources",
                    pro: resource.pro
                }, (err, rhetoric) => {

                    var arrayToCompare = rhetoric.resources.map(function (v) {
                        return v.toString();
                    });
                    if (resource !== undefined) {
                        if (resource.pro === rhetoric.pro) {
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

                var cryptoDoc = await Crypto.findOne({
                    ticker: 'BTC'
                });

                if (cryptoDoc) {

                    cryptoDoc.valueUSD = Number(rates[0].rate);
                    cryptoDoc.save();

                } else {

                    var id = require('mongodb').ObjectID();
                    const newCrypto = new Crypto({
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
}

module.exports = startup;