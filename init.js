/*
This file is intended to deploy the smart contract and populate it with data so it is easy to interact with it for testing and demonstration purposes 
without having to make so many inputs on each new dpeloyment.
*/
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require("fs")

const KPIs = new Map()

const kpiNames = {
    price: "Price",
    downPayment: "Down Payment",        
    installments: "Installments", //The less, the more agile
    qms: "QMS",
    leadTime: "LeadTime", //The less, the more agile
    transportationCost: "Transportation Cost",
    transportationLeadTime: "Transportation Lead Time",
    freeWarranty: "Free Warranty",
    paidWarranty: "Paid Warranty",
    warrantyCost: "Warranty Year Cost",
    gasEmissions: "Gas Emissions",
    energyConsumption: "Energy Consumption",
    ems: "EMS",
    wasteManagement: "WasteManagement",
    ohms: "OHMS",
    hrPolicy: "HR Policy",
    infoDisclosure: "Information Disclosure Agreement",
    socialInitiatives: "Social Responsibility Initiatives",
    customizations: "Customizations",
    infoSharing: "Information Sharing", 
    productionPolicy: "Production Policy", 
    productionPlan: "Production Plan & Forecast", 
    inventory: "Inventory", 
    productionCapacity: "Production Capacity",
    sellerRating: "Seller Rating",
    buyerRating: "Buyer Rating",
    afterSaleRating: "After-Sale Service Rating"
}

KPIs.set(
    "Economic", 
    [
        kpiNames.price,
        kpiNames.downPayment,
        kpiNames.installments, //The less, the more agile
        kpiNames.qms,
        kpiNames.leadTime, //The less, the more agile
        kpiNames.transportationCost,
        kpiNames.transportationLeadTime,
        kpiNames.freeWarranty,
        kpiNames.paidWarranty,
        kpiNames.warrantyCost,
    ]
)

KPIs.set(
    "Environmental", 
    [
        kpiNames.gasEmissions,
        kpiNames.energyConsumption,
        kpiNames.ems,
        kpiNames.wasteManagement
    ]
)

KPIs.set(
    "Social", 
    [
        kpiNames.ohms,
        kpiNames.hrPolicy,
        kpiNames.infoDisclosure,
        kpiNames.socialInitiatives
    ]
)

KPIs.set(
    "Leagile", 
    [
        kpiNames.customizations,
        kpiNames.infoSharing, 
        kpiNames.productionPolicy, 
        kpiNames.productionPlan, 
        kpiNames.inventory, 
        kpiNames.productionCapacity
    ]
)


KPIs.set(
    "Reputation", 
    [
        kpiNames.sellerRating,
        kpiNames.afterSaleRating,
        kpiNames.buyerRating
    ]
)

var kpis = []
var kpiGroups = []

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", 
    "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", 
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
    "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", 
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", 
    "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", 
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", 
    "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
    "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", 
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", 
    "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
    "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
    "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", 
    "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", 
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", 
    "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", 
    "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", 
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

const usersData = []
const productsData = []
const noBuyers = 1
const noSellers = 4
const noProductsPerSeller = {min: 5, max: 5}
const noVerifiedUsers = 11

const noRfqsPerBuyer = { min: 1, max: 1 }
const noProductsPerRfq =  { min: 5, max: 5 }
const noKpisPerRfq =  { min: 26, max: 26 } //max cannot be more than kpis.length

const noBidsPerRFQ = { min: 4, max: 4 }
const noFilesPerBid = { min: 5, max: 14 }

const feesPerGas = 20 //In Gwei

//specify number of rfqs you want to be procesesed according to each path; eg: if path1 = 2, then 2 of the rfqs that were added will be processed according to path1; 
//total number of paths must equal total number of rfqs added
const auctionPaths = {
    path1: 0, //PATH 1: RFQ TO WINNER TO COMPLETED
    path2: 0, //PATH 2: RFQ TO MANUAL SCORES TO WINNER TO COMPLETED
    path3: 0, //PATH 3: RFQ TO AUCTION TO WINNER TO COMPLETED
    path4: 0, //PATH 4: RFQ TO AUCTION TO AUCTION TO WINNER TO COMPLETED
    path5: 1, //PATH 5: RFQ TO AUCTION TO AUCTION TO MANUAL SCORES TO WINNER TO COMPLETED
    path6: 0, //PATH 6: RFQ TO WINNER TO WINNER WITHDRAWN TO COMPLETED
    path7: 0, //PATH 7: RFQ TO WINNER TO TO CANCELED
    path8: 0  //PATH 8: (REQUIRES MIN OF 5 BIDS)RFQ TO AUCTION * 3 (1 OFFER, 3 OFFERS,  1 OFFERS) TO MANUAL SCORES TO WINNER
}

const txReceipts = new Map()

const steps = {
    authorityAccount: true,
    userProductContracts: true,
    userRegistration: true,
    rfqsContract: true,
    addingRfqs: true,
    bidsContract: true,
    addingBids: true,
    addingAuctions: true,
    calculateStats: true
    
}

const logs = {
    authorityAccount: true,
    contractDeployment: true,
    userRegistration: true,
    addingRfqs: true,
    addingRfqProducts: true,
    addingRfqKpis: true,
    addingBids: true,
    addingBidsVerbose: true,
    addingAuctions: true,
    auctionLogActions: true,
    auctionLogUsers: false,
    auctionLogStatuses: true,
    auctionLogBids: true,
    auctionLogOffers: false,
    auctionSaveBidLogs: true,
    calculateStats: true
}

const USER_TYPE = {
    BUYER: 0,
    SELLER: 1
}




const networkURL = "http://localhost:7545"   // "http://192.168.8.159:4792"
const provider = new Web3(new Web3.providers.HttpProvider(networkURL))
provider.eth.Contract.handleRevert = true

const mainUserAccounts = {
    authorityAccount: "",
    currentUser: ""
}

const contracts = {
    init: {
        contractName: "InitializeService",
        contractAddress: "",
        txHash: ""
    },
    users: {        
        contractName: "Users",
        contractAddress: "",
        txHash: ""
    },
    products: {
        contractName: "Products",
        contractAddress: "",
        txHash: ""

    },
    rfqs: {
        contractName: "RFQs",
        contractAddress: "",
        txHash: ""
    },
    bids: {
        contractName: "Bids",
        contractAddress: "",
        txHash: ""
    }
}

const ACTIONS = {
    ADD_RFQ: 0,
    OPEN_BIDDING: 1,
    SUBMIT_BID: 2,
    CLOSE_BIDDING: 3,
    OPEN_AUCTION: 4,
    SUBMIT_OFFER: 5,
    CLOSE_AUCTION: 6,
    DECLARE_WINNER: 7,
    CANCEL_RFQ: 8,
    WITHDRAW_BID: 9,
    RATE_SELLER: 10,
    RATE_BUYER: 11,
    RATE_AFTER_SALE: 12,
    COMPLETE_RFQ: 13,
    CANCEL_RFQ: 14,
    UPDATE_SCORES_MANUALLY: 15
}



const SCORE_RULE= {
    ASCENDING: 0, 
    DESCENDING: 1
}  //Descending means largest value gets highest score; Ascending means lowest value gets highest score
const RFQ_STATUS = {
    NEW: 0, 
    BIDDING_OPEN: 1,
    REVIEWING_BIDS: 2, 
    AUCTION_BIDDING_OPEN: 3, 
    AUCTION_REVIEWING_BIDS: 4,
    WINNER_DECLARED: 5,
    CANCELED: 6,
    WIINNER_WITHDRAWN: 7,
    RATINGS: 8,
    COMPLETED: 9
}
const BID_STATUS = { 
    NEW: 0,
    SUBMITTED: 1,
    AUCTION_WON: 2,
    AUCTION_LOST: 3,
    AUCTION_COUNTEROFFER: 4,
    AWARDED: 5,
    LOST: 6,
    WITHDRAWN: 7,
    SELLER_RATED: 8,
    BUYER_RATED: 9,
    AFTER_SALE_RATED: 10,
    RFQ_COMPLETED: 11,
    RFQ_CANCELED: 12,
}

const BID_FILE_TYPE = {    
    QMS_CERTIFICATE: 0,
    EMISSIONS_AUDIT_REPORT: 1,
    ENERGY_CONSUMPTION_REPORT: 2,
    EMS_CERTIFICATE: 3,
    WASTE_MANAGEMENT_POLICY: 4,
    OHSMS_CERTIFICATE: 5,
    HR_POLICY: 6,
    INFORMATION_DISCLOSURE_AGREEMENT: 7,
    SOCIAL_RESPONSIBILITY_PROOF: 8,
    INFORMATION_SYSTEM_SPECS: 9,
    PRODUCTION_POLICY: 10,
    PRODUCTION_PLAN: 11,
    INVENTORY_SHEET: 12,
    MACHINE_SPECS: 13,
    ORGANIGRAM: 14
}

var noRfqsAdded = 0


init()



//SIMULATION FUNCTIONS
//===========================================================================================================================================================



async function init() {

    //check network connection

    //set authority
    steps.authorityAccount && console.log("\nSETTING AUTHORITY ACCOUNT")
    steps.authorityAccount && logs.authorityAccount && console.log("========================")
    steps.authorityAccount && await setAuthorityAccount()
    
    //deploy users
    steps.userProductContracts && console.log("\nDEPLOYING CONTRACT: USERS, PRODUCTS")
    steps.userProductContracts && logs.contractDeployment && console.log("========================================")
    steps.userProductContracts && await deployContract(contracts.users)
    steps.userProductContracts && await deployContract(contracts.products)

    //register users (user, products)
    steps.userRegistration && console.log(`\nREGISTERING USERS: ${noBuyers} BUYERS, ${noSellers} SELLERS (${noProductsPerSeller.min} to ${noProductsPerSeller.max} PRODUCTS PER SELLER)`)
    steps.userRegistration && logs.userRegistration && console.log("=========================================================================")
    steps.userRegistration && await registerUsers()

    //deploy rfqs, assign to users
    steps.rfqsContract && console.log("\nDEPLOYING CONTRACT: RFQS")
    steps.rfqsContract && logs.contractDeployment && console.log("==============================")
    steps.rfqsContract && await deployContract(contracts.rfqs, [contracts.users.contractAddress, contracts.products.contractAddress])
    steps.rfqsContract && await setRfqsContract(contracts.rfqs.contractAddress)
    
    //add rfqs
    steps.addingRfqs && console.log(`\nADDING RFQS: ${noRfqsPerBuyer.min} to ${noRfqsPerBuyer.max} RFQS PER BUYER (${noProductsPerRfq.min} to ${noProductsPerRfq.max} PRODUCTS, AND, ${noKpisPerRfq.min} to ${noKpisPerRfq.max} KPIS, PER RFQ) `)
    steps.addingRfqs && logs.addingRfqs && console.log("=====================================================================================")
    steps.addingRfqs && await addRfqs()

    //deploy bids, assign to users
    steps.bidsContract && console.log("\nDEPLOYING CONTRACT: BIDS")
    steps.bidsContract && logs.contractDeployment && console.log("==============================")
    steps.bidsContract && await deployContract(contracts.bids, [contracts.users.contractAddress, contracts.products.contractAddress, contracts.rfqs.contractAddress])
    steps.bidsContract && await setBidsContract(contracts.bids.contractAddress)

    //add bids
    steps.addingBids && console.log(`\nADDING BIDS FOR ${noRfqsAdded} RFQs `)
    steps.addingBids && logs.addingBids && console.log("=====================================================================")
    steps.addingBids && await addBids()

    //add auctions
    steps.addingAuctions && console.log(`\nADDING AUCTIONS `)
    steps.addingAuctions && logs.addingBids && console.log("=================================================")
    steps.addingAuctions && await addAuctions()

    //calculate consumption and other stats
    steps.calculateStats && console.log(`\nCALCULATING STATS `)
    steps.calculateStats && logs.calculateStats && console.log("=================================================")
    steps.calculateStats && await calculateStats()

    //auto-pilot
    
}

async function setAuthorityAccount() {
    let accounts = await provider.eth.getAccounts()
    mainUserAccounts.authorityAccount = accounts[0]
    logs.authorityAccount && console.log(`Authority account set: ${mainUserAccounts.authorityAccount}`)
    return true
}

function getAuthorityAccount() {
    return mainUserAccounts.authorityAccount
}

async function setAsCurrentUser(userAddress) {
    mainUserAccounts.currentUser = userAddress
    
    //await provider.eth.personal.unlockAccount(userAddress, "1234", 100000)
    return true
}

function getCurrentUser(name = false) {
    if(name) {
        let userName = getUserNameByAddress(mainUserAccounts.currentUser)
        return userName
    }
    return mainUserAccounts.currentUser
}

function getUserNameByAddress(address) {
    for(let i = 0; i < usersData.length; i++) {
        let userAddress = usersData[i].userAddress
        if(userAddress == address) {
            let name = usersData[i].name
            return name
        }
    }
}

