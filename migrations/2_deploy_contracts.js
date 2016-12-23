module.exports = function(deployer) {
  deployer.autolink();
  	web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      console.log("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];
  });
  deployer.deploy(FundingHub).then(function () {
  		FundingHub.deployed().createProject("test", 100000000, 100,  {from: account});
  	});
};
