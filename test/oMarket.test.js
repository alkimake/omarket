var OMarket = artifacts.require('OMarket')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('OMarket', function(accounts) {

    const deployAccount = accounts[0]
    const adminAccount = accounts[1]
    const sellerAccount = accounts[2]
	const customerAccount = accounts[3]

	let instance

    beforeEach(async () => {
        instance = await OMarket.new()
	})

	describe("Setup", async() => {

        it("OWNER should be set to the deploying address", async() => {
            const owner = await instance.owner()
            assert.equal(owner, deployAccount, "the deploying address should be the owner")
        })
    })
})
