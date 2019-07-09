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
    totalStock: 5,
    price: 10
  }

  const p_tomato = {
    name: 'tomato',
    description: 'red tomatoes',
    imageURL: 'http://',
    totalStock: 10,
    price: 50
  }

  const p_corn = {
    name: 'corn',
    description: 'long corns',
    imageURL: 'http://',
    totalStock: 20,
    price: 25
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

    it("Info", async () => {
      const info = await instance.getInfo({from: deployAccount});
      const labels = STORE_LABELS.split(",");
      assert.equal(info['0'], STORE_NAME, "Name should return correctly");
      assert.deepEqual(info['1'], labels, "Labels should return correctly");
    });

  });

  describe('Adding product', async () => {
    it("only the owner should be able to add an product", async() => {
      await instance.addProduct(p_potato.name, p_potato.description, p_potato.imageURL, p_potato.totalStock, p_potato.price, {from: deployAccount} )
      await catchRevert(instance.addProduct(p_potato.name, p_potato.description, p_potato.imageURL, p_potato.totalStock, p_potato.price, {from: adminAccount}))
    });

    it("adding an product should emit an product with the provided product details", async() => {
      const tx = await instance.addProduct(p_potato.name, p_potato.description, p_potato.imageURL, p_potato.totalStock, p_potato.price, {from: deployAccount} )
      const productData = tx.logs[0].args

      assert.equal(productData.name, p_potato.name, "the added product name should match")
      assert.equal(productData.desc, p_potato.description, "the added product descriptions should match")
      assert.equal(productData.imageURL, p_potato.imageURL, "the added product Urls should match")
      assert.equal(productData.totalStock.toString(10), p_potato.totalStock.toString(10), "the added product total stock should match")
    });

  });

  describe("readProduct()", async() =>{
    it("providing the product Id should return the correct product details", async() => {
      await instance.addProduct(p_potato.name, p_potato.description, p_potato.imageURL, p_potato.totalStock, p_potato.price, {from: deployAccount} )
      const productDetails = await instance.readProduct(0)

      assert.equal(productDetails['0'], p_potato.name, "the prpduct names should match")
      assert.equal(productDetails['1'], p_potato.description, "the prpduct descriptions should match")
      assert.equal(productDetails['2'], p_potato.imageURL, "the imageURL details should match")
      assert.equal(productDetails['3'].toString(10), p_potato.totalStock.toString(10), "the same number of stocks should be available")
      assert.equal(productDetails['4'], true, "the product should be available");
      assert.equal(productDetails['5'].toString(10), p_potato.price.toString(10), "the product price should match");

    })
  })

  describe("buyProducts()", async() =>{
    beforeEach(async () => {
      await instance.addProduct(p_potato.name, p_potato.description, p_potato.imageURL, p_potato.totalStock, p_potato.price, {from: deployAccount} );
    })
    it("products should only be able to be purchased when they are available", async() => {
      const amount = 1

      // event w/ id 1 does not exist, therefore not open
      await catchRevert(instance.buyProducts(1, amount, {from: deployAccount, value: p_potato.price}))

      await instance.buyProducts(0, amount, {from: deployAccount, value: p_potato.price})

      const eventDetails = await instance.readProduct(0)
      const afterStock = p_potato.totalStock-amount;
      assert.equal(eventDetails['3'], afterStock, `the product stock should be ${afterStock}`)
    });
    it("products should only be able to be purchased when enough value is sent with the transaction", async() => {
      const amount = 1
      await catchRevert(instance.buyProducts(0, amount, {from: deployAccount, value: p_potato.price - 1}))
    });
    it("products should only be able to be purchased when there are enough products remaining", async() => {
      const amount = Math.floor(p_potato.totalStock/2)+1
      await instance.buyProducts(0, amount, {from: deployAccount, value: p_potato.price * amount})
      await catchRevert(instance.buyProducts(0, amount, {from: adminAccount, value: p_potato.price * amount}))
    });
    it("a LogBuyProducts() event with the correct details should be emitted when products are purchased", async() => {
      const amount = 1

      const tx = await instance.buyProducts(0, amount, {from: deployAccount, value: p_potato.price * amount})
      const eventData = tx.logs[0].args

      assert.equal(eventData.buyer, deployAccount, "the buyer account should be the msg.sender" )
      assert.equal(eventData.productId, 0, "the event should have the correct productId")
      assert.equal(eventData.amount, amount, "the event should have the correct number of products purchased")
    });

  });
});
