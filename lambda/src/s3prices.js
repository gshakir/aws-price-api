import fs from 'fs'

export function parseS3Prices(data) {
    console.log('S3 Products');
    let pricesByRegion = {}

    for (let [sku, detail] of Object.entries(data.products)) {
        if (detail.productFamily != 'Storage') 
            continue;
        parseS3StoragePrices(sku, detail, pricesByRegion);
        populatePriceDimensions(data, pricesByRegion);
    }
    fs.writeFileSync('s3storage.json', JSON.stringify(pricesByRegion,null, 4));
    return pricesByRegion;
}


function parseS3DataTransferPrices(sku, detail, pricesByRegion) {
}

function parseS3StoragePrices(sku, detail, pricesByRegion) {
    const pf = detail.productFamily;
    const region = detail.attributes.location;
    const storageClass = detail.attributes.volumeType;
    const item =  {sku: sku, pf: pf, region: region, storageClass: storageClass};

    let regionPrices = {}
    let regionPricesByStorageClass = []
    if (pricesByRegion.hasOwnProperty(region)) {
        regionPrices = pricesByRegion[region]
    }
    else {
        pricesByRegion[region] = regionPrices;

    }

    if (regionPrices.hasOwnProperty(storageClass)) {
        regionPricesByStorageClass = regionPrices[storageClass];
    }
    else {
        regionPrices[storageClass] = regionPricesByStorageClass;
    }

    regionPricesByStorageClass.push(item)
}

function populatePriceDimensions(data, pricesByRegion) {
    for (let [region, regionPrices] of Object.entries(pricesByRegion)) {
        for (let [st, prices] of Object.entries(regionPrices)) {
            for (let price of prices) {
                const sku = price.sku
                const skuData = data.terms.OnDemand[sku]
                const prices = getPriceDimensions(skuData);
                price.prices = prices
            }
        }
    }

    return pricesByRegion;
}

function getPriceDimensions(skuData) {
    let priceDimensions = []
    for (let [sku, pricedata] of Object.entries(skuData)) {
        for (let[pdk, data] of Object.entries(pricedata.priceDimensions)) {
            let pdata = { begin: data.beginRange, end: data.endRange, unit: data.unit, price: data.pricePerUnit.USD}
            priceDimensions.push(pdata);
        }
    }
    return priceDimensions;
}