async function registerUsers() {
    let usersCSV = await readCsvFile("users")
    let productsCSV = await readCsvFile("products")
    //create an {} for each user that has the full struct contents & assign data from csv to it & push to the global users array
    for(let i = 1; i < usersCSV.length; i++) {
        let userCSV = usersCSV[i]
        let user = {}
        user["userType"] = userCSV[0]
        user["name"] =  userCSV[1]
        user["contactDetails"] =  userCSV[2]
        user["userAddress"] = ""
        user["productBarcodes"] = []
        user["verified"] = false
        user["registered"] = false //this is just to indicate whether user was registered as a part of this script; this value isn't stored on the blockchain
        usersData.push(user)
    }

    //create an {} for each product with struct data members + assign data to it & push to the global products array
    //the -1 in the stop condition is to prevent reading the last row because sometimes it's being considered a product even though no data is in it
    for(let i = 1; i < productsCSV.length-1; i++) {
        let productCSV = productsCSV[i]
        let product = {}
        product["barcode"] = productCSV[0]
        product["productName"] =  productCSV[1]
        product["specsURI"] =  ""
        product["suppliers"] = []
        productsData.push(product)
    }

    //register buyers
    let noRegisteredBuyers = 0
    logs.userRegistration && console.log("\nBUYERS\n---------")
    for(let i = 0; i < usersData.length; i++) {
        let user = usersData[i]
        if((user.userType == USER_TYPE.BUYER) && (user.registered == false)) {

            let userAddress = await getGanacheAccount()
            await setAsCurrentUser(userAddress)
            user.userAddress = userAddress

            let products = []
            let result = await registerUser(user.userType, user.name, user.contactDetails, user.productBarcodes, products) //userType, name, contactDetails, productBarcodes, product
            user.registered = true
            noRegisteredBuyers++
            //console.log(result)
            logs.userRegistration && console.log(`${user.name} (${user.userAddress})`)
        }
        if(noRegisteredBuyers == noBuyers) {
            break
        }
    }
    logs.userRegistration && console.log(`Successfully registered ${noRegisteredBuyers} out of ${noBuyers} buyers`)

    //register sellers with a number of products
    let noRegisteredSellers = 0
    logs.userRegistration && console.log("\nSELLERS AND PRODUCTS\n--------------------")
    for(let i = 0; i < usersData.length; i++) {
        let user = usersData[i]
        if((user.userType == USER_TYPE.SELLER) && (user.registered == false)) {

            let userAddress = await getGanacheAccount()
            await setAsCurrentUser(userAddress)
            user.userAddress = userAddress

            let products = []
            //choosing how many products to add for this seller
            let noProducts = randomIntFromInterval(noProductsPerSeller.min, noProductsPerSeller.max)
            for(let j = 0; j < noProducts; j++) {
                //choosing at random which product to pick for this seller from the list of all products
                let productsIndex = randomIntFromInterval(0, productsData.length-1) //the -1 because sometimes the last row contains nothing but is parsed anyway
                products.push(productsData[productsIndex])
                user.productBarcodes.push(productsData[productsIndex].barcode)
                productsData[productsIndex].suppliers.push(getCurrentUser())
                //console.log(productsIndex)
            }
            //console.log(products.length)
            await registerUser(user.userType, user.name, user.contactDetails, user.productBarcodes, products) //userType, name, contactDetails, productBarcodes, product
            user.registered = true
            user["products"] = products
            noRegisteredSellers++
            logs.userRegistration && console.log(`${user.name} (${user.userAddress})`)
            //console.log(result)
        }
        if(noRegisteredSellers == noSellers) {
            break
        }
    }
    logs.userRegistration && console.log(`Successfully registered ${noRegisteredSellers} out of ${noSellers} sellers `)

    //toggle verify

    await setAsCurrentUser( getAuthorityAccount() )

    logs.userRegistration && console.log("\nVERIFYING\n---------")
    let noRegisteredVerifiedUsers = 0
    for(let i = 0; i < usersData.length; i++) {
        let user = usersData[i]
        if(user.registered == true) {
            let userAddress = user.userAddress
            let result = await toggleVerify(userAddress)
            user.verified = !user.verified
            noRegisteredVerifiedUsers++
        }
        if(noRegisteredVerifiedUsers == noVerifiedUsers) {
            break
        }
    }
    logs.userRegistration && console.log(`Successfully verified ${noRegisteredVerifiedUsers} out of ${noVerifiedUsers} users `)

    //let contractUsers = await getUsers()
    //console.log(contractUsers)


}

async function addRfqs() {
    logs.addingRfqs && console.log(`\nInitializing KPIs\n---------------------------------------`)
    await initKpis()
    kpis = await getKpis() //This reutrns a 2-dimentional array; instantiated here to avoid instantiation each time
    kpiGroups = await getKpiGroups()
    //console.log("kpis", kpis)
    //console.log("kpiGroups", kpiGroups)
    //add rfqs with sellers to ensure that the guard is working; try adding rfqs with non-verified users, or non users at all

    //add rfqs with buyers
    //pick a random buyer, add a number of rfqs with him, then pick another buyer, until all buyers are passed over
    for(let i = 0; i < usersData.length; i++) {
        let user = usersData[i]
        //if the user is a buyer and verified, then we add rfqs for him
        if(user.verified && user.registered && user.userType == USER_TYPE.BUYER) {
            //console.log("processing user", user.userAddress)

            let noRfqsAddedPerSeller = 0
            //decide the number of rfqs to be added for this buyer
            let noRfqsToBeAdded = randomIntFromInterval(noRfqsPerBuyer.min, noRfqsPerBuyer.max)
            //set current user to the buyer's account
            await setAsCurrentUser(user.userAddress)
            logs.addingRfqs && console.log(`\nAdding RFQs for seller: ${user.name}\n---------------------------------------`)

            for(let k = 0; k < noRfqsToBeAdded; k++) {
    
                //add rfq object
                let docURI = `www.ipfs.io/${ getRandomString() }`
                let externalId = getRandomString()
                logs.addingRfqs && console.log(`Adding RFQ #${k+1}`)

                //we need externalId because we cannot get the RFQNo by executing addRFQ; so that's the only way we can tell which RFQ we can associate this with. Perhaps I can implement
                await addRfq(docURI, externalId)
    
                //getting the rfq's record with the rfqNo using the externalId
                let rfqFromContract = await getRfqByExternalId(externalId)
                await addRfqNoToUser(user.userAddress, rfqFromContract.rfqNo)
                
                //add the rfq's products
                let addedRfqProducts = 0
                let noSuppliersProcessed = 0
                let noRfqProductsToBeAdded = randomIntFromInterval(noProductsPerRfq.min, noProductsPerRfq.max)

                let productIndex = 0
                while(addedRfqProducts < noRfqProductsToBeAdded) {
                    let product = productsData[productIndex]
                    if(product.suppliers.length > 0) {
                        
                        let quantity = randomIntFromInterval(200, 2500)
                        let idealLeadTime = randomIntFromInterval(7, 30)
                        let idealShippingTime = randomIntFromInterval(1, 15)
                        let country = countries[ randomIntFromInterval(0, 194) ]
                        await addRfqProduct(parseInt(rfqFromContract.rfqNo), product.barcode, quantity, country, idealLeadTime, idealShippingTime)
                        addedRfqProducts++
                    }
                    productIndex++
                    if(productIndex >= productsData.length) {
                        break
                    }
                }
/*
                for(let j = i; j < usersData.length; j++) {
                    let user= usersData[j]
                    if(user.verified && user.registered && user.userType == USER_TYPE.SELLER) {
                        let products = user.products
                        for(let k = 0; k < products.length; k++) {
                            let product = products[k]
                            let quantity = randomIntFromInterval(200, 2500)
                            let idealLeadTime = randomIntFromInterval(7, 30)
                            let idealShippingTime = randomIntFromInterval(1, 15)
                            let country = countries[ randomIntFromInterval(0, 194) ]
                            await addRfqProduct(parseInt(rfqFromContract.rfqNo), product.barcode, quantity, country, idealLeadTime, idealShippingTime)
                            addedRfqProducts++
                        }
                        noSuppliersProcessed++
                    }
                    //the >= guarantees that at lest the products of one supplier are added
                    if(noSuppliersProcessed == noBidsPerRFQ) {
                        break
                    }
                }*/
                /*
                //add the rfq's products (more suitable for multi-supplier mode)
                //let addedRfqProducts = 0
                //let noRfqProductsToBeAdded = randomIntFromInterval(noProductsPerRfq.min, noProductsPerRfq.max)
                for(let j = 0; j < productsData.length; j++) {
                    let product = productsData[j]
                    if(product.suppliers.length > 0) {
                        
                        let quantity = randomIntFromInterval(200, 2500)
                        let idealLeadTime = randomIntFromInterval(7, 30)
                        let idealShippingTime = randomIntFromInterval(1, 15)
                        let country = countries[ randomIntFromInterval(0, 194) ]
                        await addRfqProduct(parseInt(rfqFromContract.rfqNo), product.barcode, quantity, country, idealLeadTime, idealShippingTime)
                        addedRfqProducts++
                    }
                    if(addedRfqProducts == noRfqProductsToBeAdded) {
                        break
                    }
                }
                */
                logs.addingRfqProducts && console.log(`Successfully added ${addedRfqProducts} out of ${noRfqProductsToBeAdded} products for RfqNo #${rfqFromContract.rfqNo}, user ${ getCurrentUser() } `)
                
                //add the rfq's KPIs
                let addedRfqKpis = 0
                let totalRfqKpisToAdd = randomIntFromInterval(noKpisPerRfq.min, noKpisPerRfq.max)
                
                let weight = {
                    totalWeight: 1, //cannot start at 0 because 
                    getWeight: function() {
                        //let upperInterval = Math.round( (1000 / totalRfqKpisToAdd) ) //dividing weight evenly across all kpis so we get as many of the criteria as possible added and try to avoid the isValid condition
                        let weight = Math.round( (1000 / totalRfqKpisToAdd) )//randomIntFromInterval(1, upperInterval)
                        this.totalWeight += weight
                        return weight
                    },
                    isValid: function() {
                        return this.totalWeight <= 1000
                    }
                }
                for(let j = 0; j < kpis.length; j++) {
                    let kpiGroupId = j
                    let kpiGroup = kpiGroups[kpiGroupId]
                    for(let k = 0; k < kpis[j].length; k++) {
                        let kpiId = k
                        let kpi = kpis[kpiGroupId][kpiId]

                        //let kpiGroupWeight = weight.getGroupWeight()
                        let kpiWeight = weight.getWeight()
                        if(!weight.isValid()) {
                            logs.addingRfqKpis && console.log(`Adding KPIs stopped at "${kpiGroupId}. ${kpiGroup}/${kpiId}. ${kpi}" because its weight is ${kpiWeight}, which will make totalWeight ${weight.totalWeight}`)
                            break
                        }

                        let scoreRule = getScoreRule(kpi)
                        let comments = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        
                        await addRfqKpi(parseInt(rfqFromContract.rfqNo), kpiGroupId, kpiId, kpiWeight, scoreRule, comments)
                        addedRfqKpis++

                        if(addedRfqKpis == totalRfqKpisToAdd) {
                            //console.log("addedRfqKpis == totalRfqKpisToAdd", addedRfqKpis, totalRfqKpisToAdd)
                            break
                        }

                        
                    }

                }
                logs.addingRfqKpis && console.log(`Successfully added ${addedRfqKpis} out of ${totalRfqKpisToAdd} KPIs for RfqNo #${rfqFromContract.rfqNo}, user ${ getCurrentUser() } `)
                
                noRfqsAdded++
            }
        }

        /*
        if(noRfqsAdded == noRfqs) {
            break
        }*/
    }    

    //let rfqs = await getRfqs([], true)
    //let rfq = rfqs[0]
    //console.log("rfqs", rfqs[0])
    logs.addingRfqs && console.log(`Successfully added ${noRfqsAdded} RFQs`)

    //add rfq products
}

async function addBids() {
    let kpis = await getKpis()
    //get rfqs
    let rfqs = await getRfqs()
    //for each rfq, find suppliers that offer "all" products of th rqf, and submit a bid for them (bid+matrix, products, bid files)
    let noBidsAdded = 0
    for(let i = 0; i < rfqs.length; i++) {
        let rfq = rfqs[i]
        let rfqKpiIds = rfq.rfqKpiIds
        let rfqProductIds = rfq.rfqProductIds
        logs.addingBids && console.log(`\nAdding bids for RFQ #${rfq.rfqNo}\n---------------------------------------`)

        let noAddedBidsForRfq = 0
        for(let j = 0; j < usersData.length; j++) {
            let user = usersData[j]
            if(user.verified && user.registered && user.userType == USER_TYPE.SELLER) {
                if(canBid(user, rfq)) {

                    await setAsCurrentUser(user.userAddress)

                    logs.addingBids && console.log(`\nAdding Bid #${noAddedBidsForRfq+1} (by seller ${user.name})`)

                    //adding the bid object
                    let externalId = getRandomString()

                    /*let kpiValues = []
                    for(let k = 0; k < rfqKpiIds.length; k++) {
                        let rfqKpi = await getRfqKpi(rfqKpiIds[k])
                        let value = getKpiValue()
                        kpiValues.push(value) //this is pushed to the index in rfq.rfqKpiIds that corresponds rfqKpi, which has references to the kpiGroup and the kpiName
                    }*/
                    //console.log("kpiValues", kpiValues)
                    await addBid(rfq.rfqNo, externalId)
                    let bid = await getBidByExternalId(externalId)
                    
                    await addBidIdToUser(user.userAddress, bid.bidId)
                    
                    //adding the bid products (# bid products = # rfq products)
                    for(let k = 0; k < rfqProductIds.length; k++) {
                        let rfqProduct = await getRfqProduct(rfqProductIds[k])
                        
                        let bidId = bid.bidId
                        let rfqProductId = rfqProduct.rfqProductId
                        let pricePerUnit = randomIntFromInterval(1, 100)
                        let leadTime = randomIntFromInterval( getLeadTime(rfqProduct.idealLeadTime, "min"), getLeadTime(rfqProduct.idealLeadTime, "max") )
                        let shippingTime = randomIntFromInterval( getLeadTime(rfqProduct.idealLeadTime, "min"), getLeadTime(rfqProduct.idealLeadTime, "max") )
                        let inventory = getInventory(rfqProduct.quantity)
                        let customizations = randomIntFromInterval(1, 10)
                        let customizationsDescription = "List of customizations"
                        let minQuantity = getMinQuantity(rfqProduct.quantity)

                        await addBidProduct(bidId, rfqProductId, pricePerUnit, leadTime, shippingTime, inventory, customizations, customizationsDescription, minQuantity)
                        
                    }
                    logs.addingBidsVerbose && console.log(`Successfully added ${rfqProductIds.length} bid products`)

                    //adding the bid files
                    let noBidFilesToAdd = randomIntFromInterval(noFilesPerBid.min, noFilesPerBid.max)
                    for(let k = 0; k < noBidFilesToAdd; k++) {
                        let fileURI = `www.ipfs.io/${ getRandomString() }`
                        let fileType = randomIntFromInterval(0, 14) //six types of files
                        await addBidFile(bid.bidId, fileType, fileURI)

                    }
                    logs.addingBidsVerbose && console.log(`Successfully added ${noBidFilesToAdd} bid files`)

                    //bid = await getBid(bid.bidId, true)
                    //rfq = await getRfq(rfq.rfqNo, true)

                    let kpiValues = await initKpiValues(rfq.rfqNo, bid.bidId)
                    /*
                    for(let k = 0; k < rfqKpiIds.length; k++) {
                        let rfqKpi = await getRfqKpi(rfqKpiIds[k])
                        let kpiName = getKpiName(rfqKpi, kpis)
                        let value = await generateKpiValue(rfq, bid, kpiName)

                        console.log(`${kpiName}: ${value}`)
                        
                        kpiValues.push(value) //this is pushed to the index in rfq.rfqKpiIds that corresponds rfqKpi, which has references to the kpiGroup and the kpiName
                    }*/
                    //console.log("kpiValues", kpiValues)

                    await addOffer(bid.bidId, kpiValues)
        
                    noBidsAdded++

                }
                noAddedBidsForRfq++

            }
            
            if(noAddedBidsForRfq == noBidsPerRFQ) {
                break
            }
        }

    }
    let bids = await getBids([], true)
    let offers = await getOffers()
    //console.log(bids[0])
    //console.log("bids", bids)
    //let rfqsFromC = await getRfqs([], true)
    //let rfq = rfqs[0]
    //console.log("rfqsFromC", rfqsFromC[0])
    logs.addingBids && console.log(`\nSuccessfully added ${noBidsAdded} Bids`)

}

