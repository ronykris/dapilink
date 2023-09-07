// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Apilink {
    
    string private apispec;
    address private user;

    constructor() {
        apispec = "";
    }

    event invoked(
        string invokedApiSpec,
        address invokingUser
    );

    function setApiSpec(
        string calldata _apispec
    
    ) external {
        require(bytes(_apispec).length != 0, "Spec cannot be empty");    

        apispec = _apispec;
        user = msg.sender;

        emit invoked(apispec, user);
    }
}