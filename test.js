console.log(10)
console.log((BigInt(10)).toString())
console.log((BigInt(10) / BigInt(100)).toString() )

console.log(convertToWei(0.749))


function convertToWei(number) {
    let bigNumber = number * 1000000000000000000n
    return bigNumber
}


async function addOffer(bidId, kpiValues) {
    for(let i = 0; i < kpiValues.length; i++) {
        kpiValues[i] = provider.utils.toWei(kpiValues[i].toString(), "ether")
    }
    result = await contracts.bids.contract.methods.addOffer(bidId, kpiValues).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    
}

async function addOfferToKpi(rfqNo, kpiValues) {
    let rfqs = await getRfqs([rfqNo])
    let rfq = rfqs[0]
    let rfqKpiIds = rfq.rfqKpiIds
    
    for(let i = 0; i < rfqKpiIds.length; i++) {
        result = await contracts.bids.contract.methods.addOfferToKpi(rfqKpiIds[i], kpiValues[i]).send({
            from: getCurrentUser(),
            gas: 1000000,
            gasPrice: 10000000000,
        })
    }
}

async function scoreBids(rfqNo) {

}