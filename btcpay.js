const btcpay = require('btcpay');
const keypair = btcpay.crypto.load_keypair(new Buffer.from(process.env.BTCPAY_KEY, 'hex'));
//Recreate client ... used every time you nee to talk to the BTCPAY Server
const BTCPayClient = new btcpay.BTCPayClient(process.env.BTCPAY_URL, keypair, {
    merchant: process.env.BTCPAY_MERCHANT
});

module.exports = BTCPayClient;

/*
Only need to run the following once during initial pairing
It will output a code that needs to be inserted into the environment details now.json under the key PAIRCODE

BTCPayClient
  .pair_client(process.env.BTCPAY_PAIRCODE)
  .then(res => console.log(res))
  .catch(err => console.log(err));


  EXAMPLE BTCPAY SERVER RESPONSES:

//Get current BTC Price
client.get_rates('BTC_USD', process.env.BTCPAY_STOREID)
    .then(rates => console.log(rates))
    .catch(err => console.log(err))

    //RESPONSE FROM get_rates 'BTC_USD'

    [ { name: 'US Dollar',
[server]     cryptoCode: 'BTC',
[server]     currencyPair: 'BTC_USD',
[server]     code: 'USD',
[server]     rate: 3549.82438868746 } ]




//Create an invoice
client.create_invoice({
        price: 0.0000001,
        currency: 'BTC',
        itemDesc: 'Invoice Description',
        buyer: {
            name: 'username',
            email: 'email'
        }
    })
    .then(invoice => console.log(invoice, invoice.url))
    .catch(err => console.log(err))


    RESPONSE FROM create_invoice:

    { url:
[server]    'https://mainnet.demo.btcpayserver.org/invoice?id=UNgz9TvKFYUE8Uq7US81sM',
[server]   posData: null,
[server]   status: 'new',
[server]   btcPrice: '0.00562100',
[server]   btcDue: '0.00562100',
[server]   cryptoInfo:
[server]    [ { cryptoCode: 'BTC',
[server]        paymentType: 'BTCLike',
[server]        rate: 3558.08978812063,
[server]        exRates: [Object],
[server]        paid: '0.00000000',
[server]        price: '0.00562100',
[server]        due: '0.00562100',
[server]        paymentUrls: [Object],
[server]        address: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
[server]        url:
[server]         'https://mainnet.demo.btcpayserver.org/i/BTC/UNgz9TvKFYUE8Uq7US81sM',
[server]        totalDue: '0.00562100',
[server]        networkFee: '0.00000000',
[server]        txCount: 0,
[server]        cryptoPaid: '0.00000000' } ],
[server]   price: 20,
[server]   currency: 'USD',
[server]   exRates: { USD: 0 },
[server]   buyerTotalBtcAmount: null,
[server]   itemDesc: null,
[server]   orderId: null,
[server]   guid: '40d3601a-c8d3-4db4-8c3d-219413566dd8',
[server]   id: 'UNgz9TvKFYUE8Uq7US81sM',
[server]   invoiceTime: 1548039574000,
[server]   expirationTime: 1548040474000,
[server]   currentTime: 1548039574618,
[server]   lowFeeDetected: false,
[server]   btcPaid: '0.00000000',
[server]   rate: 3558.08978812063,
[server]   exceptionStatus: false,
[server]   paymentUrls:
[server]    { BIP21:
[server]       'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
[server]      BIP72: null,
[server]      BIP72b: null,
[server]      BIP73: null,
[server]      BOLT11: null },
[server]   refundAddressRequestPending: false,
[server]   buyerPaidBtcMinerFee: null,
[server]   bitcoinAddress: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
[server]   token: 'H6XLvfeEz2qy1mGcFNvpKK',
[server]   flags: { refundable: false },
[server]   paymentSubtotals: { BTC: 562100 },
[server]   paymentTotals: { BTC: 562100 },
[server]   amountPaid: 0,
[server]   minerFees: { BTC: { satoshisPerByte: 1, totalFee: 0 } },
[server]   exchangeRates: { BTC: { USD: 0 } },
[server]   supportedTransactionCurrencies: { BTC: { enabled: true } },
[server]   addresses: { BTC: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5' },
[server]   paymentCodes:
[server]    { BTC:
[server]       { BIP21:
[server]          'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
[server]         BIP72: null,
[server]         BIP72b: null,
[server]         BIP73: null,
[server]         BOLT11: null } },
[server]   buyer:
[server]    { name: null,
[server]      address1: null,
[server]      address2: null,
[server]      locality: null,
[server]      region: null,
[server]      postalCode: null,
[server]      country: null,
[server]      phone: null,
[server]      email: null } } 'https://mainnet.demo.btcpayserver.org/invoice?id=UNgz9TvKFYUE8Uq7US81sM'




//Passed property id from the create_invoice response above
client.get_invoice('UNgz9TvKFYUE8Uq7US81sM')
  .then(invoice => console.log(invoice))
  .catch(err => console.log(err))


  Received this from get_invoice:
  { url:
    [server]    'https://mainnet.demo.btcpayserver.org/invoice?id=UNgz9TvKFYUE8Uq7US81sM',
    [server]   posData: null,
    [server]   status: 'new',
    [server]   btcPrice: '0.00562100',
    [server]   btcDue: '0.00562100',
    [server]   cryptoInfo:
    [server]    [ { cryptoCode: 'BTC',
    [server]        paymentType: 'BTCLike',
    [server]        rate: 3558.08978812063,
    [server]        exRates: [Object],
    [server]        paid: '0.00000000',
    [server]        price: '0.00562100',
    [server]        due: '0.00562100',
    [server]        paymentUrls: [Object],
    [server]        address: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
    [server]        url:
    [server]         'https://mainnet.demo.btcpayserver.org/i/BTC/UNgz9TvKFYUE8Uq7US81sM',
    [server]        totalDue: '0.00562100',
    [server]        networkFee: '0.00000000',
    [server]        txCount: 0,
    [server]        cryptoPaid: '0.00000000' } ],
    [server]   price: 20,
    [server]   currency: 'USD',
    [server]   exRates: { USD: 0 },
    [server]   buyerTotalBtcAmount: null,
    [server]   itemDesc: null,
    [server]   orderId: null,
    [server]   guid: 'f0dea015-13dc-4579-a181-09ff93ab2d90',
    [server]   id: 'UNgz9TvKFYUE8Uq7US81sM',
    [server]   invoiceTime: 1548039574000,
    [server]   expirationTime: 1548040474000,
    [server]   currentTime: 1548039861712,
    [server]   lowFeeDetected: false,
    [server]   btcPaid: '0.00000000',
    [server]   rate: 3558.08978812063,
    [server]   exceptionStatus: false,
    [server]   paymentUrls:
    [server]    { BIP21:
    [server]       'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
    [server]      BIP72: null,
    [server]      BIP72b: null,
    [server]      BIP73: null,
    [server]      BOLT11: null },
    [server]   refundAddressRequestPending: false,
    [server]   buyerPaidBtcMinerFee: null,
    [server]   bitcoinAddress: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
    [server]   token: '9JNoYKrnFNp3Crysco9hRN',
    [server]   flags: { refundable: false },
    [server]   paymentSubtotals: { BTC: 562100 },
    [server]   paymentTotals: { BTC: 562100 },
    [server]   amountPaid: 0,
    [server]   minerFees: { BTC: { satoshisPerByte: 1, totalFee: 0 } },
    [server]   exchangeRates: { BTC: { USD: 0 } },
    [server]   supportedTransactionCurrencies: { BTC: { enabled: true } },
    [server]   addresses: { BTC: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5' },
    [server]   paymentCodes:
    [server]    { BTC:
    [server]       { BIP21:
    [server]          'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
    [server]         BIP72: null,
    [server]         BIP72b: null,
    [server]         BIP73: null,
    [server]         BOLT11: null } },
    [server]   buyer:
    [server]    { name: null,
    [server]      address1: null,
    [server]      address2: null,
    [server]      locality: null,
    [server]      region: null,
    [server]      postalCode: null,
    [server]      country: null,
    [server]      phone: null,
    [server]      email: null } }


    AFTER THE INVOICE EXPIRED below:::::::
    { url:
[server]    'https://mainnet.demo.btcpayserver.org/invoice?id=UNgz9TvKFYUE8Uq7US81sM',
[server]   posData: null,
[server]   status: 'expired',
[server]   btcPrice: '0.00562100',
[server]   btcDue: '0.00562100',
[server]   cryptoInfo:
[server]    [ { cryptoCode: 'BTC',
[server]        paymentType: 'BTCLike',
[server]        rate: 3558.08978812063,
[server]        exRates: [Object],
[server]        paid: '0.00000000',
[server]        price: '0.00562100',
[server]        due: '0.00562100',
[server]        paymentUrls: [Object],
[server]        address: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
[server]        url:
[server]         'https://mainnet.demo.btcpayserver.org/i/BTC/UNgz9TvKFYUE8Uq7US81sM',
[server]        totalDue: '0.00562100',
[server]        networkFee: '0.00000000',
[server]        txCount: 0,
[server]        cryptoPaid: '0.00000000' } ],
[server]   price: 20,
[server]   currency: 'USD',
[server]   exRates: { USD: 0 },
[server]   buyerTotalBtcAmount: null,
[server]   itemDesc: null,
[server]   orderId: null,
[server]   guid: '70938452-b58c-4bab-ab7f-85c846aa69cb',
[server]   id: 'UNgz9TvKFYUE8Uq7US81sM',
[server]   invoiceTime: 1548039574000,
[server]   expirationTime: 1548040474000,
[server]   currentTime: 1548040770620,
[server]   lowFeeDetected: false,
[server]   btcPaid: '0.00000000',
[server]   rate: 3558.08978812063,
[server]   exceptionStatus: false,
[server]   paymentUrls:
[server]    { BIP21:
[server]       'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
[server]      BIP72: null,
[server]      BIP72b: null,
[server]      BIP73: null,
[server]      BOLT11: null },
[server]   refundAddressRequestPending: false,
[server]   buyerPaidBtcMinerFee: null,
[server]   bitcoinAddress: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5',
[server]   token: 'Bizwv1cH35SeSX8nS2WZpQ',
[server]   flags: { refundable: false },
[server]   paymentSubtotals: { BTC: 562100 },
[server]   paymentTotals: { BTC: 562100 },
[server]   amountPaid: 0,
[server]   minerFees: { BTC: { satoshisPerByte: 1, totalFee: 0 } },
[server]   exchangeRates: { BTC: { USD: 0 } },
[server]   supportedTransactionCurrencies: { BTC: { enabled: true } },
[server]   addresses: { BTC: '3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5' },
[server]   paymentCodes:
[server]    { BTC:
[server]       { BIP21:
[server]          'bitcoin:3DKpScvWHHJyeX6AYH9DFUxsqeoYfNYEE5?amount=0.00562100',
[server]         BIP72: null,
[server]         BIP72b: null,
[server]         BIP73: null,
[server]         BOLT11: null } },
[server]   buyer:
[server]    { name: null,
[server]      address1: null,
[server]      address2: null,
[server]      locality: null,
[server]      region: null,
[server]      postalCode: null,
[server]      country: null,
[server]      phone: null,
[server]      email: null } }

    */