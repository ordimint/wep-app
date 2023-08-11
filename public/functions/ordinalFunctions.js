const axios = require('axios');

async function getContentType(inscriptionID) {
    try {
        const response = await fetch(`https://ordapi.xyz/inscription/${inscriptionID}`)
        const responseJSON = await response.json()
        if (responseJSON) {
            const contentType = responseJSON.content_type
            // console.log(contentType)
            return contentType
        }
    } catch (error) {
        console.log(error)
        return error
    }
}





async function getInscriptionData(utxo) {

    try {
        const response = await axios.get(`https://ordapi.xyz/output/${utxo.txid}:${utxo.vout}`);
        console.log(response)
        const inscriptionPerOutput = response.data;
        console.log(response.data)
        if (!inscriptionPerOutput.inscriptions) {
            console.error("Inscriptions not found in response:", inscriptionPerOutput);
            return;
        }

        const response2 = await axios.get(`https://ordapi.xyz${inscriptionPerOutput.inscriptions}`);
        return response2.data;
    } catch (e) {
        console.error("There was an error fetching the data:", e.message);
        console.error(e);
    }
}




async function getInscriptionNumber(inscriptionID) {
    let inscriptionNumber
    try {
        const response = await fetch(`https://ordapi.xyz/inscription/${inscriptionID}`)
        const responseJSON = await response.json()
        // console.log(responseJSON)
        inscriptionNumber = responseJSON.data.inscription_Number
        // console.log(inscriptionNumber)
    } catch (error) {
        console.log(error)
        return error
    }
    if (inscriptionNumber) {
        return inscriptionNumber
    }
}

function parseTextInscription(jsonStr) {
    let jsonObj;

    // Try parsing the JSON string
    try {
        jsonObj = JSON.parse(jsonStr);
    } catch (e) {
        // If an error is thrown, the JSON is invalid, so just return the original string
        return jsonStr;
    }

    // Handle different p flags
    switch (jsonObj.p) {
        case "ons":
            return {
                pFlag: "ons",
                op: jsonObj.op,
                title: jsonObj.title,
                url: jsonObj.url,
                author: jsonObj.author,
                body: jsonObj.body
            };

        case "sns":
            return {
                pFlag: "sns",
                op: jsonObj.op,
                name: jsonObj.name
            };

        case "brc-20":
            switch (jsonObj.op) {
                case "deploy":
                    return {
                        pFlag: "brc-20",
                        op: jsonObj.op,
                        tick: jsonObj.tick,
                        max: jsonObj.max,
                        lim: jsonObj.lim
                    };
                // ... handle other brc-20 ops if they exist
                default:
                    return {
                        pFlag: "brc-20",
                        op: jsonObj.op,
                        tick: jsonObj.tick,
                        amt: jsonObj.amt
                    };
            }
        case "tap":
            switch (jsonObj.op) {
                case "token-send":
                    return {
                        pFlag: "tap",
                        op: jsonObj.op,
                        items: jsonObj.items
                    };
                case "token-deploy":
                case "token-mint":
                case "token-transfer":
                    return {
                        pFlag: "tap",
                        op: jsonObj.op,
                        tick: jsonObj.tick,
                        amt: jsonObj.amt || null,  // only present in some operations
                        max: jsonObj.max || null,  // only present in token-deploy
                        lim: jsonObj.lim || null   // only present in token-deploy
                    };
                default:
                    return jsonStr;  // or some default object for unrecognized operations
            }

        default:
            // If p flag is not recognized, return the original string
            return jsonStr;
    }
}




export { getInscriptionNumber, getInscriptionData, getContentType, parseTextInscription }
