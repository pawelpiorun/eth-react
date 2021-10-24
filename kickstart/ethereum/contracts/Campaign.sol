pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public campaigns;
    
    function newCampaign(uint premiumContribution) public {
        address newCampaign = new Campaign(premiumContribution, msg.sender);
        campaigns.push(newCampaign);
    }
    
    function getCampaigns() public view returns (address[]) {
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
    Request[] public requests;
    mapping(address => bool) public approvers;
    uint public approversCount;
    
    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }
    
    modifier onlyApprover() {
        require(approvers[msg.sender]);
        _;
    }
    
    function Campaign(uint premium, address creator) public {
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
    
    function createRequest(string description, uint value,
        address recipient) public onlyManager {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           isFinalized: false,
           yesVotes: 0
        });
        requests.push(newRequest);
    }
    
    function approveRequest(uint requestIndex) public onlyApprover {
        require(requestIndex < requests.length);
        
        Request storage request = requests[requestIndex];
        require(!request.votes[msg.sender]);
        
        request.votes[msg.sender] = true;
        request.yesVotes++;
    }
    
    function finalizeRequest(uint requestIndex) public onlyManager {
        require(requestIndex < requests.length);
        
        Request storage request = requests[requestIndex];
        require(!request.isFinalized);
        
        uint balance = address(this).balance;
        require(balance > request.value);
        
        require(request.yesVotes > approversCount / 2);
        
        request.recipient.transfer(request.value);
        requests[requestIndex].isFinalized = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            premiumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}