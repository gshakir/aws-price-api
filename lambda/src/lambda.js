import axios from 'axios'

export async function myHandler(ev1, context) {
                    //.then(response => console.log(response.data))
                    //.then((some) => setTimeout( () => console.log("times up"), 20000));


    const p = await getPricingOffers();
    console.log("Hello from lambda");
    console.log(p);
}

function getPricingOffers() {
    return axios.get('https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/index.json')
                .then(response => console.log(response.data))
                .then((some) => setTimeout( () => console.log("times up"), 2000))
                .catch(err => console.log(err))
}
