pragma solidity ^0.4.6;
contract Project{
    Details public details;
    mapping(address=>uint) mfunders;
  
    
    struct Details{
        string name;
        address owner;
        uint targetAmount;
        uint deadline;
        uint start;
        uint totalRaised;
        bool reachedGoal;
        bool paidOut;
        bool passedDeadline;
        bool Active;
    }


    modifier HasReachedGoal(){
        details.reachedGoal = (details.targetAmount==details.totalRaised);
        _;
    }
    modifier HasPaidOut(){
        details.paidOut = (details.reachedGoal && this.balance==0);
        _;
    }

    modifier isPassedDeadline(){
        details.passedDeadline = (now >=  details.start + details.deadline * 1 days);
        _;
    }
    modifier isActive(){
        details.Active =  !details.paidOut && !details.passedDeadline;
        _;
    }
    
    function Project(uint _amount,uint _deadline,string _name) {
        details = Details(_name,tx.origin,_amount,_deadline,now,0,false,false,false,true);
    }
    
    function getProjectDetails() HasReachedGoal HasPaidOut isPassedDeadline isActive returns(string,address,uint,uint,uint,uint,uint,bool,bool,uint,bool,uint,bool){
        uint _amountFunded = mfunders[msg.sender];
        return (details.name,details.owner,details.targetAmount,details.deadline,details.start,details.totalRaised,this.balance,details.reachedGoal,details.paidOut,now,details.passedDeadline,_amountFunded,details.Active);
    }
    function payout() HasReachedGoal HasPaidOut returns (bool){
        if(details.paidOut) return false;
        if(!details.reachedGoal) return false;
        if(msg.sender != details.owner) return false;
        return details.owner.send(this.balance);
    }
    function refund() returns (bool){
        uint _amount = mfunders[msg.sender];
        if(_amount==0) return false;
        bool _success = msg.sender.send(_amount);
        if(_success){
            details.totalRaised-=_amount;
            mfunders[msg.sender]=0;
            return true;
        }
        else{
            return false;
        } 
    }
    function fund(address _addr) isPassedDeadline payable returns (bool){
        if(details.totalRaised+msg.value>details.targetAmount) throw;
        if(details.passedDeadline) throw;
      
        mfunders[tx.origin]+=msg.value;
        details.totalRaised += msg.value;
        return true;
    }
    function AmountByFunder() returns (uint,address,uint){
        return  (mfunders[msg.sender],msg.sender,details.totalRaised);
    }
 
    function getBalance() returns (uint){
        return  this.balance;
    }
} 