async function addAuctions() {
    let rfqs = await getRfqs()

    //PATH 1: RFQ TO WINNER TO COMPLETED
    logs.addingAuctions && console.log(`\nAdding ${auctionPaths.path1} RFQs for Path #1\n---------------------------------------`)
    for(let i = getStartingIndexForPath(1); i < getEndingIndexForPath(1); i++) {
        let rfq = rfqs[i]
        let rfqNo = rfq.rfqNo
        let bidIds = rfq.bidIds

        //set user as buyer so he can open bidding
        await setBuyerAsCurrentUser(rfqNo)
        await initPath(rfqNo)
        
        await openBiding(rfqNo)

        //set user as seller so they can submit a bid
        for(let j = 0; j < bidIds.length; j++) {
            await setSellerAsCurrentUser(bidIds[j])
            await submitBid(bidIds[j])
        }

        //set user as buyer so they can close bidding and declare winner, rate seller
        await setBuyerAsCurrentUser(rfqNo)
        await closeBidding(rfqNo)

        await declareWinner(rfqNo)

        let sellerRating = randomIntFromInterval(1, 10)
        let sellerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateSeller(rfqNo, sellerRating, sellerComment)

        //set user as seller of winning bid so they can rate buyer
        rfq = await getRfq(rfqNo)
        let winningBidId = rfq.winningBidId
        await setSellerAsCurrentUser(winningBidId)

        let buyerRating = randomIntFromInterval(1, 10)
        let buyerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateBuyer(rfqNo, buyerRating, buyerComment)

        //set user as buyer so they can rate after sale service and complete the rfq
        await setBuyerAsCurrentUser(rfqNo)

        let afterSaleRating = randomIntFromInterval(1, 10)
        let afterSaleComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateAfterSale(rfqNo, afterSaleRating, afterSaleComment)

        await completeRfq(rfqNo)

    }
    
    //PATH 2: RFQ TO MANUAL SCORES TO WINNER TO COMPLETED
    logs.addingAuctions && console.log(`\nAdding ${auctionPaths.path2} RFQs for Path #2\n---------------------------------------`)
    for(let i = getStartingIndexForPath(2); i < getEndingIndexForPath(2); i++) {
        let rfq = rfqs[i]
        let rfqNo = rfq.rfqNo
        let bidIds = rfq.bidIds

        //set user as buyer so he can open bidding
        await setBuyerAsCurrentUser(rfqNo)
        await initPath(rfqNo)

        await openBiding(rfqNo)

        //set user as seller so they can submit a bid
        for(let j = 0; j < bidIds.length; j++) {
            await setSellerAsCurrentUser(bidIds[j])
            await submitBid(bidIds[j])
        }

        //set user as buyer so they can close bidding, set bid scores manually and declare winner, rate seller
        await setBuyerAsCurrentUser(rfqNo)
        await closeBidding(rfqNo)

        let updatedScores = getUpdatedScores(rfq.rfqKpiIds)
        let bidId = getRandomBidId(bidIds)
        await setBidScoresManually(bidId, updatedScores)

        await declareWinner(rfqNo)

        let sellerRating = randomIntFromInterval(1, 10)
        let sellerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateSeller(rfqNo, sellerRating, sellerComment)

        //set user as seller of winning bid so they can rate buyer
        rfq = await getRfq(rfqNo)
        let winningBidId = rfq.winningBidId
        await setSellerAsCurrentUser(winningBidId)

        let buyerRating = randomIntFromInterval(1, 10)
        let buyerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateBuyer(rfqNo, buyerRating, buyerComment)

        //set user as buyer so they can rate after sale service and complete the rfq
        await setBuyerAsCurrentUser(rfqNo)

        let afterSaleRating = randomIntFromInterval(1, 10)
        let afterSaleComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateAfterSale(rfqNo, afterSaleRating, afterSaleComment)

        await completeRfq(rfqNo)

    }

    //PATH 3: RFQ TO AUCTION TO WINNER
    logs.addingAuctions && console.log(`\nAdding ${auctionPaths.path3} RFQs for Path #3\n---------------------------------------`)
    for(let i = getStartingIndexForPath(3); i < getEndingIndexForPath(3); i++) {
        let rfq = rfqs[i]
        let rfqNo = rfq.rfqNo
        let bidIds = rfq.bidIds

        //set user as buyer so he can open bidding
        await setBuyerAsCurrentUser(rfqNo)
        
        await initPath(rfqNo)

        await openBiding(rfqNo)

        //set user as seller so they can submit a bid
        for(let j = 0; j < bidIds.length; j++) {
            await setSellerAsCurrentUser(bidIds[j])
            await submitBid(bidIds[j])
        }

        //set user as buyer so they can close bidding, open auction
        await closeBidding(rfqNo)

        await openAuction(rfqNo)

        await submitRandomCounterOffer(rfq)

        //set user as buyer so they can close auction, declare winner, rate seller
        await setBuyerAsCurrentUser(rfqNo)

        await closeAuction(rfqNo)

        await declareWinner(rfqNo)

        let sellerRating = randomIntFromInterval(1, 10)
        let sellerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateSeller(rfqNo, sellerRating, sellerComment)

        //set user as seller of winning bid so they can rate buyer
        rfq = await getRfq(rfqNo)
        let winningBidId = rfq.winningBidId
        await setSellerAsCurrentUser(winningBidId)

        let buyerRating = randomIntFromInterval(1, 10)
        let buyerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateBuyer(rfqNo, buyerRating, buyerComment)

        //set user as buyer so they can rate after sale service and complete the rfq
        await setBuyerAsCurrentUser(rfqNo)

        let afterSaleRating = randomIntFromInterval(1, 10)
        let afterSaleComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateAfterSale(rfqNo, afterSaleRating, afterSaleComment)

        await completeRfq(rfqNo)

    }
    
    //PATH 4: RFQ TO AUCTION TO AUCTION TO WINNER
    logs.addingAuctions && console.log(`\nAdding ${auctionPaths.path4} RFQs for Path #4\n---------------------------------------`)
    for(let i = getStartingIndexForPath(4); i < getEndingIndexForPath(4); i++) {
        let rfq = rfqs[i]
        let rfqNo = rfq.rfqNo
        let bidIds = rfq.bidIds

        //set user as buyer so he can open bidding
        await setBuyerAsCurrentUser(rfqNo)
        await initPath(rfqNo)

        await openBiding(rfqNo)

        //set user as seller so they can submit a bid
        for(let j = 0; j < bidIds.length; j++) {
            await setSellerAsCurrentUser(bidIds[j])
            await submitBid(bidIds[j])
        }

        //set user as buyer so they can close bidding, open auction
        await setBuyerAsCurrentUser(rfqNo)

        await closeBidding(rfqNo)

        //AUCTION 1
        await openAuction(rfqNo)

        await submitRandomCounterOffer(rfq)

        await closeAuction(rfqNo)

        //set user as buyer so they can close bidding, open auction
        await setBuyerAsCurrentUser(rfqNo)

        //AUCTION 2
        await openAuction(rfqNo)

        await submitRandomCounterOffer(rfq)

        //set user as buyer so they can close auction, declare winner, rate seller
        await setBuyerAsCurrentUser(rfqNo)

        await closeAuction(rfqNo)

        await declareWinner(rfqNo)

        let sellerRating = randomIntFromInterval(1, 10)
        let sellerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateSeller(rfqNo, sellerRating, sellerComment)

        //set user as seller of winning bid so they can rate buyer
        rfq = await getRfq(rfqNo)
        let winningBidId = rfq.winningBidId
        await setSellerAsCurrentUser(winningBidId)

        let buyerRating = randomIntFromInterval(1, 10)
        let buyerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateBuyer(rfqNo, buyerRating, buyerComment)

        //set user as buyer so they can rate after sale service and complete the rfq
        await setBuyerAsCurrentUser(rfqNo)

        let afterSaleRating = randomIntFromInterval(1, 10)
        let afterSaleComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateAfterSale(rfqNo, afterSaleRating, afterSaleComment)

        await completeRfq(rfqNo)

    }
    
    //PATH 5: RFQ TO AUCTION TO AUCTION TO MANUAL SCORES TO WINNER
    logs.addingAuctions && console.log(`\nAdding ${auctionPaths.path5} RFQs for Path #5\n---------------------------------------`)
    for(let i = getStartingIndexForPath(5); i < getEndingIndexForPath(5); i++) {
        let rfq = rfqs[i]
        let rfqNo = rfq.rfqNo
        let bidIds = rfq.bidIds

        //set user as buyer so he can open bidding
        await setBuyerAsCurrentUser(rfqNo)

        await initPath(rfqNo)
        
        await openBiding(rfqNo)

        //set user as seller so they can submit a bid
        for(let j = 0; j < bidIds.length; j++) {
            await setSellerAsCurrentUser(bidIds[j])
            await submitBid(bidIds[j])
        }

        //set user as buyer so they can close bidding, open auction
        await setBuyerAsCurrentUser(rfqNo)

        await closeBidding(rfqNo)

        //AUCTION 1
        await openAuction(rfqNo)

        await submitRandomCounterOffer(rfq)

        //set user as buyer so they can close auction, open auction
        await setBuyerAsCurrentUser(rfqNo)

        await closeAuction(rfqNo)

        //AUCTION 2
        await openAuction(rfqNo)

        await submitRandomCounterOffer(rfq)

        //set user as buyer so they can close auction, manual score, declare winner, rate seller
        await setBuyerAsCurrentUser(rfqNo)

        await closeAuction(rfqNo)

        //MANUAL SCORE
        let updatedScores = getUpdatedScores(rfq.rfqKpiIds)
        let bidId = getRandomBidId(bidIds)
        await setBidScoresManually(bidId, updatedScores)

        await declareWinner(rfqNo)

        let sellerRating = randomIntFromInterval(1, 10)
        let sellerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateSeller(rfqNo, sellerRating, sellerComment)

        //set user as seller of winning bid so they can rate buyer
        rfq = await getRfq(rfqNo)
        let winningBidId = rfq.winningBidId
        await setSellerAsCurrentUser(winningBidId)

        let buyerRating = randomIntFromInterval(1, 10)
        let buyerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateBuyer(rfqNo, buyerRating, buyerComment)

        //set user as buyer so they can rate after sale service and complete the rfq
        await setBuyerAsCurrentUser(rfqNo)

        let afterSaleRating = randomIntFromInterval(1, 10)
        let afterSaleComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateAfterSale(rfqNo, afterSaleRating, afterSaleComment)

        await completeRfq(rfqNo)

    }

    //PATH 6: RFQ TO WINNER TO WINNER WITHDRAWN TO COMPLETED
    logs.addingAuctions && console.log(`\nAdding ${auctionPaths.path6} RFQs for Path #6\n---------------------------------------`)
    for(let i = getStartingIndexForPath(6); i < getEndingIndexForPath(6); i++) {
        let rfq = rfqs[i]
        let rfqNo = rfq.rfqNo
        let bidIds = rfq.bidIds

        //set user as buyer so he can open bidding
        await setBuyerAsCurrentUser(rfqNo)

        await initPath(rfqNo)
        
        await openBiding(rfqNo)

        //set user as seller so they can submit a bid
        for(let j = 0; j < bidIds.length; j++) {
            await setSellerAsCurrentUser(bidIds[j])
            await submitBid(bidIds[j])
        }
        //set user as buyer so they can close bidding, declare winner
        await setBuyerAsCurrentUser(rfqNo)

        await closeBidding(rfqNo)

        await declareWinner(rfqNo)

        rfq = await getRfq(rfqNo)
        let winningBidId = rfq.winningBidId

        //set user as seller so they can withdraw bid
        await setSellerAsCurrentUser(winningBidId)

        await withdrawBid(winningBidId)

        //set user as buyer so they can complete rfq
        await setBuyerAsCurrentUser(rfqNo)

        await completeRfq(rfqNo)

    }
    
    //PATH 7: RFQ TO WINNER TO CANCELED
    logs.addingAuctions && console.log(`\nAdding ${auctionPaths.path7} RFQs for Path #7\n---------------------------------------`)
    for(let i = getStartingIndexForPath(7); i < getEndingIndexForPath(7); i++) {
        let rfq = rfqs[i]
        let rfqNo = rfq.rfqNo
        let bidIds = rfq.bidIds

        //set user as buyer so he can open bidding
        await setBuyerAsCurrentUser(rfqNo)

        await initPath(rfqNo)
        
        await openBiding(rfqNo)

        //set user as seller so they can submit a bid
        for(let j = 0; j < bidIds.length; j++) {
            await setSellerAsCurrentUser(bidIds[j])
            await submitBid(bidIds[j])
        }

        //set user as buyer so they can close bidding, cancel rfq
        await setBuyerAsCurrentUser(rfqNo)

        await closeBidding(rfqNo)

        await cancelRfq(rfqNo)

    }

    //PATH 8: RFQ TO AUCTION * 3 (1 OFFER, 3 OFFERS, 1 OFFERS) TO MANUAL SCORES TO WINNER
    logs.addingAuctions && console.log(`\nAdding ${auctionPaths.path8} RFQs for Path #8\n---------------------------------------`)
    for(let i = getStartingIndexForPath(8); i < getEndingIndexForPath(8); i++) {
        let rfq = rfqs[i]
        let rfqNo = rfq.rfqNo
        let bidIds = rfq.bidIds

        //set user as buyer so he can open bidding
        await setBuyerAsCurrentUser(rfqNo)

        await initPath(rfqNo)
        
        await openBiding(rfqNo)

        //set user as seller so they can submit a bid
        for(let j = 0; j < bidIds.length; j++) {
            await setSellerAsCurrentUser(bidIds[j])
            await submitBid(bidIds[j])
        }

        //set user as buyer so they can close bidding, open auction
        await setBuyerAsCurrentUser(rfqNo)

        await closeBidding(rfqNo)

        //AUCTION 1
        await openAuction(rfqNo)


        await submitRandomCounterOffer(rfq)

        //set user as buyer so they can close auction, open auction
        await setBuyerAsCurrentUser(rfqNo)

        await closeAuction(rfqNo)

        //AUCTION 2
        await openAuction(rfqNo)

        //COUNTEROFFER 1
        await submitRandomCounterOffer(rfq)

        //COUNTEROFFER 2
        await submitRandomCounterOffer(rfq)

        //COUNTEROFFER 3
        await submitRandomCounterOffer(rfq)

        //set user as buyer so they can close auction, manual score, declare winner, rate seller
        await setBuyerAsCurrentUser(rfqNo)

        await closeAuction(rfqNo)


        //AUCTION 3
        await openAuction(rfqNo)

        await submitRandomCounterOffer(rfq)

        //set user as buyer so they can close auction, manual score, declare winner, rate seller
        await setBuyerAsCurrentUser(rfqNo)

        await closeAuction(rfqNo)

        //MANUAL SCORE
        let updatedScores = getUpdatedScores(rfq.rfqKpiIds)
        let bidId = getRandomBidId(bidIds)
        await setBidScoresManually(bidId, updatedScores)

        await declareWinner(rfqNo)

        let sellerRating = randomIntFromInterval(1, 10)
        let sellerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateSeller(rfqNo, sellerRating, sellerComment)

        //set user as seller of winning bid so they can rate buyer
        rfq = await getRfq(rfqNo)
        let winningBidId = rfq.winningBidId
        await setSellerAsCurrentUser(winningBidId)

        let buyerRating = randomIntFromInterval(1, 10)
        let buyerComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateBuyer(rfqNo, buyerRating, buyerComment)

        //set user as buyer so they can rate after sale service and complete the rfq
        await setBuyerAsCurrentUser(rfqNo)

        let afterSaleRating = randomIntFromInterval(1, 10)
        let afterSaleComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        await rateAfterSale(rfqNo, afterSaleRating, afterSaleComment)

        await completeRfq(rfqNo)

    }
}

