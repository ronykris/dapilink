// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Apilink {
    
    address private user;
    bool private toInvoke;
    uint256 private callid;
    //apicalldetails[] private apicalls;

    struct apicalldetails {        
        string endpoint;
        string method;
        string body;  
        string headers;
    }

    apicalldetails api = apicalldetails("", "GET", "", "");
    mapping (address => mapping(uint256 => apicalldetails)) private apicalls;

    constructor() {                
        toInvoke = false; 
        callid = 0;                        
    }    

    event invoked(
        bool invoke,
        uint256 id
    );

    function createApiCall(uint256 _callid, string calldata _endpoint, string calldata _method, string calldata _body, string calldata _headers) external payable {
        require(_callid > 0, "Call id cannot be null");
        require(bytes(_endpoint).length > 0, "Endpoint cannot be empty");
        require(
            keccak256(bytes(_method)) == keccak256(bytes("GET")) ||
            keccak256(bytes(_method)) == keccak256(bytes("POST")),
            "Only GET and POST are supported");
        require(msg.value >= 395720000000000, "Not enough dough was supplied");
        
        user = msg.sender;        
        toInvoke = true;
        callid = _callid;

        emit invoked(toInvoke, _callid);

        toInvoke = false; //Reset        
        apicalls[msg.sender][_callid] = apicalldetails(_endpoint, _method, _body, _headers);

    }

    function getApiSpec(address _user, uint256 _id) external view returns (apicalldetails memory){
        return apicalls[_user][_id];
    }
}