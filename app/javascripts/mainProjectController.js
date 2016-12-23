var app = angular.module('projectApp', []);

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

app.controller("mainProjectController", [ '$scope', '$location', '$http', '$q', '$window', '$timeout', function($scope , $location, $http, $q, $window, $timeout) {


    $scope.accounts = [];
    $scope.account = "";
    $scope.balance = "";
    $scope.Status = "";
    $scope.ActiveProjects = [];
    

     $scope.getAllProjects = function(){
        $scope.ListProjects = [];
        

    	var _fh = FundingHub.deployed();
        _fh.getAllProjects.call()
        .then(function(value){
               $scope.Status = "Loading projects...";
                for(var i=0;i<value.valueOf().length;i++){
                    console.log(value.valueOf()[i]);
                    $scope.getProjectByAddress(value.valueOf()[i]);
                }
                $scope.Status = "";
        })
        .catch(function(e){console.log("error:"+e); $scope.Status ="";});
    };

    $scope.getProjectByAddress = function(addr){
        console.log("at addr:"+addr);
      var _fh = Project.at(addr);
      _fh.getProjectDetails.call()
      .then(function(proj) {
               console.log("proj:"+proj);
              var item = {"addr":addr,"owner":proj[1],
              "thename":proj[0],"amount":proj[2],
              "deadline":proj[3],"now":proj[4],
              "totalRaised":proj[5],"cbalance":proj[6],
              "isActive":proj[12],"reachedGoal":proj[7],"amountFunded":proj[11]};
                if(item.isActive){
                    $scope.ListProjects.push(item);
                } 
               
                $scope.$apply();        
        }).catch(function(e) {
              console.log("error:"+e);
        });
    };
 

    $window.onload = function () {
        web3.eth.getAccounts(function(err, accs) {
            $scope.accounts = accs;
            $scope.account = $scope.accounts[0];
            console.log($scope.account);
            $scope.$apply();
        });
    
        $scope.getAllProjects();
    };

    $scope.getLatestProject = function(){
        var _fh = FundingHub.deployed();
        _fh.getAllProjects.call()
        .then(function(value){
                console.log(value.valueOf());
                console.log(value.valueOf()[value.valueOf().length-1]);
                $scope.getProjectByAddress(value.valueOf()[value.valueOf().length-1]); 
            })
        .catch(function(e){console.log("error:"+e)});
    };

    $scope.contribute = function(_addr,_amount){
        console.log("1:"+_addr+" 2:"+_amount);
        var _fh = FundingHub.deployed();
         $scope.Status = "Initiating transaction... (please wait)";
        _fh.contribute(_addr,{from: $scope.account,value: _amount})
    	.then(function(value) {
            $timeout(function () {
              console.log(value.valueOf());
              $scope.getAllProjects();
            });
        }).catch(function(e) {
            console.log(e);
            $scope.Status ="";
        });

    };

    $scope.payout = function(_addr){
        $scope.Status = "Initiating transaction... (please wait)";

        var p = Project.at(_addr);
        p.payout({from: $scope.account})
    	.then(function(value) {
              console.log(value.valueOf());
               $scope.getAllProjects();  
        }).catch(function(e) {
            console.log(e);
            $scope.Status ="";
        });
    };
    $scope.test = function(_addr){
        var p = Project.at(_addr);
        console.log("test:"+p);
        console.log(_addr);
        p.AmountByFunder.call().then(function(val){console.log("b1:"+val)});                       
        p.getBalance.call().then(function(val){console.log("b balance:"+val)});
    };


    $scope.refund = function(_addr){
        $scope.Status = "Initiating transaction... (please wait)";

        var p = Project.at(_addr);
        p.refund({from:$scope.account,gas: 42000}).then(function(instance){
            console.log("refund:"+instance);
            p.AmountByFunder.call().then(function(val){console.log("refund abf:"+val)});
            p.getBalance.call().then(function(val){console.log("refund balance:"+val)});
             $scope.getAllProjects();
        }).catch(function(error){
            console.log(error);
            $scope.Status ="";
        });
    };

    $scope.createProject = function(_name,_amount,_deadline){
    	var _fh = FundingHub.deployed();
        $scope.Status = "Initiating transaction... (please wait)";
    	_fh.createProject(_name,_amount,_deadline,{from: $scope.account})
    	.then(function(value) {
            $timeout(function () {
              console.log(value.valueOf());
               $scope.getAllProjects();
            });
        }).catch(function(e) {
            console.log(e);
        });
    };

//   setStatus("Initiating transaction... (please wait)");

//   meta.sendCoin(receiver, amount, {from: account}).then(function() {
//     setStatus("Transaction complete!");
//     refreshBalance();
//   }).catch(function(e) {
//     console.log(e);
//     setStatus("Error sending coin; see log.");
//   });
// };

}]);