async function setBuyerAsCurrentUser(rfqNo) {
    let rfq = await getRfq(rfqNo)
    let userAddress = rfq.buyer
    setAsCurrentUser(userAddress)
}

async function setSellerAsCurrentUser(bidId) {
    let bid = await getBid(bidId)
    let userAddress = bid.seller
    setAsCurrentUser(userAddress)
}

async function submitRandomCounterOffer(rfq) {        
    let bidIds = rfq.bidIds
    let bids = await getBids(bidIds)
    let bidId = 0

    for(let i = 0; i < bids.length; i++) {
        let bid = bids[i]
        let bidStatus = parseInt(bid.status)
        if(bidStatus != BID_STATUS.AUCTION_WON) {
            bidId = bid.bidId
        }
    }

    //set user as seller so they can submit offer
    await setSellerAsCurrentUser(bidId)

    await updateBid(bidId)
    let kpiValues = await initKpiValues(rfq.rfqNo, bidId)

    await submitOffer(bidId, kpiValues)
}

async function calculateStats() {

    console.log(txReceipts.get("bids.updateBidStatus")[0])

    let stats = {
        totalGasUsed: 0,
        totalGasByUser: new Map(),
        totalFeesByUser: new Map(),
        gasByMethod: new Map(),
        invocationsByMethod: new Map(),
        averageGasByMethod: new Map(),
        averageFeesByMethod: new Map(),
        gasByUser: new Map(),
        addMethodGas: function(method, gas) {
            let methodGas = []
            if(!this.gasByMethod.has(method)) {
                methodGas.push(gas)
            } else {
                methodGas = this.gasByMethod.get(method)
                methodGas.push(gas)
            }
            this.gasByMethod.set(method, methodGas)
        },
        addUserGas: function(userAddress, gas) {
            let userGas = []
            if(!this.gasByUser.has(userAddress)) {
                userGas.push(gas)
            } else {
                userGas = this.gasByUser.get(userAddress)
                userGas.push(gas)
            }
            this.gasByUser.set(userAddress, userGas)
        },
        calcTotalGasByUser: function() {
            let userAddresses = Array.from( this.gasByUser.keys() )
            for(let i = 0; i < userAddresses.length; i++) {
                let userGas = this.gasByUser.get(userAddresses[i])

                let totalUserGas = 0
                for(let j = 0; j < userGas.length; j++) {
                    totalUserGas += userGas[j]
                }

                this.totalGasByUser.set(userAddresses[i], totalUserGas)
            }
        },
        calcTotalFeesByUser: function() {
            let userAddresses = Array.from( this.gasByUser.keys() )
            for(let i = 0; i < userAddresses.length; i++) {
                let userGas = this.gasByUser.get(userAddresses[i])

                let totalUserGas = 0
                for(let j = 0; j < userGas.length; j++) {
                    totalUserGas += userGas[j]
                }

                let totalFeesInGwei = totalUserGas * feesPerGas
                let totalFeesInEth = totalFeesInGwei / 1000000000

                this.totalFeesByUser.set(userAddresses[i], totalFeesInEth)
            }
        },
        calcAverageGasByMethod: function() {
            let methods = Array.from( this.gasByMethod.keys() )
            for(let i = 0; i < methods.length; i++) {
                let methodGas = this.gasByMethod.get(methods[i])

                let averageMethodGas = calcAvg(methodGas)
                let totalFeesInGwei = averageMethodGas * feesPerGas
                let averageFeesInEth = totalFeesInGwei / 1000000000

                this.averageGasByMethod.set(methods[i], averageMethodGas)
                this.averageFeesByMethod.set(methods[i], averageFeesInEth)
                this.invocationsByMethod.set(methods[i], methodGas.length)
            }

        },
        saveStatsFile: function() {
            let fileToSave = {}
            fileToSave["totalGasUsed"] = this.totalGasUsed
            fileToSave["totalGasByUser"] = mapToObject(this.totalGasByUser)
            fileToSave["totalFeesByUser"] = mapToObject(this.totalFeesByUser)
            fileToSave["gasByMethod"] = mapToObject(this.gasByMethod)
            fileToSave["averageGasByMethod"] = mapToObject(this.averageGasByMethod)
            fileToSave["averageFeesByMethod"] = mapToObject(this.averageFeesByMethod)
            fileToSave["invocationsByMethod"] = mapToObject(this.invocationsByMethod)
            fileToSave["gasByUser"] = mapToObject(this.gasByUser)

            saveJsonFile("stats", fileToSave, "outputFiles")
        }

    }
    
    let keys = Array.from( txReceipts.keys() )
    for(let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let receipts = txReceipts.get(key)
        for(let j = 0; j < receipts.length; j++) {
            let receipt = receipts[j]
            let gasUsed = receipt.gasUsed
            stats.totalGasUsed += parseInt(gasUsed)
            stats.addMethodGas(key, parseInt(gasUsed))

            let userAddress = receipt.from
            stats.addUserGas(userAddress, parseInt(gasUsed))

        }
    }

    stats.calcTotalGasByUser()
    stats.calcTotalFeesByUser()
    stats.calcAverageGasByMethod()
    console.log(stats)
    stats.saveStatsFile()

}

