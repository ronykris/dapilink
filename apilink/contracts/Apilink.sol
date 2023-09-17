// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Apilink {
    
    address private user;
    bool private toInvoke;
    uint256 private callid;
    string private password;
    bool private isPasscodeSet;
    address private node;
    string private nodeName;
    bool private loggedIn;
    
    struct apicalldetails {        
        string endpoint;
        string method;
        string body;  
        string headers;
    }
    //apicalldetails[] private jobs;
    apicalldetails api = apicalldetails("", "GET", "", "");
    mapping (address => mapping(uint256 => apicalldetails)) private apicalls;    

    mapping(address => string) private pswdMgr;

    constructor() {                
        toInvoke = false; 
        callid = 0;  
        loggedIn = false;                      
    }    

    event invoked(
        bool invoke,
        uint256 id
    );

    event passcodeSet(bool passwordset);

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

    function login(string calldata _passcode) external {
        require(bytes(_passcode).length > 0, "Passcode cannot be empty");

        node = msg.sender;        
        isPasscodeSet = true;

        emit passcodeSet(isPasscodeSet);

        isPasscodeSet = false;
        password =  string(abi.encodePacked(node, _passcode));
        pswdMgr[node] = password;

    }

    function isLoggedIn(string calldata _code) external returns (bool) {
        require(
            keccak256(bytes(password)) == keccak256(bytes(string(abi.encodePacked(msg.sender, _code)))),
            "Doesn't match"
        );
        loggedIn = true;
        return loggedIn;
    }

}