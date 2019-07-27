var OMarket = artifacts.require('OMarket')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('OMarket', function (accounts) {

  const deployAccount = accounts[0]
  const adminAccount = accounts[1]
  const sellerAccount = accounts[2]
  const customerAccount = accounts[3]

  let instance

  beforeEach(async () => {
    instance = await OMarket.new()
  })

  describe("Setup", async () => {

    it("OWNER should be set to the deploying address", async () => {
      const owner = await instance.owner();
      assert.equal(owner, deployAccount, "the deploying address should be the owner")
    })

    it("PAUSED shoud be set to false", async () => {
      const paused = await instance.paused({ from: deployAccount });
      assert.equal(paused, false, "state should be unpaused");
    });

    it("pause can not be called other than owner", async () => {
      await catchRevert(instance.pause({ from: adminAccount }));
    });

  })

  describe("Admin", async () => {

    describe("addAdmin()", async () => {

      it("only the owner should be able to add an admin", async () => {
        await instance.addAdmin(adminAccount, { from: deployAccount });
        await catchRevert(instance.addAdmin(adminAccount, { from: adminAccount }));
      });

      it("adding an admin should triggger an event", async () => {
        const tx = await instance.addAdmin(adminAccount, { from: deployAccount });
        const eventData = tx.logs[0].args;
        assert.equal(eventData.adminAddress, adminAccount, "added admin address should match");
      });

      it("should revert when contract is in paused state", async () => {
        await instance.pause();
        await catchRevert(instance.addAdmin(adminAccount, { from: deployAccount }));
      });
    });

    it("getAdmins should include addmin address", async() => {
      await instance.addAdmin(adminAccount, { from: deployAccount});
      const admins = await instance.getAdmins({from: deployAccount});
      assert.equal(admins.length, 1);
      assert.equal(admins[0], adminAccount);
    });

    it("user should get if user is admin", async() => {
      const ownerIsAdmin = await instance.isAdmin({from: deployAccount});
      assert.equal(ownerIsAdmin, false);
      await instance.addAdmin(adminAccount, {from: deployAccount});
      const adminIsAdmin = await instance.isAdmin({from: adminAccount});
      assert.equal(adminIsAdmin, true);
      const sellerIsAdmin = await instance.isAdmin({from: sellerAccount});
      assert.equal(sellerIsAdmin, false);
    });

    describe("removeAdmin()", async () => {

      beforeEach(async () => {
        await instance.addAdmin(adminAccount, {from: deployAccount});
      });

      it("should not remove admin if the address is not in admin list", async() => {
        await catchRevert(instance.removeAdmin(adminAccount, { from: adminAccount }))
      });

      it("should remove admin properly", async() => {
        const tx = await instance.removeAdmin(adminAccount, {from: deployAccount});
        const eventData = tx.logs[0].args;
        assert.equal(eventData.adminAddress, adminAccount, "removed admin adresss should match");
        const adminList = await instance.getAdmins({from: deployAccount});
        assert.equal(adminList.length, 0, "Admin list should be empty when removed only admin");
      });

      it("should remove admin in the middle", async() => {
        await instance.addAdmin(sellerAccount, {from: deployAccount});
        await instance.addAdmin(customerAccount, {from: deployAccount});

        const tx = await instance.removeAdmin(sellerAccount, {from: deployAccount});
        const eventData = tx.logs[0].args;
        assert.equal(eventData.adminAddress, sellerAccount, "removed admin adresss should match");

        const adminList = await instance.getAdmins({from: deployAccount});
        const admins = [adminAccount, customerAccount];
        assert.sameMembers(adminList, admins, "rest admin accounts should match");

      });

    });

    describe("StoreOwner", async () => {

      beforeEach(async () => {
        await instance.addAdmin(adminAccount, { from: deployAccount });
      });

      describe("addStoreOwner()", async () => {

        it("only the admin should be able to add a store owner", async () => {
          await instance.addStoreOwner(sellerAccount, 'Seller', {from: adminAccount});
          await catchRevert(instance.addStoreOwner(sellerAccount, 'Seller', { from: deployAccount }));
        });

        it("adding an storeOwner should triggger an event", async () => {
          const tx = await instance.addStoreOwner(sellerAccount, 'Seller', { from: adminAccount });
          const eventData = tx.logs[0].args;
          assert.equal(eventData.storeOwnerAddress, sellerAccount, "added storeOwner address should match");
        });

        it("should not add store owners when contract is paused", async () => {
          await instance.pause({ from: deployAccount });
          await catchRevert(instance.addStoreOwner(sellerAccount, 'Seller', { from: adminAccount }));
        });

      });

      describe("has valid storeOwner", async () => {

        beforeEach(async () => {
          await instance.addStoreOwner(sellerAccount, 'Seller', {from: adminAccount});
        });

        it("getStoreOwners should include store owner address", async() => {
          const sellers = await instance.getStoreOwners({from: adminAccount});
          assert.equal(sellers.length, 1);
          assert.equal(sellers[0], sellerAccount);
        });

        it("readStoreOwner should return informations about store owner", async() => {
          const result = await instance.readStoreOwner(sellerAccount, {from: adminAccount});
          const owner = { addr: result['0'], name: result['1'], isActive: result['2']};
          assert.equal(owner.addr, sellerAccount, 'Store Owner Address should be same');
          assert.equal(owner.name, 'Seller', 'Store Owner name should be same');
          assert.equal(owner.isActive, true, 'Account should be active after first creation');
        });

        it("should not add same store owner again", async() => {
          await catchRevert(instance.addStoreOwner(sellerAccount, 'Seller', { from: adminAccount }));
        });

        it("user should get if user is storeOwner", async() => {
          const isAdminStoreOwner = await instance.isStoreOwner({from: adminAccount});
          assert.equal(isAdminStoreOwner, false);
          const isSellerStoreOwner = await instance.isStoreOwner({from: sellerAccount});
          assert.equal(isSellerStoreOwner, true);
        });

        it("can toggle active status", async() => {
          let txResult = await instance.toggleStoreOwnerStatus(sellerAccount, {from: adminAccount});
          let status = txResult.logs[0].args[1];
          assert.equal(false, status, 'Store owner should not be active');
          txResult = await instance.toggleStoreOwnerStatus(sellerAccount, {from: adminAccount});
          status = txResult.logs[0].args[1];
          assert.equal(true, status, 'Store owner should be active');
        });

        it("toggle status should be reverted if the address is not store owner", async() => {
          await catchRevert(instance.toggleStoreOwnerStatus(adminAccount, {from: adminAccount}));
        });

      });

    });

  });

  describe('Stores', async () => {
    const STORE_NAME = 'My Awesome Store';
    const STORE_LABELS = ['Food', 'Goods', 'Electronics'];
    beforeEach(async () => {
      await instance.addAdmin(adminAccount, { from: deployAccount});
      await instance.addStoreOwner(sellerAccount, 'Seller', {from: adminAccount});
    });

    it('should create new store from storeOwner', async () => {
      const tx = await instance.addNewStore(STORE_NAME, STORE_LABELS.join(','), {from: sellerAccount});
      const event = tx.logs.find(log => log.event === 'CreatedNewStore');
      const ownerAddress = event.args[0];
      const addressOfStore = event.args[1];
      assert.equal(ownerAddress, sellerAccount, 'owner should be seller');
      assert.isNotNull(addressOfStore, 'Need to receive new address of the store');
    });

    it('store list should revert', async () => {
      await catchRevert(instance.getStores({from: sellerAccount}), 'when there is no store of the owner');
    })

    describe('when created a store', async () => {
      let firstStoreAddress = null;
      beforeEach(async () => {
        const tx = await instance.addNewStore(STORE_NAME, STORE_LABELS.join(','), {from: sellerAccount});
        const event = tx.logs.find(log => log.event === 'CreatedNewStore');
        firstStoreAddress = event.args[1];
      });
      it('store list for owner should contain first store', async () => {
        const stores = await instance.getStores({from: sellerAccount});
        assert.include(stores, firstStoreAddress, 'first address that is created should be in store list');
        assert.equal(stores[0], firstStoreAddress, 'first item of the stores must be first store address');
      });
      it('can not create more than 5 store', async () => {
        for (const x of Array(4).keys()) {
          await instance.addNewStore(STORE_NAME + x, STORE_LABELS.join(','), {from: sellerAccount});
        }
        await catchRevert(instance.addNewStore(STORE_NAME, STORE_LABELS.join(','), {from: sellerAccount}), 'should be reverted on 6th');
      });
    });
  });

});