async function saveJsonFile(fileName, string, directory = "") {
    let stringAsJson = JSON.stringify(string)
    //console.log(`stringAsJson`, stringAsJson)
    let fullFileName = `${fileName}.json`
    if(directory != "") {
        fullFileName = `${directory}/${fileName}.json`
    }
    fs.writeFile(fullFileName, stringAsJson, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function mapToObject(mapObj) {
    let obj = {}
    let keys = Array.from( mapObj.keys() )
    for(let i = 0; i < keys.length; i++) {
        let item = mapObj.get(keys[i])
        obj[keys[i]] = item
    }
    return obj
}

function calcAvg(array) {
    let sum = 0
    let avg = 0
    for(let i = 0; i < array.length; i++) {
        sum += array[i]
    }
    avg = sum / array.length
    return avg
}

function getStartingIndexForPath(pathNo) {
    let index = 0
    if(pathNo == 1) {
        index = 0
    }
    if(pathNo == 2) {
        index = auctionPaths.path1
    }
    if(pathNo == 3) {
        index = auctionPaths.path1 + auctionPaths.path2
    }
    if(pathNo == 4) {
        index = auctionPaths.path1 + auctionPaths.path2 + auctionPaths.path3
    }
    if(pathNo == 5) {
        index = auctionPaths.path1 + auctionPaths.path2 + auctionPaths.path3 + auctionPaths.path4
    }
    if(pathNo == 6) {
        index = auctionPaths.path1 + auctionPaths.path2 + auctionPaths.path3 + auctionPaths.path4 + auctionPaths.path5
    }
    if(pathNo == 7) {
        index = auctionPaths.path1 + auctionPaths.path2 + auctionPaths.path3 + auctionPaths.path4 + auctionPaths.path5 + auctionPaths.path6
    }
    if(pathNo == 8) {
        index = auctionPaths.path1 + auctionPaths.path2 + auctionPaths.path3 + auctionPaths.path4 + auctionPaths.path5 + auctionPaths.path6 + auctionPaths.path7
    }
    return index
}

function getEndingIndexForPath(pathNo) {
    let index = 0
    if(pathNo == 1) {
        index = auctionPaths.path1
    }
    if(pathNo == 2) {
        index = auctionPaths.path1 + auctionPaths.path2
    }
    if(pathNo == 3) {
        index = auctionPaths.path1 + auctionPaths.path2 + auctionPaths.path3
    }
    if(pathNo == 4) {
        index = auctionPaths.path1 + auctionPaths.path2 + auctionPaths.path3 + auctionPaths.path4
    }
    if(pathNo == 5) {
        index = auctionPaths.path1 + auctionPaths.path2 + auctionPaths.path3 + auctionPaths.path4 + auctionPaths.path5
    }
    if(pathNo == 6) {
        index = auctionPaths.path1 + auctionPaths.path2 + auctionPaths.path3 + auctionPaths.path4 + auctionPaths.path5 + auctionPaths.path6
    }
    if(pathNo == 7) {
        index = auctionPaths.path1 + auctionPaths.path2 + auctionPaths.path3 + auctionPaths.path4 + auctionPaths.path5 + auctionPaths.path6 + auctionPaths.path7
    }
    if(pathNo == 8) {
        index = auctionPaths.path1 + auctionPaths.path2 + auctionPaths.path3 + auctionPaths.path4 + auctionPaths.path5 + auctionPaths.path6 + auctionPaths.path7 + auctionPaths.path8
    }
    return index

}

function getUpdatedScores(rfqKpiIds) {
    let noScores = rfqKpiIds.length
    let updatedScores = []
    let score = 1 / noScores
    for(let i = 0; i < rfqKpiIds.length; i++) {
        updatedScores.push(score)
    }
    return updatedScores
}

function getRandomBidId(bidIds) {
    let maxIndex = bidIds.length - 1
    let bidIdIndex = randomIntFromInterval(0, maxIndex)
    return bidIds[bidIdIndex]
}

//TODO: DELETE FUNCTION
async function generateKpiValues(rfqNo) {
    let rfq = await getRfq(rfqNo)
    let rfqKpiIds = rfq.rfqKpiIds
    //console.log("generateKpiValues rfqKpiIds", rfqKpiIds)
    let kpiValues = []
    for(let i = 0; i < rfqKpiIds.length; i++) {
        let value = randomIntFromInterval(10, 350)

        kpiValues.push(value)
    }
    //console.log("generateKpiValues: kpiValues", kpiValues)
    return kpiValues
}

async function logAuction(action, args = {rfqNo: 0, bidId: 0}) {
    let rfqNo = args.rfqNo
    let bidId = args.bidId
    
    if(action == ACTIONS.ADD_RFQ) {
        let rfq = await getRfq(rfqNo, true)
        logs.auctionLogActions && console.log(`\n****ACTION: ADD RFQ****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Starting path for RFQ #${rfqNo}.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        logs.auctionLogStatuses && console.log(`rfq.bidIds: ${rfq.bidIds}`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs)
        logs.auctionLogStatuses && console.log(`rfq.kpiList:`)
        logs.auctionLogStatuses && console.log(rfq.kpiList)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }
    
    if(action == ACTIONS.OPEN_BIDDING) {
        let rfq = await getRfq(rfqNo)
        logs.auctionLogActions && console.log(`\n****ACTION: OPEN BIDDING****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Bidding opened for RFQ #${rfqNo}.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        logs.auctionLogStatuses && console.log(`rfq.round: ${rfq.round}.`)
    }
    
    if(action == ACTIONS.SUBMIT_BID) {
        let bid = await getBid(bidId)
        logs.auctionLogActions && console.log(`\n****ACTION: SUBMIT BID****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Bid #${bidId} submitted.`)
        let bidLogs = await getBidLogs(bid.rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs, bidId)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }
    
    if(action == ACTIONS.CLOSE_BIDDING) {
        let rfq = await getRfq(rfqNo)
        logs.auctionLogActions &&  console.log(`\n****ACTION: CLOSE BIDDING****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Bidding closed for RFQ #${rfqNo}; scores automatically calculated.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }
        
    if(action == ACTIONS.OPEN_AUCTION) {
        let rfq = await getRfq(rfqNo)
        logs.auctionLogActions && console.log(`\n****ACTION: OPEN AUCTION****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Auction opened for RFQ #${rfqNo}.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        logs.auctionLogStatuses && console.log(`rfq.round: ${rfq.round}.`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs, rfq.round)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }

    if(action == ACTIONS.SUBMIT_OFFER) {
        let bid = await getBid(bidId)
        let rfq = await getRfq(bid.rfqNo)
        let rfqNo = rfq.rfqNo
        logs.auctionLogActions && console.log(`\n****ACTION: SUBMIT OFFER****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Offer submitted for Bid #${bidId}.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        logs.auctionLogStatuses && console.log(`rfq.round: ${rfq.round}.`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs, bidId)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }

    if(action == ACTIONS.CLOSE_AUCTION) {
        let rfq = await getRfq(rfqNo)
        logs.auctionLogActions && console.log(`\n****ACTION: CLOSE AUCTION****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Auction closed for RFQ #${rfqNo}; scores automatically calculated.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        logs.auctionLogStatuses && console.log(`rfq.round: ${rfq.round}.`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs, rfq.round)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }
       
    if(action == ACTIONS.DECLARE_WINNER) {
        let rfq = await getRfq(rfqNo)
        logs.auctionLogActions && console.log(`\n****ACTION: DECLARE WINNER****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Winner declared for RFQ #${rfqNo}.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }

    if(action == ACTIONS.CANCEL_RFQ) {
        let rfq = await getRfq(rfqNo)
        logs.auctionLogActions && console.log(`\n****ACTION: CANCEL RFQ****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`RFQ #${rfqNo} canceled.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }
    
    if(action == ACTIONS.WITHDRAW_BID) {
        let bid = await getBid(bidId)
        let rfq = await getRfq(bid.rfqNo)
        logs.auctionLogActions && console.log(`\n****ACTION: WITHDRAW BID****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Bid #${bidId} withdrawn.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs, bidId)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }

    if(action == ACTIONS.RATE_SELLER) {
        let rfq = await getRfq(rfqNo)
        let winningBidId = rfq.winningBidId
        let bid = await getBid(winningBidId)
        logs.auctionLogActions && console.log(`\n****ACTION: RATE SELLER****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Seller rated for Bid #${rfqNo}.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        logs.auctionLogStatuses && console.log(`Bid Seller Ratings: ${bid.sellerRating}, comments: ${formatComment(bid.sellerRatingComments)}`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }
    
    if(action == ACTIONS.RATE_BUYER) {
        let rfq = await getRfq(rfqNo)
        let winningBidId = rfq.winningBidId
        let bid = await getBid(winningBidId)
        logs.auctionLogActions && console.log(`\n****ACTION: RATE BUYER****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Buyer rated for Bid #${rfqNo}.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        logs.auctionLogStatuses && console.log(`Bid Seller Ratings: ${bid.sellerRating}, comments: ${formatComment(bid.sellerRatingComments)}`)
        logs.auctionLogStatuses && console.log(`Bid Buyer Ratings: ${bid.buyerRating}, comments: ${formatComment(bid.buyerRatingComments)}`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }
    
    if(action == ACTIONS.RATE_AFTER_SALE) {
        let rfq = await getRfq(rfqNo)
        let winningBidId = rfq.winningBidId
        let bid = await getBid(winningBidId)
        logs.auctionLogActions &&  console.log(`\n****ACTION: RATE AFTER SALE****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions &&  console.log(`Seller after-sale services rated for RFQ #${rfqNo}.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        logs.auctionLogStatuses && console.log(`Bid Seller Ratings: ${bid.sellerRating}, comments: ${formatComment(bid.sellerRatingComments)}`)
        logs.auctionLogStatuses && console.log(`Bid Buyer Ratings: ${bid.buyerRating}, comments: ${formatComment(bid.buyerRatingComments)}`)
        logs.auctionLogStatuses && console.log(`Bid After Sale Ratings: ${bid.afterSaleRating}, comments: ${formatComment(bid.afterSaleRatingComments)}`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }
    
    if(action == ACTIONS.COMPLETE_RFQ) {
        let rfq = await getRfq(rfqNo)
        logs.auctionLogActions && console.log(`\n****ACTION: COMPLETE RFQ****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`RFQ #${rfqNo} completed.`)
        logs.auctionLogStatuses && console.log(`rfq.status: ${rfq.statusString}.`)
        logs.auctionLogUsers && console.log(`rfq.buyer: ${rfq.buyerName}.`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && saveBidLogs(action, bidLogs)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }

    if(action == ACTIONS.UPDATE_SCORES_MANUALLY) {
        let bid = await getBid(bidId)
        let rfqNo = bid.rfqNo
        logs.auctionLogActions &&  console.log(`\n****ACTION: UPDATE SCORES MANUALLY****`)
        logs.auctionLogUsers && console.log(`currentUser: ${getCurrentUser(true)}`)
        logs.auctionLogActions && console.log(`Scores of bid #${bidId} updated manually.`)
        let bidLogs = await getBidLogs(rfqNo)
        logs.auctionSaveBidLogs && await saveBidLogs(action, bidLogs, bidId)
        logs.auctionLogBids && console.log(`Bid Logs:`)
        logs.auctionLogBids && console.log(bidLogs)
    }

}

async function getBidLogs(rfqNo) {
    let bidScores = new Map()
    let rfq = await getRfq(rfqNo)
    let bidIds = rfq.bidIds
    for(let i = 0; i < bidIds.length; i++) {
        let bidLog = {}

        let bid = await getBid(bidIds[i])

        let latestOfferId = bid.latestOfferId
        let offer = await getOffer(latestOfferId)

        if( logs.auctionLogStatuses ) bidLog["bidStatus"] = bid.statusString
        if( logs.auctionLogStatuses ) bidLog["bidScore"] = parseFloat(bid.score)
        if( logs.auctionLogOffers ) bidLog["offerId"] = parseInt(offer.offerId)
        if( logs.auctionLogOffers ) bidLog["kpiValues"] = offer.kpiValues
        if( logs.auctionLogOffers ) bidLog["kpiScores"] = offer.kpiScores
        if( logs.auctionLogUsers ) bidLog["sellerName"] = bid.sellerName

        bidScores.set(bid.bidId, bidLog)
            
    
    }
    return bidScores
}

async function saveBidLogs(action, bidLogs, otherInfo = "") {
    let bidLogsAsObject = mapToObject(bidLogs)
    let fileName = getStatusByCode(ACTIONS, action)
    fileName = Date.now() + ". " + fileName + "_" + otherInfo
    await saveJsonFile(fileName, bidLogsAsObject, "outputFiles")
}

async function getBidScores(rfqNo) {
    let bidScores = new Map()
    let rfq = await getRfq(rfqNo)
    let bidIds = rfq.bidIds
    for(let i = 0; i < bidIds.length; i++) {
        let bidLog = {}
        let bid = await getBid(bidIds[i])
        bidScores.set(bid.bidId, bid.score)           
    
    }
    return bidScores
}

async function getOfferValuesAndScores(rfqNo) {

}

async function getBidStatuses(rfqNo) {
    let bidStatuses = new Map()
    let rfq = await getRfq(rfqNo)
    let bidIds = rfq.bidIds
    for(let i = 0; i < bidIds.length; i++) {
        let bid = await getBid(bidIds[i])
        bidStatuses.set(bid.bidId, bid.statusString)
    }
    return bidStatuses
}
function getStatusByCode(statusEnumObject, code) {
    let statuses = Object.keys(statusEnumObject)
    for(let i = 0; i < statuses.length; i++) {
        let status = statuses[i]
        if(statusEnumObject[status] == code) {
            return status
        }
    }
}
function getScoreRuleByCode(ruleEnumObject, code) {
    let rules = Object.keys(ruleEnumObject)
    for(let i = 0; i < rules.length; i++) {
        let rule = rules[i]
        if(ruleEnumObject[rule] == code) {
            return rule
        }
    }
}

function formatComment(comment) {
    let commentLength = 35
    let shorterComment = comment.substring(0, commentLength)
    let formattedComment = shorterComment + "..."
    return formattedComment
}

function getLeadTime(idealLeadTime, mode) {
    if(mode == "min") {
        return idealLeadTime - idealLeadTime*0.1
    }
    if(mode == "max") {
        return idealLeadTime + idealLeadTime*0.1
    }
}

function getInventory(quantity) {
    return quantity * randomIntFromInterval(1, 10)
}

function getMinQuantity(quantity) {
    return quantity - quantity*0.1

}

//checks whether the supplier can bid for the rfq (by comparing whether he sells all of the rfq's products)
function canBid(user, rfq) {
    return true
}

function getKpiValue(kpiGrouIpd, kpiId) {
    return randomIntFromInterval(10, 350)
}

async function initKpis() {
    for( let [group, kpis] of KPIs ) {
        //console.log(group)
        //console.log(kpis)
        await initKpiGroup(group, kpis)
    }
}

async function getRfqByExternalId(externalId) {
    let rfqs = await getRfqs()
    for(let i = 0; i < rfqs.length; i++) {
        if(rfqs[i].externalId === externalId) {
            return rfqs[i]
        }
    }
    return false
}

async function getBidByExternalId(externalId) {
    let bids = await getBids()
    for(let i = 0; i < bids.length; i++) {
        if(bids[i].externalId === externalId) {
            return bids[i]
        }
    }
    return false
}

function getScoreRule(kpi) {
    return randomIntFromInterval(0, 1)
}

async function readCsvFile(fileName) {
    let fileNameWithExtension = `./data/${fileName}.csv`;

    return new Promise((resolve, reject) => {
        fs.readFile(fileNameWithExtension, "utf-8", (err, data) => {

            let csvFile = new Array();
            //checking if the data is empty, i.e., there's no csv for that fileName combination
            if(typeof data !== 'undefined') {
                csvFile = data.split("\n").map(a => a.split(","));
                //console.log(csvFile);
            }

            resolve(csvFile);

        });
    }); 

}

function randomIntFromInterval(min, max) {
    if(min == max) {
        return min
    } // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}



//DEPLOY CONTRACTS
//===========================================================================================================================================================



async function getGanacheAccount() {
    let accounts = await provider.eth.getAccounts()
    let users = await getUsers()

    //The way I implemented the project, this means we'll get the account from the first iteration in the loop
    let accountsIndex = users.length
    if(accountsIndex == 0) {
        if(accounts[0] == getAuthorityAccount()) {
            //console.log("accounts[1]", accounts[1])
            return accounts[1]
        }
        return accounts[0]
    }
    //console.log("accountsIndex",accountsIndex)
    for (let i = accountsIndex; i < accounts.length; i++) {
        let accountAddress = accounts[i]
        if(accountAddress == getAuthorityAccount()) {
            continue
        }
        let users = await getUsers([accountAddress])
        if(users[0].userAddress === "0x0000000000000000000000000000000000000000")  {
            return accounts[i]
        }
    }
}

async function getABI(contractName) {
    let contractJson = require(`./compiled/${contractName}AbiBytecode.json`)
    return contractJson.abi
}
async function getBytecode(contractName) {
    let contractJson = require(`./compiled/${contractName}AbiBytecode.json`)
    return contractJson.bytecode
}

async function deploy(contractName, arguments) {

    //Getting accounts from provider
    const providersAccounts = await provider.eth.getAccounts()
    const defaultAccount = providersAccounts[0]
    logs.contractDeployment && console.log("Deployer account:", defaultAccount)

    let abi = await getABI(contractName)
    let bytecode = await getBytecode(contractName)

    //create a new contract object using the ABI and bytecode and deploy
    const MyContract = new provider.eth.Contract( abi )

    const myContract = MyContract.deploy({
        data: "0x" + bytecode,
        arguments: arguments,
    })

    // optionally, estimate the gas that will be used for development and log it
    const gas = await myContract.estimateGas({
        from: defaultAccount,
    })
    //logs.contractDeployment && console.log("estimated gas:", gas)

    try {
        let txHash = ""
        // Deploy the contract to the Ganache network
        const tx = await myContract.send({
            from: defaultAccount,
            gas,
            gasPrice: 100000000000,
        }).on("transactionHash", (hash) => {
            txHash = hash
        })
        logs.contractDeployment && console.log(`Contract "${contractName}" deployed at address: ${tx.options.address}`)

        let receipt = await provider.eth.getTransactionReceipt(txHash)
        addReceipt(`Deploy.${contractName}`, receipt)

        return [tx.options.address, provider, txHash]
    } catch (error) {
        console.error(error)
    }
}

async function deployContract(contract, arguments = []) {

    let [contractAddress, provider, txHash] = await deploy(contract.contractName, arguments)
    let abi = await getABI(contract.contractName)
    contractObj = new provider.eth.Contract(abi, contractAddress)

    try {
        contract.contract = contractObj
        contract.txHash = txHash
        contract.contractAddress = contractAddress
        

    } catch (error) {
        console.log("Error in deploying contract.")
        console.log(error)
        //console.log(contractData)
    }

    return true
}



//BLOCKCHAIN INTERFACE: USERS
//===========================================================================================================================================================



async function toggleVerify(userAddress) {
    try {
        let receipt = await contracts.users.contract.methods.toggleVerify(userAddress).send({
            from: getCurrentUser(),
            gas: 1000000,
            gasPrice: 10000000000,
        })
        
        addReceipt(`users.toggleVerify`, receipt)
        return receipt

    } catch(error) {
        console.log("toggleVerify(): error executing function")
        console.log(error)
    }


}

async function setBidsContract(contractAddress) {

    let receipt = await contracts.users.contract.methods.setBidsContract(contractAddress).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
        
    addReceipt(`users.setBidsContract`, receipt)
}

async function setRfqsContract(contractAddress) {

    let receipt = await contracts.users.contract.methods.setRfqsContract(contractAddress).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
        
    addReceipt(`users.setRfqsContract`, receipt)
}

async function addBidIdToUser(userAddress, bidId) {

    let receipt = await contracts.users.contract.methods.addBidId(userAddress, bidId).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
        
    addReceipt(`users.addBidIdToUser`, receipt)
}

async function addRfqNoToUser(userAddress, rfqNo) {

    let receipt = await contracts.users.contract.methods.addRfqNo(userAddress, rfqNo).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
        
    addReceipt(`users.addRfqNoToUser`, receipt)
}

async function registerUser(userType, name, contactDetails, productBarcodes, products) {
    //console.log("registerUser Products")
    //console.log("userType", userType, "name", name, "contactDetails", contactDetails, "productBarcodes", productBarcodes, "products", products)
    let storedUser = {}
    let storedProducts = []
    let contract = contracts.users.contract
    //try {
        if(contract) {

            //console.log(`User ${contractData.userAddress} registeration initiate on  contract ${contractData.userAddress}.`)
            let receipt = await contract.methods.register(userType, name,contactDetails, productBarcodes).send({
                from: getCurrentUser(),
                gas: 1000000,
                gasPrice: 10000000000,
            })
            addReceipt("Users.register", receipt)
            //console.log(`User ${contractData.userAddress} registered successfully on  contract ${contractData.contractAddress}.`)
            if(products.length != 0) {
                //console.log(`User ${contractData.userAddress} product registeration initiated.`)
                for(let i = 0; i < products.length; i++) {
                    let product = products[i]
                    let receipt = await addProduct(product.barcode, product.productName, product.specsURI)
                    addReceipt("Products.addProduct", receipt)
                    
                    storedProducts.push( receipt )
                }
                //console.log(`User ${contractData.userAddress} products registered successfully.`)
            } 

            storedUser = await getUsers([getCurrentUser()])
            storedProducts = await getProducts(productBarcodes)
        }

        return [storedUser, storedProducts]

    //} catch(error) {
       // console.log("Error registering user on the blockchain.")
       // console.log(error)
   // }
}

async function getUsers(userAddresses = []) {
    //console.log("userAddresses", userAddresses)
    if(userAddresses.length == 0) {
        userAddresses = await contracts.users.contract.methods.getUserAddresses().call()
        if(userAddresses.length == 0) {
            //console.log("No users registered yet.")
            return []
        }
    }
    
    //console.log("userAddresses", userAddresses)
    let users = []
    
    for(let i = 0; i < userAddresses.length; i++) {
        users.push ( await contracts.users.contract.methods.getUser( userAddresses[i] ).call() )
    }
    //console.log("userAddresses", allUsers)

    return users
}




//BLOCKCHAIN INTERFACE: PRODUCTS
//===========================================================================================================================================================




async function addProduct(barcode, name, specsURI) {
    //console.log("async function addProduct", barcode, name, specsURI)
    let result
    try {
        if(contracts.products.contract) {
            result = await contracts.products.contract.methods.addProduct(barcode, name, specsURI).send({
                from: getCurrentUser(),
                gas: 1000000,
                gasPrice: 10000000000,
            })

            return result

        }
    } catch(error) {
        console.log("Error adding a product to the blockchain.")
        console.log(`Product details:`, barcode, name, specsURI)
        console.log(error)
    }

}

async function getProducts(barcodes = []) {
    
    if(barcodes.length == 0) {
        barcodes = await contracts.products.contract.methods.getBarcodes().call()
        if(barcodes.length == 0) {
            //console.log("No products registered yet.")
            return []
        }
    }
    //console.log("userAddresses", userAddresses)
    let products = []
    
    for(let i = 0; i < barcodes.length; i++) {
        products.push( await contracts.products.contract.methods.getProduct( barcodes[i] ).call() )
    }
    //console.log("userAddresses", allUsers)

    return products
    
}




//BLOCKCHAIN INTERFACE: RFQS
//===========================================================================================================================================================




async function addRfq(docURI, externalId) {
    
    let receipt = await contracts.rfqs.contract.methods.addRFQ(docURI, externalId).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    
    addReceipt(`rfqs.addRFQ`, receipt)
}

async function increaseRound(rfqNo) {
    
    let receipt = await contracts.rfqs.contract.methods.increaseRound(rfqNo).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    
    addReceipt(`rfqs.increaseRound`, receipt)
}

async function addRfqProduct(rfqNo, barcode, quantity, shipTo, idealLeadTime, idealShippingTime) {
    

    //rfqNo, rfqProductId, barcode, quantity, shipTo, idealLeadTime, idealShippingTime
    //[rfqProduct.rfqNo, rfqProduct.rfqProductId, rfqProduct.barcode, rfqProduct.quantity, rfqProduct.shipTo, rfqProduct.idealLeadTime, rfqProduct.idealShippingTime]

    let weiQuantity = provider.utils.toWei(quantity.toString(), "ether")
    let weiIdealLeadTime = provider.utils.toWei(idealLeadTime.toString(), "ether")
    let weiIdealShippingTime = provider.utils.toWei(idealShippingTime.toString(), "ether")


    let receipt = await contracts.rfqs.contract.methods.addRFQProduct(rfqNo, barcode, weiQuantity, shipTo, weiIdealLeadTime, weiIdealShippingTime).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    
    addReceipt(`rfqs.addRfqProduct`, receipt)
}

async function addRfqKpi(rfqNo, kpiGroupId, kpiId, kpiWeight, scoreRule, comments) {

    
    let weiKpiWeight = provider.utils.toWei(kpiWeight.toString(), "ether")

    let receipt = await contracts.rfqs.contract.methods.addRfqKpi(rfqNo, kpiGroupId, kpiId, weiKpiWeight, scoreRule, comments).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    
    addReceipt(`rfqs.addRfqKpi`, receipt)

}

async function getRfqNos() {
    let rfqNos = []
    rfqNos = await contracts.rfqs.contract.methods.getRFQNos().call()
    return rfqNos
}

async function getRfqs(RfqNos = [], complete = false) {
    if(RfqNos.length == 0) {
        RfqNos = await getRfqNos()
        if(RfqNos.length == 0) {
            return []
        }
    }

    let rfqs = []
    for(let i = 0; i < RfqNos.length; i++) {

        let rfq = await getRfq( RfqNos[i], complete )        
        rfqs.push ( rfq )
        
    }

    return rfqs
}

async function getRfq(rfqNo, complete = false) {
    
    let rfq = await contracts.rfqs.contract.methods.getRFQ( rfqNo ).call()

    if(complete) {

        let rfqProducts = []
        let rfqKpis = []

        for(let i = 0; i < rfq.rfqProductIds.length; i++) {
            let rfqProduct = await getRfqProduct( rfq.rfqProductIds[i] )
            rfqProducts.push(rfqProduct)
        }

        for(let i = 0; i < rfq.rfqKpiIds.length; i++) {
            let rfqKpi = await getRfqKpi( rfq.rfqKpiIds[i] )

            let kpiId = rfqKpi.kpiId
            let kpiGroupId = rfqKpi.kpiGroupId

            rfqKpi["kpi"] = kpis[kpiGroupId][kpiId]
            rfqKpi["kpiGroup"] = kpiGroups[kpiGroupId]
            rfqKpi["scoreRuleString"] = getScoreRuleByCode(SCORE_RULE, rfqKpi.scoreRule)

            rfqKpis.push(rfqKpi)
        }

        rfq["rfqProducts"] = rfqProducts
        rfq["rfqKpis"] = rfqKpis
        rfq["kpiList"] = await getKpiList(rfq)
        rfq["buyerName"] = getUserNameByAddress(rfq.buyer)

    }
    rfq["statusString"] = getStatusByCode(RFQ_STATUS, rfq.status)

    return rfq

}


async function setWinningBidId(rfqNo, bidId) {
    
    let receipt = await contracts.rfqs.contract.methods.setWinningBidId(rfqNo, bidId).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    addReceipt(`rfqs.setWinningBidId`, receipt)


}

async function updateRfqStatus(rfqNo, status) {
    let receipt = await contracts.rfqs.contract.methods.updateRfqStatus(rfqNo, status).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    addReceipt(`rfqs.updateRfqStatus`, receipt)

}

//returns a list of KPIs, each KPI with its weight
async function getKpiList(rfq) {
    let kpisWeightsList = []

    let rfqKpis = rfq.rfqKpis
    
    for(let i = 0; i < rfqKpis.length; i++) {
        let item = []

        let rfqKpi = rfqKpis[i]

        item.push(rfqKpi.kpiGroup)
        item.push(rfqKpi.kpi)
        item.push(rfqKpi.scoreRuleString)
        item.push(rfqKpi.weight/1000)

        kpisWeightsList.push(item)
    }

    return kpisWeightsList
    
}

async function getRfqProduct(rfqProductId) {
    let rfqProduct = await contracts.rfqs.contract.methods.getRfqProduct( rfqProductId ).call()
    rfqProduct.quantity = provider.utils.fromWei(rfqProduct.quantity, "ether")
    rfqProduct.idealLeadTime = provider.utils.fromWei(rfqProduct.idealLeadTime, "ether")
    rfqProduct.idealShippingTime = provider.utils.fromWei(rfqProduct.idealShippingTime, "ether")
    return rfqProduct
}

async function getRfqKpi(rfqKpiId) {
    let rfqKpi = await contracts.rfqs.contract.methods.getRfqKpi( rfqKpiId ).call()
    rfqKpi.weight = provider.utils.fromWei(rfqKpi.weight, "ether")
    return rfqKpi
}

async function initKpiGroup(group, kpis) {
    
    let receipt = await contracts.rfqs.contract.methods.initKpiGroup(group, kpis).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    
    addReceipt(`rfqs.initKpiGroup`, receipt)
}

async function getKpis() {
    let kpis = []
    kpis = await contracts.rfqs.contract.methods.getKpis().call()
    return kpis
}

async function getKpiGroups() {
    let kpiGroups = []
    kpiGroups = await contracts.rfqs.contract.methods.getKpiGroups().call()
    return kpiGroups
}




//BLOCKCHAIN INTERFACE: BIDS
//===========================================================================================================================================================




async function addBid(rfqNo, externalId) {

    /*let rfq = await getRfq(rfqNo)
    let buyerAddress = rfq.buyer
    console.log(`buyerAddress`, buyerAddress)*/

    let receipt = await contracts.bids.contract.methods.addBid(rfqNo, externalId).send({
        from: getCurrentUser(),
        gas: 2000000,
        gasPrice: 10000000000,
    })

    
    addReceipt(`bids.addBid`, receipt)

}

async function getBidIds() {
    let bidIds = []
    bidIds = await contracts.bids.contract.methods.getBidIds().call()
    return bidIds
}

async function getBids(bidIds = [], complete = false) {
    if(bidIds.length == 0) {
        bidIds = await getBidIds()
        if(bidIds.length == 0) {
            return []
        }
    }

    let bids = []
    for(let i = 0; i < bidIds.length; i++) {

        let bid = await getBid( bidIds[i], complete )        
        bids.push ( bid )
        
    }

    return bids
}

async function getBid(bidId, complete = false) {
    
    let bid = await contracts.bids.contract.methods.getBid( bidId ).call()
    bid.score = Number(provider.utils.fromWei(bid.score, "ether")).toFixed(4)
    
    bid.sellerRating = provider.utils.fromWei(bid.sellerRating, "ether")
    bid.buyerRating = provider.utils.fromWei(bid.buyerRating, "ether")
    bid.afterSaleRating = provider.utils.fromWei(bid.afterSaleRating, "ether")

    if(complete) {

        let bidProducts = []
        let bidFiles = []
        let offers = []

        for(let i = 0; i < bid.bidProductIds.length; i++) {
            let bidProduct = await getBidProduct( bid.bidProductIds[i] )
            bidProducts.push(bidProduct)
        }

        for(let i = 0; i < bid.bidFileIds.length; i++) {
            let bidFile = await getBidFile( bid.bidFileIds[i] )
            bidFiles.push(bidFile)
        }

        for(let i = 0; i < bid.offerIds.length; i++) {
            let offer = await getOffer( bid.offerIds[i] )
            offers.push(offer)
        }

        //scoresMatrixComplete

        bid["bidProducts"] = bidProducts
        bid["bidFiles"] = bidFiles
        bid["offers"] = offers
    }
    bid["sellerName"] = getUserNameByAddress(bid.seller)
    bid["statusString"] = getStatusByCode(BID_STATUS, bid.status)

    return bid

}

async function addOffer(bidId, kpiValues) {

    for(let i = 0; i < kpiValues.length; i++) {
        kpiValues[i] = provider.utils.toWei(kpiValues[i].toString(), "ether")
    }

    let receipt = await contracts.bids.contract.methods.addOffer(bidId, kpiValues).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })

    
    addReceipt(`bids.addOffer`, receipt)
}

async function getOfferIds() {
    let offerIds = []
    offerIds = await contracts.bids.contract.methods.getOfferIds().call()
    return offerIds
}

async function getOffers(offerIds = [], complete = false) {
    if(offerIds.length == 0) {
        offerIds = await getOfferIds()
        if(offerIds.length == 0) {
            return []
        }
    }

    let offers = []
    for(let i = 0; i < offerIds.length; i++) {

        let offer = await getOffer( offerIds[i], complete )        
        offers.push ( offer )
        
    }

    return offers
}

async function getOffer(offerId, complete = false) {
    
    let offer = await contracts.bids.contract.methods.getOffer( offerId ).call()
    //console.log("offerKpiScores", offerKpiScores)
    //offer.kpiScores = offerKpiScores
    offer.score = provider.utils.fromWei(offer.score, "ether")
    for(let i = 0; i < offer.kpiValues.length; i++) {
        offer.kpiValues[i] = provider.utils.fromWei(offer.kpiValues[i], "ether")
    }
    for(let i = 0; i < offer.kpiScores.length; i++) {
        offer.kpiScores[i] = provider.utils.fromWei(offer.kpiScores[i], "ether")
    }
    offer["statusString"] = getStatusByCode(BID_STATUS, offer.status)
    return offer

}

async function addBidProduct(bidId, rfqProductId, pricePerUnit, leadTime, shippingTime, inventory, customizations, customizationsDescription, minQuantity) {
    //uint bidId, uint rfqProductId, uint pricePerUnit, uint leadTime, uint shippingTime, uint inventory, uint customizations, uint minQuantity

    let weiPricePerUnit = provider.utils.toWei(pricePerUnit.toString(), "ether")
    let weiLeadTime = provider.utils.toWei(leadTime.toString(), "ether")
    let weiShippingTime = provider.utils.toWei(shippingTime.toString(), "ether")
    let weiInventory = provider.utils.toWei(inventory.toString(), "ether")
    let weiCustomizations = provider.utils.toWei(customizations.toString(), "ether")
    let weiMinQuantity = provider.utils.toWei(minQuantity.toString(), "ether")

    let receipt = await contracts.bids.contract.methods.addBidProduct(
        bidId, 
        rfqProductId, 
        weiPricePerUnit, 
        weiLeadTime, 
        weiShippingTime, 
        weiInventory, 
        weiCustomizations, 
        customizationsDescription, 
        weiMinQuantity).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })

    
    addReceipt(`bids.addBidProduct`, receipt)

}

async function updateBidProduct(bidId, bidProductId, pricePerUnit, leadTime, shippingTime, inventory, customizations, customizationsDescription, minQuantity) {

    let weiPricePerUnit = provider.utils.toWei(pricePerUnit.toString(), "ether")
    let weiLeadTime = provider.utils.toWei(leadTime.toString(), "ether")
    let weiShippingTime = provider.utils.toWei(shippingTime.toString(), "ether")
    let weiInventory = provider.utils.toWei(inventory.toString(), "ether")
    let weiCustomizations = provider.utils.toWei(customizations.toString(), "ether")
    let weiMinQuantity = provider.utils.toWei(minQuantity.toString(), "ether")

    let receipt = await contracts.bids.contract.methods.updateBidProduct(
        bidId, 
        bidProductId, 
        weiPricePerUnit, 
        weiLeadTime, 
        weiShippingTime, 
        weiInventory, 
        weiCustomizations, 
        customizationsDescription, 
        weiMinQuantity).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })

    
    addReceipt(`bids.updateBidProduct`, receipt)
}

async function getBidProduct(bidProductId) {
    let bidProduct = await contracts.bids.contract.methods.getBidProduct( bidProductId ).call()

    bidProduct.pricePerUnit = provider.utils.fromWei(bidProduct.pricePerUnit, "ether")
    bidProduct.leadTime = provider.utils.fromWei(bidProduct.leadTime, "ether")
    bidProduct.shippingTime = provider.utils.fromWei(bidProduct.shippingTime, "ether")
    bidProduct.inventory = provider.utils.fromWei(bidProduct.inventory, "ether")
    bidProduct.customizations = provider.utils.fromWei(bidProduct.customizations, "ether")
    bidProduct.minQuantity = provider.utils.fromWei(bidProduct.minQuantity, "ether")

    return bidProduct
}

async function addBidFile(bidId, fileType, fileURI) {
    let receipt = await contracts.bids.contract.methods.addBidFile(bidId, fileType, fileURI).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })

    addReceipt(`bids.addBidFile`, receipt)

}

async function getBidFile(bidFileId) {
    let bidFile = await contracts.bids.contract.methods.getBidFile( bidFileId ).call()
    return bidFile
}

function getRandomString() {
    let randomString = (Math.random() + 1).toString(36).substring(7) + randomIntFromInterval(10000, 10000000)
    return randomString
}




//SELECTION PROCESS INTERFACE
//=============================================================================================================




async function initPath(rfqNo) {
    logs.addingAuctions && await logAuction(ACTIONS.ADD_RFQ, {rfqNo: rfqNo, bidId: 0})
}

async function openBiding(rfqNo) {

    await updateRfqStatus(rfqNo, RFQ_STATUS.BIDDING_OPEN)
    await increaseRound(rfqNo)
    logs.addingAuctions && await logAuction(ACTIONS.OPEN_BIDDING, { rfqNo: rfqNo, bidId: 0 })
}

async function submitBid(bidId) {
    await updateBidStatus(bidId, BID_STATUS.SUBMITTED)
    logs.addingAuctions && await logAuction(ACTIONS.SUBMIT_BID, { rfqNo: 0, bidId: bidId })
}

async function closeBidding(rfqNo) {
    await updateRfqStatus(rfqNo, RFQ_STATUS.REVIEWING_BIDS)
    await scoreRfq(rfqNo)
    logs.addingAuctions && await logAuction(ACTIONS.CLOSE_BIDDING, { rfqNo: rfqNo, bidId: 0 })
}

async function setBidScoresManually(bidId, updatedScores) {   
    //console.log("setBidScoresManually: bidId", bidId, "updatedScores", updatedScores) 
    let bid = await getBid(bidId)
    //console.log("bid", bid)
    let latestOfferId = bid.latestOfferId
    
    //let offer = await getOffer(latestOfferId)
    //console.log("offerScores Before Updating", offer.kpiScores)

    await setOfferKpiScores(latestOfferId, updatedScores)  

    //let offer1 = await getOffer(latestOfferId)
    //console.log("latestOfferId", latestOfferId)
    //console.log("offerScores After Updating", offer1.kpiScores)

    await calculateFinalScores(bid.rfqNo)
    logs.addingAuctions && await logAuction(ACTIONS.UPDATE_SCORES_MANUALLY, { rfqNo: 0, bidId: bidId })
}

async function openAuction(rfqNo) {
    await updateRfqStatus(rfqNo, RFQ_STATUS.AUCTION_BIDDING_OPEN)
    await increaseRound(rfqNo)
    let rfq = await getRfq(rfqNo)
    let winningBidId = rfq.winningBidId
    let bids = await getBids(rfq.bidIds)
    for(let i = 0; i < bids.length; i++) {
        if(bids[i].bidId == winningBidId) {
            await updateBidStatus(bids[i].bidId, BID_STATUS.AUCTION_WON)
        } else {
            await updateBidStatus(bids[i].bidId, BID_STATUS.AUCTION_LOST)
        }
    }
    
    logs.addingAuctions && await logAuction(ACTIONS.OPEN_AUCTION, { rfqNo: rfqNo, bidId: 0 })
}

async function submitOffer(bidId, kpiValues) {
    await updateBidStatus(bidId, BID_STATUS.AUCTION_COUNTEROFFER)
    await addOffer(bidId, kpiValues)
    
    //let bid = await getBid(bidId)
    //console.log("bid", bid)

    logs.addingAuctions && await logAuction(ACTIONS.SUBMIT_OFFER, { rfqNo: 0, bidId: bidId })
}

async function closeAuction(rfqNo) {
    await updateRfqStatus(rfqNo, RFQ_STATUS.AUCTION_REVIEWING_BIDS)

    await scoreRfq(rfqNo)
    
    logs.addingAuctions && await logAuction(ACTIONS.CLOSE_AUCTION, { rfqNo: rfqNo, bidId: 0 })

}

async function declareWinner(rfqNo) {
    await updateRfqStatus(rfqNo, RFQ_STATUS.WINNER_DECLARED)
    //update bid statuses accordingly
    let rfq = await getRfq(rfqNo)
    let winningBidId = rfq.winningBidId
    let bids = await getBids(rfq.bidIds)
    for(let i = 0; i < bids.length; i++) {
        if(bids[i].bidId == winningBidId) {
            await updateBidStatus(bids[i].bidId, BID_STATUS.AWARDED)
        } else {
            await updateBidStatus(bids[i].bidId, BID_STATUS.LOST)
        }
    }
    
    logs.addingAuctions && await logAuction(ACTIONS.DECLARE_WINNER, { rfqNo: rfqNo, bidId: 0 })
}

async function withdrawBid(bidId) {
    await updateBidStatus(bidId, BID_STATUS.WITHDRAWN)
    let bid = await getBid(bidId)
    let rfq = await getRfq(bid.rfqNo)
    let rfqNo = rfq.rfqNo
    //update rfq if winner
    if(bid.bidId == rfq.winningBidId) {
        await updateRfqStatus(rfqNo, RFQ_STATUS.WIINNER_WITHDRAWN)
    }
    
    logs.addingAuctions && await logAuction(ACTIONS.WITHDRAW_BID, { rfqNo: 0, bidId: bidId })
}

async function rateSeller(rfqNo, rating, comments) {
    await updateRfqStatus(rfqNo, RFQ_STATUS.RATINGS)
    //store rating
    let rfq = await getRfq(rfqNo)
    let winningBidId = rfq.winningBidId
    await setSellerRating(winningBidId, rating, comments)
    await updateBidStatus(winningBidId, BID_STATUS.SELLER_RATED)

    logs.addingAuctions && await logAuction(ACTIONS.RATE_SELLER, { rfqNo: rfqNo, bidId: 0 })
    //update rating of seller on user object
    
}

async function rateBuyer(rfqNo, rating, comments) {
    //store rating
    let rfq = await getRfq(rfqNo)
    let winningBidId = rfq.winningBidId
    await setBuyerRating(winningBidId, rating, comments)
    await updateBidStatus(winningBidId, BID_STATUS.BUYER_RATED)

    logs.addingAuctions && await logAuction(ACTIONS.RATE_BUYER, { rfqNo: rfqNo, bidId: 0 })

    //update rating of seller on user object
}

async function rateAfterSale(rfqNo, rating, comments) {
    //store rating
    let rfq = await getRfq(rfqNo)
    let winningBidId = rfq.winningBidId
    await setAfterSaleRating(winningBidId, rating, comments)
    await updateBidStatus(winningBidId, BID_STATUS.AFTER_SALE_RATED)

    logs.addingAuctions && await logAuction(ACTIONS.RATE_AFTER_SALE, { rfqNo: rfqNo, bidId: 0 })
    //update rating of seller on user object
}

async function completeRfq(rfqNo) {
    let rfq = await getRfq(rfqNo)
    await updateRfqStatus(rfqNo, RFQ_STATUS.COMPLETED)
    //update bid statuses accordingly
    //let rfq = await getRfq(rfqNo)
    //console.log()

    let winningBidId = rfq.winningBidId
    await updateBidStatus(winningBidId, BID_STATUS.RFQ_COMPLETED)
    
    logs.addingAuctions && await logAuction(ACTIONS.COMPLETE_RFQ, { rfqNo: rfqNo, bidId: 0 })
}

async function cancelRfq(rfqNo) {
    await updateRfqStatus(rfqNo, RFQ_STATUS.CANCELED)
    //update bid statuses accordingly
    let rfq = await getRfq(rfqNo)
    let bids = await getBids(rfq.bidIds)
    for(let i = 0; i < bids.length; i++) {
        await updateBidStatus(bids[i].bidId, BID_STATUS.RFQ_CANCELED)
    }
    
    logs.addingAuctions && await logAuction(ACTIONS.CANCEL_RFQ, { rfqNo: rfqNo, bidId: 0 })
}

async function scoreRfq(rfqNo) {
    await clearAllKpiScores(rfqNo)
    await calculateKpiScores(rfqNo)
    await calculateFinalScores(rfqNo)

}

//loop through kpiIds of the rfq and score offers for each kpi so that each offer would have a complete offer.kpiScores array
async function calculateKpiScores(rfqNo) {
    //console.log("calculateKpiScores")
    let rfq = await getRfq(rfqNo)
    let rfqKpiIds = rfq.rfqKpiIds
    let bidIds = rfq.bidIds
    //console.log("rfqKpiIds", rfqKpiIds)
    for(let i = 0; i < rfqKpiIds.length; i++) {
        let rfqKpi = await getRfqKpi(rfqKpiIds[i])
        let rule = rfqKpi.scoreRule
        //console.log("rfqKpi", rfqKpi, "rule", rule, "kpiWeights", kpiWeights)
        //console.log("kpiWeights", kpiWeights)

        let kpiOfferValues = [] //the offer values for rfqKpi        
        //loop through bids and fetch the offer that corresponds to the current round of auctioning
        for(let j = 0; j < bidIds.length; j++) {
            let bid = await getBid(bidIds[j])
            if(bid.status != BID_STATUS.NEW) {
                //uint[] memory offerIds = bid.offerIds;
                let latestOfferId = bid.latestOfferId
                let offer = await getOffer(latestOfferId)
                kpiOfferValues[j] = offer.kpiValues[i]
            }
        }
        //get scores for all bids by normalizing their values and then calculating scores according to rule
        let kpiOfferScores = normalizeValues(kpiOfferValues, rule) //the scores of offers for rfqKpi
        //console.log("kpiOfferValues", kpiOfferValues, "kpiOfferScores", kpiOfferScores)

        //loop through bids and set the score of each offer to the one corresponding to it frrom kpiOfferScores        
        for(let j = 0; j < bidIds.length; j++) {
            let bid = await getBid(bidIds[j])

            if(bid.status != BID_STATUS.NEW) {
                let latestOfferId = bid.latestOfferId
                
                await pushOfferKpiScore(latestOfferId, kpiOfferScores[j])
             }
        }

    }

}
//loop through bids and calculate the final score of each bid's offer, set the score to the bid object and to the rfq object as the winning bid
async function calculateFinalScores(rfqNo) {
    
    //console.log("calculateFinalScores rfqNo", rfqNo)

    let rfq = await getRfq(rfqNo)
    let bidIds = rfq.bidIds
    let kpiWeights = await getKpiWeights(rfqNo)
    let winningScore = 0
    let winningBidId = 0
    let winningOfferId = 0
    let bidScores = new Map()

    for(let i = 0; i < bidIds.length; i++) {
        let bid = await getBid(bidIds[i])

        if(bid.status != BID_STATUS.NEW) {
            let latestOfferId = bid.latestOfferId
            let offer = await getOffer(latestOfferId)
            let offerScores = offer.kpiScores
            let score = 0
    
            //console.log("bidId", bidIds[i], "latestOfferId", latestOfferId)
            //console.log("offer", offer)
            //console.log("offerScores", offerScores)
    
            for(let j = 0; j < offerScores.length; j++) {
                let kpiScore = kpiWeights[j] * offerScores[j]
                score = score + kpiScore
            }
    
            //console.log("score", score)
    
            bidScores.set(bidIds[i], score)
            await setBidScore(bidIds[i], score)
            await setOfferScore(latestOfferId, score)
    
            if(score > winningScore) {
                winningScore = score;
                winningBidId = bidIds[i];
                winningOfferId = latestOfferId;
            }
         }
    }
    //console.log(bidScores)
    await setWinningBidId(rfqNo, winningBidId)
}

async function getKpiWeights(rfqNo) {
    let rfq = await getRfq(rfqNo)
    let rfqKpiIds = rfq.rfqKpiIds
    let kpiWeights = []

    //loop through kpiIds of the rfq and score offers for each kpi so that each offer would have a complete offer.kpiScores array
    for(let i = 0; i < rfqKpiIds.length; i++) {

        let rfqKpi = await getRfqKpi(rfqKpiIds[i])
        let weight = rfqKpi.weight
        kpiWeights.push(weight/1000) //the /1000 is because a previous implementation was setting weight from 0 to 1000; will change that once this is fixed

    }

    return kpiWeights
}

function normalizeValues(values, rule) {
    let normalizedValues = []
			
    let minValue = Math.min(...values)
    let maxValue = Math.max(...values)
    //console.log("minValue", minValue, "maxValue", maxValue)

    //Normalize data
    for(let i = 0; i < values.length; i++) {
        let value = values[i]
        let normlizedValue = 0
        //we're handling the case where all values are equal to each other; in that case, value can equal 0, 1 or another value.
        if(minValue == maxValue) {
            //if all 0's
            if(minValue == 0) {
                normlizedValue = minValue
            
            } else { //otherwise, obtain 1: 1/1=1, 7/7=1
                normlizedValue = minValue / minValue
            }
        } else {
            normlizedValue = (value - minValue) / (maxValue - minValue)
        }
        //console.log("value", value, "normlizedValue", normlizedValue)
        if(rule == SCORE_RULE.ASCENDING) {
            normlizedValue = 1- normlizedValue
        }
        normalizedValues.push(normlizedValue)
    }
    return normalizedValues
}




//SIMULATION: HELPERS
//=========================================================================================================




async function updateBid(bidId) {
    await updateBidProducts(bidId)
    await updateBidFiles(bidId)
}

async function updateBidProducts(bidId) {
    let bid = await getBid(bidId)
    let bidProductIds = bid.bidProductIds
    for(let i = 0; i < bidProductIds.length; i++) {
        let bidProductId = bidProductIds[i]
        updateBidProductData(bidProductId)
    }
}

async function updateBidProductData(bidProductId) {

    let bidProduct = await getBidProduct(bidProductId)
    
    let rfqProduct = await getRfqProduct(bidProduct.rfqProductId)

    let pricePerUnit = randomIntFromInterval(1, 100)
    let leadTime = randomIntFromInterval( getLeadTime(rfqProduct.idealLeadTime, "min"), getLeadTime(rfqProduct.idealLeadTime, "max") )
    let shippingTime = randomIntFromInterval( getLeadTime(rfqProduct.idealLeadTime, "min"), getLeadTime(rfqProduct.idealLeadTime, "max") )
    let inventory = getInventory(rfqProduct.quantity)
    let customizations = randomIntFromInterval(1, 10)
    let customizationsDescription = "Updated list of of customizations"
    let minQuantity = getMinQuantity(rfqProduct.quantity)

    await updateBidProduct(bidProduct.bidId, bidProductId, pricePerUnit, leadTime, shippingTime, inventory, customizations, customizationsDescription, minQuantity)

}

async function updateBidFiles(bidId) {
    //console.log("bidId", bidId)
    let bid = await getBid(bidId, true)

    let bidFiles = bid.bidFiles
    let bidFileTypes = []
    for(let i = 0; i < bidFiles.length; i++) {
        let fileType = bidFiles[i].fileType
        bidFileTypes.push(fileType)
    }
    //console.log("bidFileTypes", bidFileTypes)
    bidFileTypes = bidFileTypes.map(x => parseInt(x))
    //console.log("bidFileTypes", bidFileTypes)

    let noOfFiles = bidFiles.length
    let allFileTypes = Object.keys(BID_FILE_TYPE)
    let maxNoFiles = allFileTypes.length
    //console.log("noOfFiles", noOfFiles)
    //console.log("allFileTypes", allFileTypes)
    //console.log("maxNoFiles", maxNoFiles)
    if(noOfFiles < maxNoFiles) {
        let maxAddableFiles = maxNoFiles - noOfFiles
        let newFilesToAdd = randomIntFromInterval(1, maxAddableFiles)
        let addedFiles = 0
        //console.log("maxAddableFiles", maxAddableFiles)
        //console.log("newFilesToAdd", newFilesToAdd)
        //console.log("addedFiles", addedFiles)

        for(let i = 0; i < allFileTypes.length; i++) {
            let typeName = allFileTypes[i]
            //console.log("typeName", typeName)
            //console.log("BID_FILE_TYPE[typeName]", BID_FILE_TYPE[typeName])
            
            if(!bidFileTypes.includes(BID_FILE_TYPE[typeName])) {
                
                let fileURI = `www.ipfs.io/${ getRandomString() }`
                await addBidFile(bid.bidId, BID_FILE_TYPE[typeName], fileURI)
                
                addedFiles++
                //console.log("addedFiles", addedFiles)

            }

            if(addedFiles == newFilesToAdd) {
                break
            }

        }

        
        
    }
    
}

async function initKpiValues(rfqNo, bidId) {
    
    let bid = await getBid(bidId, true)
    let rfq = await getRfq(rfqNo, true)
    let rfqKpiIds = rfq.rfqKpiIds

    let kpiValues = []
    for(let k = 0; k < rfqKpiIds.length; k++) {
        let rfqKpi = await getRfqKpi(rfqKpiIds[k])
        let kpiName = getKpiName(rfqKpi, kpis)
        let value = await generateKpiValue(rfq, bid, kpiName)

        //console.log(`${kpiName}: ${value}`)
        
        kpiValues.push(value) //this is pushed to the index in rfq.rfqKpiIds that corresponds rfqKpi, which has references to the kpiGroup and the kpiName
    }

    return kpiValues

}




//BLOCKCHAIN INTERFACE: BIDS/SCORING
//===========================================================================================================================================================




async function clearAllKpiScores(rfqNo) {
    //console.log("clearAllKpiScores rfqNo", rfqNo)
    let rfq = await getRfq(rfqNo)
    let bidIds = rfq.bidIds
    for(let i = 0; i < bidIds.length; i++) {
        let bid = await getBid(bidIds[i])
        let latestOfferId = bid.latestOfferId
        //console.log("latestOfferId", latestOfferId)
        await clearOfferKpiScores(latestOfferId)
    }
}

async function pushOfferKpiScore(offerId, kpiScore) {
    //console.log("pushOfferKpiScore offerId", offerId, "kpiScore", kpiScore)

    let weiKpiScore = provider.utils.toWei(kpiScore.toString(), "ether")

    let receipt = await contracts.bids.contract.methods.pushOfferKpiScore(offerId, weiKpiScore).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    addReceipt(`bids.pushOfferKpiScore`, receipt)

}
async function setOfferKpiScores(offerId, kpiScores) {
    //console.log("setOfferKpiScores: offerId", offerId, "kpiScores", kpiScores) 

    let weiKpiScores = []
    for(let i = 0; i < kpiScores.length; i++) {
        let weiKpiScore = provider.utils.toWei(kpiScores[i].toString(), "ether")
        weiKpiScores.push( weiKpiScore )
    }
    //console.log("kpiScores", kpiScores)
    //console.log("weiKpiScores", weiKpiScores)

    let receipt = await contracts.bids.contract.methods.setOfferKpiScores(offerId, weiKpiScores).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    addReceipt(`bids.setOfferKpiScore`, receipt)

}

async function clearOfferKpiScores(offerId) {
    let receipt = await contracts.bids.contract.methods.clearOfferKpiScores(offerId).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    
    addReceipt(`bids.clearOfferKpiScores`, receipt)
}

async function setBidScore(bidId, score) {

    let weiScore = provider.utils.toWei(score.toString(), "ether")
    
    let receipt = await contracts.bids.contract.methods.setBidScore(bidId, weiScore).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    addReceipt(`bids.setBidScore`, receipt)


}

async function setOfferScore(offerId, score) {

    let weiScore = provider.utils.toWei(score.toString(), "ether")
    
    let receipt = await contracts.bids.contract.methods.setOfferScore(offerId, weiScore).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    
    addReceipt(`bids.setOfferScore`, receipt)

}

async function updateBidStatus(bidId, status) {
    //console.log(`updateBidStatus: ${bidId}, ${status}`)
    let receipt = await contracts.bids.contract.methods.updateBidStatus(bidId, status).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    addReceipt(`bids.updateBidStatus`, receipt)

}

async function setSellerRating(bidId, rating, comments) {
    //let weiRating = provider.utils.toWei(rating.toString(), "ether")
    let receipt = await contracts.bids.contract.methods.setSellerRating(bidId, rating, comments).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    addReceipt(`bids.setSellerRating`, receipt)
}

async function setBuyerRating(bidId, rating, comments) {
    //let weiRating = provider.utils.toWei(rating.toString(), "ether")
    let receipt = await contracts.bids.contract.methods.setBuyerRating(bidId, rating, comments).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    addReceipt(`bids.setBuyerRating`, receipt)
}

async function setAfterSaleRating(bidId, rating, comments) {
    //let weiRating = provider.utils.toWei(rating.toString(), "ether")
    let receipt = await contracts.bids.contract.methods.setAfterSaleRating(bidId, rating, comments).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
    addReceipt(`bids.setAfterSaleRating`, receipt)
}



//STATS
//==============================================================================




function addReceipt(func, receipt) {
    let receipts = []
    if(!txReceipts.has(func)) {
        receipts.push(receipt)
    } else {
        receipts = txReceipts.get(func)
        receipts.push(receipt)
    }
    txReceipts.set(func, receipts)
}




//SELECTION PROCESS INTERFACE: KPIS
//===========================================================================================================================================================




async function calculateKpi(rfq, bid, kpiName, value = 0) {
    if(kpiName == kpiNames.price) {
        return calculatePrice(rfq, bid)
    }
    if(kpiName == kpiNames.leadTime) {
        return calculateLeadTime(bid)
    }
    if(kpiName == kpiNames.customizations) {
        return calculateCustomizations(bid)
    }
    if(kpiName == kpiNames.sellerRating) {
        return calculateSellerRating(bid)
    }
    if(kpiName == kpiNames.buyerRating) {
        return calculateBuyerRating(rfq)
    }
    if(kpiName == kpiNames.afterSaleRating) {
        return calculateAfterSaleRating(bid)
    }
    if(kpiName == kpiNames.qms) {
        if(isFileAttached(bid, BID_FILE_TYPE.QMS_CERTIFICATE)) {
            return 1
        }
        return 0
    }
    if(kpiName == kpiNames.ems) {
        if(isFileAttached(bid, BID_FILE_TYPE.EMS_CERTIFICATE)) {
            return 1
        }
        return 0
    }
    if(kpiName == kpiNames.wasteManagement) {
        if(isFileAttached(bid, BID_FILE_TYPE.WASTE_MANAGEMENT_POLICY)) {
            return 1
        }
        return 0
    }
    if(kpiName == kpiNames.ohms) {
        if(isFileAttached(bid, BID_FILE_TYPE.OHSMS_CERTIFICATE)) {
            return 1
        }
        return 0
    }
    if(kpiName == kpiNames.hrPolicy) {
        if(isFileAttached(bid, BID_FILE_TYPE.HR_POLICY)) {
            return 1
        }
        return 0
    }
    if(kpiName == kpiNames.infoDisclosure) {
        if(isFileAttached(bid, BID_FILE_TYPE.INFORMATION_DISCLOSURE_AGREEMENT)) {
            return 1
        }
        return 0
    }
    if(kpiName == kpiNames.socialInitiatives) {
        if(isFileAttached(bid, BID_FILE_TYPE.SOCIAL_RESPONSIBILITY_PROOF)) {
            return 1
        }
        return 0
    }
    if(kpiName == kpiNames.infoSharing) {
        if(isFileAttached(bid, BID_FILE_TYPE.INFORMATION_SYSTEM_SPECS)) {
            return 1
        }
        return 0
    }
    if(kpiName == kpiNames.productionPolicy) {
        if(isFileAttached(bid, BID_FILE_TYPE.PRODUCTION_POLICY)) {
            return 1
        }
        return 0
    }
    if(kpiName == kpiNames.productionPlan) {
        if(isFileAttached(bid, BID_FILE_TYPE.PRODUCTION_PLAN)) {
            return 1
        }
        return 0
    }
    if(kpiName == kpiNames.inventory) {
        if(isFileAttached(bid, BID_FILE_TYPE.INVENTORY_SHEET)) {
            return 1
        }
        return 0
    }
    if(kpiName == kpiNames.productionCapacity) {
        if(isFileAttached(bid, BID_FILE_TYPE.MACHINE_SPECS)) {
            return 1
        }
        return 0
    } else {
        return value
    }
}

function calculatePrice(rfq, bid) {
    let bidProducts = bid.bidProducts
    let rfqProducts = rfq.rfqProducts
    let totalPrice = 0
    for(let i = 0; i < rfqProducts.length; i++) {
        let quantity = rfqProducts[i].quantity
        let rfqProductId = rfqProducts[i].rfqProductId

        for(let j = 0; j < bidProducts.length; j++) {

            let bid_rfqProductId = bidProducts[j].rfqProductId

            if(rfqProductId == bid_rfqProductId) {
                let pricePerUnit = bidProducts[j].pricePerUnit
                totalPrice += pricePerUnit * quantity
            }
        }
    }

    //console.log("Price", totalPrice)
    //console.log("rfqProducts", rfqProducts)
    //console.log("bidProducts", bidProducts)

    return totalPrice
}

function calculateLeadTime(bid) {
    let bidProducts = bid.bidProducts
    let leadTimes = []
    let maxLeadTime = 0
    for(let i = 0; i < bidProducts.length; i++) {
        leadTimes.push(bidProducts[i].leadTime)
    }
    maxLeadTime = Math.max(...leadTimes)
    //console.log("leadTimes", leadTimes)
    //console.log("Lead Time", maxLeadTime)
    //console.log("bidProducts", bidProducts)
    return maxLeadTime
}

function calculateCustomizations(bid) {
    let bidProducts = bid.bidProducts
    let totalCustomizations = 0
    for(let i = 0; i < bidProducts.length; i++) {
        totalCustomizations += parseInt(bidProducts[i].customizations)
        //console.log("bidProducts[i].customizations", bidProducts[i].customizations, "totalCustomizations", totalCustomizations)
    }
    return totalCustomizations
}

async function calculateSellerRating(bid) {
    let users = await getUsers([bid.seller])
    let bidIds = users[0].bidIds
    if(bidIds.length == 0) {
        return 0
    }
    let bids = await getBids(bidIds, true)
    let total = 0
    let rating = 0
    for(let i = 0; i < bids.length; i++) {
        let sellerRating = bids[i].sellerRating
        total += sellerRating
    }
    
    rating = parseInt(total) / bids.length
    return rating
}

async function calculateBuyerRating(rfq) {
    let users = await getUsers([rfq.buyer])
    //console.log("users", users)
    let rfqNos = users[0].rfqNos

    if(rfqNos.length == 0) {
        return 0
    }

    let bids = []
    //get the winning bids from all completed rfqs added by buyer and push them to the bids array
    for(let i = 0; i < rfqNos.length; i++) {
        let rfq = await getRfq(rfqNos[i])
        if(rfq.status == RFQ_STATUS.COMPLETED) {
            let winningBidId = rfq.winningBidId
            let bid = await getBid(winningBidId, true)
            bids.push(bid)
        }
    }

    if(bids.length == 0) {
        return 0
    }

    let total = 0
    let rating = 0
    for(let i = 0; i < bids.length; i++) {
        let buyerRating = bids[i].buyerRating
        total += buyerRating
    }
    rating = parseInt(total) / bids.length
    return rating
}

async function calculateAfterSaleRating(bid) {
    let users = await getUsers([bid.seller])
    let bidIds = users[0].bidIds
    if(bidIds.length == 0) {
        return 0
    }
    let bids = await getBids(bidIds, true)
    let total = 0
    let rating = 0
    for(let i = 0; i < bids.length; i++) {
        let afterSaleRating = bids[i].afterSaleRating
        total += afterSaleRating
    }
    rating = parseInt(total) / bids.length
    return rating
}

function isFileAttached(bid, fileType) {
    let bidFiles = bid.bidFiles
    for(let i = 0; i < bidFiles.length; i++) {
        if(fileType == bidFiles[i].fileType) {
            return true
        }
    }
    return false
}

async function generateKpiValue(rfq, bid, kpiName) {
    let value = 0
    if(kpiName == kpiNames.downPayment) {
        let price = await calculateKpi(rfq, bid, kpiNames.price)
        //console.log("price", price)
        let downPayment = price / randomIntFromInterval(1, 5)
        value = downPayment
    }
    if(kpiName == kpiNames.installments) {
        value = randomIntFromInterval(1, 5)
    } 
    if(kpiName == kpiNames.transportationCost) {
        value = randomIntFromInterval(750, 2750)
        //console.log(kpiNames.transportationCost, value)
    }
    if(kpiName == kpiNames.freeWarranty) {
        value = randomIntFromInterval(0, 3)
    } 
    if(kpiName == kpiNames.paidWarranty) {
        value = randomIntFromInterval(0, 5)
    }
    if(kpiName == kpiNames.warrantyCost) {
        value = randomIntFromInterval(10, 1000)
    }
    if(kpiName == kpiNames.gasEmissions) {
        value = randomIntFromInterval(10000, 500000)
    }
    if(kpiName == kpiNames.energyConsumption) {
        value = randomIntFromInterval(10000, 500000)
    } else {
        //value = getKpiValue()
    }

    return calculateKpi(rfq, bid, kpiName, value)
}

function getKpiName(rfqKpi, kpis) {
    let kpiGroupId = rfqKpi.kpiGroupId
    let kpiId = rfqKpi.kpiId
    let kpiName = kpis[kpiGroupId][kpiId]
    return kpiName
}