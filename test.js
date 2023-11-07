console.log(10)
console.log((BigInt(10)).toString())
console.log((BigInt(10) / BigInt(100)).toString() )

console.log(convertToWei(0.749))


function convertToWei(number) {
    let bigNumber = number * 1000000000000000000n
    return bigNumber
}