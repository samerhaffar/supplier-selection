// This code will compile smart contract and generate its ABI and bytecode
// Alternatively, you can use something like `npm i solc && npx solcjs MyContract.sol --bin --abi`

const solc = require("solc")
const path = require("path")
const fs = require("fs")

//const fileName = "SmartContract.sol"
const contractNames = [ "Utils", "Types", "Users", "Products", "RFQs", "Bids"]
exports.contractNames = contractNames

const compileTo = "./compiled"//"../project-6/src/artifacts"

function getInput(contractNames) {

    let sources = {}
    for(let i = 0; i < contractNames.length; i++) {
        let fileName = `${contractNames[i]}.sol`
        let contractPath = path.join(__dirname + "/contracts", fileName)
        let sourceCode =  fs.readFileSync(contractPath, "utf8")
        sources[fileName] = {content: sourceCode}
    }
    
    let input = {
        language: "Solidity",
        sources: sources,
        settings: {
            outputSelection: {
                "*": {
                    "*": ["*"],
                },
            },
        },
    }

    return input
}

let input = getInput(contractNames)

//console.log(input)

contractNames.forEach((c) => compile(c, compileTo, input))

function compile(contractName, compileTo, input) {
    // Read the Solidity source code from the file system
    let fileName = `${contractName}.sol`
    console.log(contractName)
    let compileToPath = compileTo == "" ? __dirname : compileTo

    // Compile the Solidity code using solc
    const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)))
    //console.log(compiledCode)
    // Write the Contract ABI to a new file
    const compiledCodePath = path.join(compileToPath, `${contractName}.json`)
    fs.writeFileSync(compiledCodePath, JSON.stringify(compiledCode, null, "\t"))
    

    // Get the bytecode from the compiled contract
    const bytecode = compiledCode.contracts[fileName][contractName].evm.bytecode.object

    // Write the bytecode to a new file
    const bytecodePath = path.join(compileToPath, `${contractName}Bytecode.bin`)
    fs.writeFileSync(bytecodePath, bytecode)

    // Log the compiled contract code to the console
    //console.log("Contract Bytecode:\n", bytecode)

    // Get the ABI from the compiled contract
    const abi = compiledCode.contracts[fileName][contractName].abi

    // Write the Contract ABI to a new file
    const abiPath = path.join(compileToPath, `${contractName}Abi.json`)
    fs.writeFileSync(abiPath, JSON.stringify(abi, null, "\t"))

    const AbiBytecode = {
        abi: abi,
        bytecode: bytecode
    }
    const AbiBytecodePath = path.join(compileToPath, `${contractName}AbiBytecode.json`)
    fs.writeFileSync(AbiBytecodePath, JSON.stringify(AbiBytecode, null, "\t"))

    // Log the Contract ABI to the console
    //console.log("Contract ABI:\n", abi)

}



