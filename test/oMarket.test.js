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
    });
    describe("removeAdmin()", async () => {
      it("should not remove admin if the address is not in admin list", async() => {
        await catchRevert(instance.removeAdmin(adminAccount, { from: adminAccount }))
      });
      it("should remove admin properly", async() => {
        await instance.addAdmin(adminAccount, {from: deployAccount});
        const tx = await instance.removeAdmin(adminAccount, {from: deployAccount});
        const eventData = tx.logs[0].args;
        assert.equal(eventData.adminAddress, adminAccount, "removed admin adresss should match");
        const adminList = await instance.getAdmins({from: deployAccount});
        assert.equal(adminList.length, 0, "Admin list should be empty when removed only admin");
      });
      it("should remove admin in the middle", async() => {
        await instance.addAdmin(adminAccount, {from:deployAccount});
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
  });
})
