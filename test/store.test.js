var Store = artifacts.require('Store')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('Store', function (accounts) {

  const deployAccount = accounts[0]
  const adminAccount = accounts[1]
  const sellerAccount = accounts[2]
  const customerAccount = accounts[3]

  const STORE_NAME = 'Store#1';
  const STORE_LABELS = 'food,burger,electronics';

  let instance

  const p_potato = {
    name: 'potato',
    description: 'delicious potatoes',
    imageURL: 'http://',
    totalStock: 5
  }

  const p_tomato = {
    name: 'tomato',
    description: 'red tomatoes',
    imageURL: 'http://',
    totalStock: 10
  }

  const p_corn = {
    name: 'corn',
    description: 'long corns',
    imageURL: 'http://',
    totalStock: 20
  }

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
    });

  });

  describe('Adding product', async () => {
    it("only the owner should be able to add an product", async() => {
      await instance.addProduct(p_potato.name, p_potato.description, p_potato.imageURL, p_potato.totalStock, {from: deployAccount} )
      await catchRevert(instance.addProduct(p_potato.name, p_potato.description, p_potato.imageURL, p_potato.totalStock, {from: adminAccount}))
    });

    it("adding an product should emit an product with the provided product details", async() => {
      const tx = await instance.addProduct(p_potato.name, p_potato.description, p_potato.imageURL, p_potato.totalStock, {from: deployAccount} )
      const productData = tx.logs[0].args

      assert.equal(productData.name, p_potato.name, "the added product name should match")
      assert.equal(productData.desc, p_potato.description, "the added product descriptions should match")
      assert.equal(productData.imageURL, p_potato.imageURL, "the added product Urls should match")
      assert.equal(productData.totalStock.toString(10), p_potato.totalStock.toString(10), "the added product total stock should match")
    });

  });

  describe("readProduct()", async() =>{
    it("providing the product Id should return the correct product details", async() => {
      await instance.addProduct(p_potato.name, p_potato.description, p_potato.imageURL, p_potato.totalStock, {from: deployAccount} )
      const productDetails = await instance.readProduct(0)

      assert.equal(productDetails['0'], p_potato.name, "the prpduct names should match")
      assert.equal(productDetails['1'], p_potato.description, "the prpduct descriptions should match")
      assert.equal(productDetails['2'], p_potato.imageURL, "the imageURL details should match")
      assert.equal(productDetails['3'].toString(10), p_potato.totalStock.toString(10), "the same number of stocks should be available")
      assert.equal(productDetails['4'], 0, "the product sales should be 0");
      assert.equal(productDetails['5'], true, "the product should be available");

    })
  })


});
