// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address[] public players;
    mapping(address => uint) balances;
    
    modifier onlyManager() {
        require(manager == msg.sender);
        _;
    }
    
    constructor() {
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
        (bool success, ) = players[index].call{value: address(this).balance}("");
        require(success);
        delete players;
    }
    
    function withdraw() private onlyManager {
        (bool success, ) = manager.call{value: address(this).balance}("");
        require(success, "Failed to withdraw");
    }
    
    function cancelAndReturn() public onlyManager {
        require(address(this).balance > 0);
        require(players.length > 0);
        
        for (uint i = 0; i < players.length; i++)
        {
            (bool success, ) = players[i].call{value: balances[players[i]]}("");
            require(success);
            delete balances[players[i]];
        }
            
        delete players;
    }
    
    function balanceOf(address addr) public view returns (uint) {
        return balances[addr];
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
    
    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}