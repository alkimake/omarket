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

	describe("Admin", async() => {
		describe("addAdmin()", async() => {
			it("only the owner should be able to add an admin", async() => {
				await instance.addAdmin(adminAccount, {from: deployAccount});
				await catchRevert(instance.addAdmin(adminAccount, {from: adminAccount}));
			});
			it("adding an admin should triggger an event", async() => {
				const tx = await instance.addAdmin(adminAccount, {from: deployAccount});
				const eventData = tx.logs[0].args;
				assert.equal(eventData.adminAddress, adminAccount, "added admin address should match");
			});
		});
	});
})
