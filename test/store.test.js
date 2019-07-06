var Store = artifacts.require('Store')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('Store', function (accounts) {

  const deployAccount = accounts[0]
  const adminAccount = accounts[1]
  const sellerAccount = accounts[2]
  const customerAccount = accounts[3]

  const STORE_NAME = 'Store#1';
  const STORE_LABELS = 'food,burger,potatoes';

  let instance

  beforeEach(async () => {
    instance = await Store.new(deployAccount, STORE_NAME, STORE_LABELS)
  })

  describe("Setup", async () => {

    it("OWNER should be set to the deploying address", async () => {
      const owner = await instance.owner();
	  assert.equal(owner, deployAccount, "the deploying address should be the owner");
	  const instance2 = await Store.new(sellerAccount, STORE_NAME, STORE_LABELS);
	  const owner2 = await instance2.owner();
	  assert.equal(owner2, sellerAccount, "owner can be transferred on initialization");
    })

  })

});
