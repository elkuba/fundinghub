pragma solidity ^0.4.6;

import "Project.sol";

contract FundingHub{
    address[] public projects;
    
    event logProject(string _name, address _addr, uint _amount, uint _deadline);
    
    function createProject(string _name,uint _amount,uint _deadline) returns(bool){
        Project newProjectAddress = new Project(_amount,_deadline,_name);
        projects.push(newProjectAddress);
        logProject(_name,newProjectAddress,_amount,_deadline);
        return true;
    }
 
    function contribute(address _projectAddress) payable returns(bool){
        Project project = Project(_projectAddress);
        return project.fund.value(msg.value)(msg.sender);
    }

    function getAllProjects() returns(address[]){
        return projects;
    }

    function numberOfAllProjects() returns(uint number){
        return projects.length;
    }

    function getBalance(address addr) returns(uint){
        return addr.balance;
    }
}