pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    mapping(address => uint) balances;
    
    modifier onlyManager() {
        require(manager == msg.sender);
        _;
    }
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
        balances[msg.sender] = msg.value;
    }
    
    function pickWinner() public onlyManager {
        require(address(this).balance > 0);
        require(players.length > 0);
        
        uint index = random()%players.length;
        players[index].transfer(address(this).balance);
        delete players;
    }
    
    function withdraw() private onlyManager returns(bool) {
        manager.transfer(address(this).balance);
        return true;
    }
    
    function cancelAndReturn() public onlyManager {
        require(address(this).balance > 0);
        require(players.length > 0);
        
        for (uint i = 0; i < players.length; i++)
        {
            players[i].transfer(balances[players[i]]);
            delete balances[players[i]];
        }
            
        delete players;
    }
    
    function balanceOf(address addr) public view returns (uint) {
        return balances[addr];
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}