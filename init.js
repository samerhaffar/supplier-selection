/*
This file is intended to deploy the smart contract and populate it with data so it is easy to interact with it for testing and demonstration purposes 
without having to make so many inputs on each new dpeloyment.
*/
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require("fs")

const USER_TYPE = {
    BUYER: 0,
    SELLER: 1
}

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

const usersData = []
const productsData = []
const noBuyers = 3
const noSellers = 7
const noProductsPerSeller = {min: 1, max: 10}
const noVerifiedUsers = 17

const noRfqsPerBuyer = { min: 2, max: 2 }
const noProductsPerRfq =  { min: 1, max: 3 }
const noKpisPerRfq =  { min: 3, max:3 } //max cannot be more than kpis.length

const txReceipts = []

const logs = {
    authorityAccount: false,
    contractDeployment: false,
    userRegistration: false,
    addingRfqs: true,
    addingRfqProducts: false,
    addingRfqKpis: false,
}


const networkURL = "http://localhost:7545"
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
    }
}


init()



async function init() {
    console.log("SETTING AUTHORITY ACCOUNT")
    logs.authorityAccount && console.log("========================")
    await setAuthorityAccount()
    //deploy, connect, account, register (user, products), verify
    //===============================================================
    //deploy users
    console.log("\nDEPLOYING CONTRACT: USERS, PRODUCTS")
    logs.contractDeployment && console.log("========================================")
    await deployContract(contracts.users)

    //deploy products
    await deployContract(contracts.products)
    
    //register users (user, products)
    console.log(`\nREGISTERING USERS: ${noBuyers} BUYERS, ${noSellers} SELLERS (${noProductsPerSeller.min} to ${noProductsPerSeller.max} PRODUCTS PER SELLER)`)
    logs.userRegistration && console.log("=========================================================================")
    await registerUsers()

    //deploy rfqs
    console.log("\nDEPLOYING CONTRACT: RFQS")
    logs.contractDeployment && console.log("==============================")
    await deployContract(contracts.rfqs, [contracts.users.contractAddress, contracts.products.contractAddress])
    
    //add rfqs
    console.log(`\nADDING RFQS: ${noRfqsPerBuyer.min} to ${noRfqsPerBuyer.max} RFQS PER BUYER, (${noProductsPerRfq.min} to ${noProductsPerRfq.max} PRODUCTS, AND, ${noKpisPerRfq.min} to ${noKpisPerRfq.max} KPIS, PER RFQ) `)
    logs.addingRfqs && console.log("=====================================================================================")
    await addRfqs()

    //add bids

    //start auction

    //declare winner

    //rate

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

function setAsCurrentUser(userAddress) {
    mainUserAccounts.currentUser = userAddress
    return true
}

function getCurrentUser() {
    return mainUserAccounts.currentUser
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
    for(let i = 1; i < productsCSV.length; i++) {
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
            setAsCurrentUser(userAddress)
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
            setAsCurrentUser(userAddress)
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

    setAsCurrentUser( getAuthorityAccount() )

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
    let kpis = await getKpis() //instantiated here to avoid instantiation each time
    //add rfqs with sellers to ensure that the guard is working; try adding rfqs with non-verified users, or non users at all

    //add rfqs with buyers
    //pick a random buyer, add a number of rfqs with him, then pick another buyer, until all buyers are passed over
    let noRfqsAdded = 0
    for(let i = 0; i < usersData.length; i++) {
        let user = usersData[i]
        //if the user is a buyer and verified, then we add rfqs for him
        if(user.verified && user.registered && user.userType == USER_TYPE.BUYER) {
            //console.log("processing user", user.userAddress)

            let noRfqsAddedPerSeller = 0
            //decide the number of rfqs to be added for this buyer
            let noRfqsToBeAdded = randomIntFromInterval(noRfqsPerBuyer.min, noRfqsPerBuyer.max)
            //set current user to the buyer's account
            setAsCurrentUser(user.userAddress)
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
                //console.log("externalId", externalId)
                //console.log("rfqFromContract", rfqFromContract)
                
                //add the rfq's products
                let addedRfqProducts = 0
                let noRfqProductsToBeAdded = randomIntFromInterval(noProductsPerRfq.min, noProductsPerRfq.max)
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
                logs.addingRfqProducts && console.log(`Successfully added ${addedRfqProducts} out of ${noRfqProductsToBeAdded} products for RfqNo #${rfqFromContract.rfqNo}, user ${ getCurrentUser() } `)
                
                //add the rfq's KPIs
                let addedRfqKpis = 0
                let totalRfqKpisToAdd = randomIntFromInterval(noKpisPerRfq.min, noKpisPerRfq.max)
                let weight = {
                    totalWeight: 1, //cannot start at 0 because 
                    getWeight: function() {
                        let upperInterval = this.totalWeight + Math.round( (1000 / kpis.length) ) //dividing weight evenly across all kpis so we get as many of the criteria as possible added and try to avoid the isValid condition
                        let weight = randomIntFromInterval(this.totalWeight, upperInterval)
                        this.totalWeight += weight
                        return weight
                    },
                    isValid: function() {
                        return this.totalWeight <= 1000
                    }
                }
                for(let j = 0; j < kpis.length; j++) {
                    let kpi = kpis[j]
                        //uint rfqNo, string memory kpi, uint weight, SCORE_RULE scoreRule, string memory comments

                    let kpiWeight = weight.getWeight()
                    if(!weight.isValid()) {
                        logs.addingRfqKpis && console.log(`Adding KPIs stopped at "${kpi}" because its weight is ${kpiWeight}, which will make totalWeight ${weight.totalWeight}`)
                        break
                    }

                    let scoreRule = getScoreRule(kpi)
                    let comments = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    
                    await addRfqKpi(parseInt(rfqFromContract.rfqNo), kpi, kpiWeight, scoreRule, comments)
                    addedRfqKpis++
                    
                    if(addedRfqKpis == totalRfqKpisToAdd) {
                        break
                    }
                }
                logs.addingRfqKpis && console.log(`Successfully added ${addedRfqKpis} out of ${totalRfqKpisToAdd} KPIs for RfqNo #${rfqFromContract.rfqNo}, user ${ getCurrentUser() } `)
                
                noRfqsAdded++
            }
        }/*
        if(noRfqsAdded == noRfqs) {
            break
        }*/
    }    
    //let rfqs = await getRfqs([], true)
    //let rfq = rfqs[0]
    //console.log("rfqs", rfq)
    logs.addingRfqs && console.log(`Successfully added ${noRfqsAdded} RFQs`)

    //add rfq products
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
    logs.contractDeployment && console.log("estimated gas:", gas)

    try {
        let txHash = ""
        // Deploy the contract to the Ganache network
        const tx = await myContract.send({
            from: defaultAccount,
            gas,
            gasPrice: 10000000000,
        }).on("transactionHash", (hash) => {
            txHash = hash
        })
        logs.contractDeployment && console.log(`Contract "${contractName}" deployed at address: ${tx.options.address}`)

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

async function toggleVerify(userAddress) {
    try {
        let result = await contracts.users.contract.methods.toggleVerify(userAddress).send({
            from: getCurrentUser(),
            gas: 1000000,
            gasPrice: 10000000000,
        })
        return result

    } catch(error) {
        console.log("toggleVerify(): error executing function")
        console.log(error)
    }


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
            storedUser = await contract.methods.register(userType, name,contactDetails, productBarcodes).send({
                from: getCurrentUser(),
                gas: 1000000,
                gasPrice: 10000000000,
            })
            //console.log(`User ${contractData.userAddress} registered successfully on  contract ${contractData.contractAddress}.`)
            if(products.length != 0) {
                //console.log(`User ${contractData.userAddress} product registeration initiated.`)
                for(let i = 0; i < products.length; i++) {
                    let product = products[i]
                    storedProducts.push( await addProduct(product.barcode, product.productName, product.specsURI) )
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

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}



//verify 1/5 of the users



//add rfq, get rfq
//===============================================================

//add 10 rfqs, 2 per buyer,  3-20 products per rfq, 5-ALL kpis per rfq





//report on gas consumption (from central transaction repository), for each function, and collectively + calculate costs
//=======================================================================================================================


//userIsVerified userIsBuyer
async function addRfq(docURI, externalId) {
    
    result = await contracts.rfqs.contract.methods.addRFQ(docURI, externalId).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
}

async function addRfqProduct(rfqNo, barcode, quantity, shipTo, idealLeadTime, idealShippingTime) {
    

    //rfqNo, rfqProductId, barcode, quantity, shipTo, idealLeadTime, idealShippingTime
    //[rfqProduct.rfqNo, rfqProduct.rfqProductId, rfqProduct.barcode, rfqProduct.quantity, rfqProduct.shipTo, rfqProduct.idealLeadTime, rfqProduct.idealShippingTime]
    result = await contracts.rfqs.contract.methods.addRFQProduct(rfqNo, barcode, quantity, shipTo, idealLeadTime, idealShippingTime).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })
}

async function addRfqKpi(rfqNo, kpi, weight, scoreRule, comments) {
    result = await contracts.rfqs.contract.methods.addRfqKpi(rfqNo, kpi, weight, scoreRule, comments).send({
        from: getCurrentUser(),
        gas: 1000000,
        gasPrice: 10000000000,
    })

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
            rfqKpis.push(rfqKpi)
        }

        rfq["rfqProducts"] = rfqProducts
        rfq["rfqKpis"] = rfqKpis

    }

    return rfq

}

async function getRfqProduct(rfqProductId) {
    let rfqProduct = await contracts.rfqs.contract.methods.getRfqProduct( rfqProductId ).call()
    return rfqProduct
}

async function getRfqKpi(rfqKpiId) {
    let rfqKpi = await contracts.rfqs.contract.methods.getRfqKpi( rfqKpiId ).call()
    return rfqKpi
}

async function getKpis() {
    let kpis = []
    kpis = await contracts.rfqs.contract.methods.getKpis().call()
    return kpis
}

function getRandomString() {
    let randomString = (Math.random() + 1).toString(36).substring(7) + randomIntFromInterval(10000, 10000000)
    return randomString
}
/*
function hashCode(string) {
    var hash = 0,
      i, chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
      chr = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}




struct RFQProduct {
    uint rfqNo;
    uint rfqProductId;
    string barcode;
    uint quantity;
    string shipTo; //can we consider this an enum to automate shipping costs when on autopilot
    uint idealLeadTime; //could be number for days
    uint idealShippingTime; //could be number for days
    //perhaps we can add "status" which shows us whether active or disabled

}

struct RFQKPI {
    uint rfqNo;
    uint rfqKpiId;
    string kpi;
    uint weight;
    SCORE_RULE scoreRule;
    string comments;
    //perhaps we can add "status" which shows us whether active or disabled
}

struct RFQ {
    uint rfqNo;
    uint[] rfqProductIds; //barcode => RFQProduct object
    //string[] productBarcodes; //although reachable via RFQProduct objects; this makes it more efficient and cheaper for sellsProduct
    uint[] rfqKpiIds; //KPI => RFQKPI object
    address buyer;
    RFQ_STATUS status;
    string docURI;
}


function addRFQ(string memory docURI) public userIsVerified userIsBuyer returns(bool)

function addRFQProduct(RFQProduct memory rfqProductArg) 
public 
    userIsVerified 
    userIsBuyer 
    validRFQNo(rfqProductArg.rfqNo) 
    validProductBarcode(rfqProductArg.barcode) 
returns(bool) {

function addRFQKPI(uint rfqNo, string memory kpi, uint weight, SCORE_RULE scoreRule, string memory comments) public 
    userIsVerified 
    userIsBuyer 
    validRFQNo(rfqNo) 
returns(bool) {

function getRFQNos() public view 

function getRFQ(uint rfqNo) public view 

*/