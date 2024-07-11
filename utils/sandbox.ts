import BlueBird from "bluebird";
import BettermodeService from '../service/bettermode-service.js'

new BlueBird(async (resolve, reject) => {
}).then((result) => {
    if (result) {
        console.log(result);
    }
    process.exit(0);
});