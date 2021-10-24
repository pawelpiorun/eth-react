// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    Campaign[] public campaigns;
    
    function newCampaign(uint premiumContribution) public {
        Campaign campaign = new Campaign(premiumContribution, msg.sender);
        campaigns.push(campaign);
    }
    
    function getCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }
}

contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address recipient;
        mapping(address => bool) votes;
        uint yesVotes;
        bool isFinalized;
    }

    uint public premiumContribution;
    address public manager;
    mapping(uint => Request) public requests;
    mapping(address => bool) public approvers;
    uint public approversCount;
    uint public requestsCount;
    
    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }
    
    modifier onlyApprover() {
        require(approvers[msg.sender]);
        _;
    }
    
    constructor(uint premium, address creator) {
        premiumContribution = premium;
        manager = creator;
    }
    
    function contribute() public payable {
        require(msg.sender != address(0));
        require(msg.value > 0);
        if (msg.value > premiumContribution)
        {
            if (!approvers[msg.sender])
                approversCount++;
            approvers[msg.sender] = true;
        }
    }
    
    function createRequest(string memory description, uint value,
        address recipient) public onlyManager {
        Request storage newRequest = requests[requestsCount++];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.isFinalized = false;
        newRequest.yesVotes = 0;
    }
    
    function approveRequest(uint requestIndex) public onlyApprover {
        require(requestIndex < requestsCount);
        
        Request storage request = requests[requestIndex];
        require(!request.votes[msg.sender]);
        
        request.votes[msg.sender] = true;
        request.yesVotes++;
    }
    
    function finalizeRequest(uint requestIndex) public onlyManager {
        require(requestIndex < requestsCount);
        
        Request storage request = requests[requestIndex];
        require(!request.isFinalized);
        
        uint balance = address(this).balance;
        require(balance > request.value);
        
        require(request.yesVotes >= approversCount / 2);
        
        (bool success, ) = request.recipient.call{value: request.value}("");
        require(success);

        requests[requestIndex].isFinalized = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            premiumContribution,
            address(this).balance,
            requestsCount,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requestsCount;
    }
}