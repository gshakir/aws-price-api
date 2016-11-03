import axios from 'axios'
import { parseS3Prices } from './s3prices'

const pricingUrl = 'https://pricing.us-east-1.amazonaws.com'
const pricingIndex = '/offers/v1.0/aws/index.json'

let priceParsers = new Map()
priceParsers.set("AmazonS3", parseS3Prices)

export async function myHandler(ev1, context) {

    //.then(response => console.log(response.data))
    //.then((some) => setTimeout( () => console.log("times up"), 20000));

    const prices = await getPricingOffers();
    const pricingOffers =  getOffersForEachProduct(prices)

    const promises = pricingOffers.map(p => p.data);
    const waitForAll = await Promise.all(promises);

    console.log("Hello from lambda end");
    promises[0].then(r => { 
                        console.log("Promise data");
                        console.log(r.get('US West \(Oregon\)').get('Standard'));
                    });
}


function getOffersForEachProduct(prices) {
    console.log("mapping");
    const newarr =  prices.map(price =>  { 
                        console.log(price)
                        const parser = priceParsers.get(price.product)

                        console.log("parser");
                        console.log(parser);
                        const p = axios.get(pricingUrl + price.url)
                                       .then((response) => parser(response.data))
                                       .catch(err => console.log(err))

                        const ret =  { product: price.product, data: p} 
                        return ret;
    });
    return newarr
}

function getPricingOffers() {
    return axios.get(pricingUrl + pricingIndex)
                .then(response => {
                        let prices = []
                        for (let [product, details] of Object.entries(response.data.offers)) {
                            if (product !== 'AmazonS3')
                                continue;
                            console.log(product)
                            prices.push({product: product, url: details.currentVersionUrl})
                        }
                        return prices
                })
                .catch(err => console.log(err))
}
