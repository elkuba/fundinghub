contract('FundingHub', function (accounts) {
    // it.only('should create a project', function (done) {
    it('should refund', function () {
        var fh = FundingHub.deployed();
        var p;

        fh.createProject("TestName", 100, 5, {from:accounts[0]}).then(function(instance){
            var _logProject = fh.getAllProjects.call()
            .then(function(obj){
              console.log(obj);
              var _addr = obj[0];

              p = Project.at(_addr);
              console.log(p.address);


               p.getProjectDetails.call()
              .then(function(proj) {
                    var item = {"addr":_addr,"owner":proj[1],"thename":proj[0],"amount":proj[2],"deadline":proj[3],"now":proj[4],"totalRaised":proj[5],"cbalance":proj[6]};
                    console.log(item);
                }).catch(function(e) {
                      console.log("error:"+e);
                });

             fh.contribute(_addr,{from: accounts[0],value: 50})
              .then(function(value) {
                   
                      


                   
                      p.AmountByFunder.call().then(function(val){console.log("abf:"+val)});
             
                      p.getBalance.call().then(function(val){console.log("a balance:"+val)});

                        p.refund({from:accounts[0]}).then(function(instance){
                            console.log("refund:"+instance);
                           
                            p.AmountByFunder.call().then(function(val){console.log("refund abf:"+val)});
                           
                            p.getBalance.call().then(function(val){console.log("refund balance:"+val)});

                        }).catch(function(error){
                            console.log(error);
                        });


                        //   p.payout({from:accounts[0]}).then(function(instance){
                        //     console.log("payout:"+instance);
                           
                        //     p.AmountByFunder.call().then(function(val){console.log("payout abf:"+val)});
                           
                        //     p.getBalance.call().then(function(val){console.log("payout balance:"+val)});

                        // }).catch(function(error){
                        //     console.log(error);
                        // });
                  
                }).catch(function(e) {
                    console.log(e);
                });
            });
        });

    });
});
