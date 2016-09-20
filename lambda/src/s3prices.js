
export function parseS3Prices(data) {
    console.log('S3 Products');
    for (let [sku, detail] of Object.entries(data.products)) {
        console.log(sku);
        const pf = detail.productFamily;
        const region = detail.attributes.fromLocation;
        
    }
    //console.log(data.products)
}
