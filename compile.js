// This code will compile smart contract and generate its ABI and bytecode
// Alternatively, you can use something like `npm i solc && npx solcjs MyContract.sol --bin --abi`

const solc = require("solc")
const path = require("path")
const fs = require("fs")

//const fileName = "SmartContract.sol"
const contractName = "SmartContract"
const compileTo = "../project-6/src/artifacts"

function compile(contractName, compileTo) {
    // Read the Solidity source code from the file system
    let fileName = `${contractName}.sol`
    const contractPath = path.join(__dirname, fileName)
    const sourceCode = fs.readFileSync(contractPath, "utf8")

    // solc compiler config
    const input = {
        language: "Solidity",
        sources: {
            [fileName]: {
                content: sourceCode,
            },
        },
        settings: {
            outputSelection: {
                "*": {
                    "*": ["*"],
                },
            },
        },
    }

    let compileToPath = compileTo == "" ? __dirname : compileTo

    // Compile the Solidity code using solc
    const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)))
    // Write the Contract ABI to a new file
    const compiledCodePath = path.join(compileToPath, `${contractName}.json`)
    fs.writeFileSync(compiledCodePath, JSON.stringify(compiledCode, null, "\t"))
    

    // Get the bytecode from the compiled contract
    const bytecode = compiledCode.contracts[fileName][contractName].evm.bytecode.object

    // Write the bytecode to a new file
    const bytecodePath = path.join(compileToPath, `${contractName}Bytecode.bin`)
    fs.writeFileSync(bytecodePath, bytecode)

    // Log the compiled contract code to the console
    console.log("Contract Bytecode:\n", bytecode)

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
    console.log("Contract ABI:\n", abi)

}

compile(contractName, compileTo)


