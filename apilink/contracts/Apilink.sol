// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Apilink {
    
    string private apispec;
    address private user;
    bool private toInvoke;

    constructor() {
        apispec = "";
        toInvoke = false;
    }

    event invoked(
        bool invoke
    );

    function setApiSpec(
        string calldata _apispec
    
    ) external {
        require(bytes(_apispec).length != 0, "Spec cannot be empty");    

        apispec = _apispec;
        user = msg.sender;        
        toInvoke = true;
        
        emit invoked(toInvoke);
    }

    function getApiSpec() external view returns (string memory){
        return apispec;
    }
}