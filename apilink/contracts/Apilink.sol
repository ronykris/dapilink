// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Apilink {
    
    address private user;
    bool private toInvoke;
    uint256 private callid;
    
    bool private isPasscodeSet;
    bool private loggedIn;
    
    uint256 private index;
    uint256 private nodeCount;
    
    struct apicalldetails {        
        string endpoint;
        string method;
        string body;  
        string headers;
    }

    struct nodeDetails {        
        string nodeName;
        string password;
    }
    //apicalldetails[] private jobs;
    apicalldetails api = apicalldetails("", "GET", "", "");
    mapping (address => mapping(uint256 => apicalldetails)) private apicalls;    

    mapping(address => nodeDetails) private nodes;
    mapping(address => uint256) private nodeIndexes;
    address[] private nodeList;    

    constructor() {                
        toInvoke = false; 
        callid = 0;  
        loggedIn = false;
        index = 0;            
        nodeCount = 0;           
    }    

    event invoked(
        bool invoke,
        uint256 id
    );

    event logInSuccess(bool passwordset);

    //event logInStatus(bool loginStatus);

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
        setChosenNode();
        emit invoked(toInvoke, _callid);

        toInvoke = false; //Reset        
        apicalls[msg.sender][_callid] = apicalldetails(_endpoint, _method, _body, _headers);
        
    }

    function getApiSpec(address _user, uint256 _id) external view returns (apicalldetails memory){
        return apicalls[_user][_id];
    }

    function login(string calldata _passcode, string calldata _nodeName) external {
        require(bytes(_passcode).length > 0, "Passcode cannot be empty");
        require(bytes(_nodeName).length > 0, "Nodename cannot be empty");

        nodes[msg.sender] = nodeDetails(_nodeName, string(abi.encodePacked(msg.sender, _passcode)));   
        nodeList.push(msg.sender);                        
        isPasscodeSet = true;

        emit logInSuccess(isPasscodeSet);                      
        
        nodeCount += 1;  
        nodeIndexes[msg.sender] = nodeCount;              
        isPasscodeSet = false;        
    }

    function getNodeId(address _node) external view returns (uint256) {        
        return nodeIndexes[_node];
    }

    function isLoggedIn(string calldata _code) external returns (bool){
        require(
            keccak256(bytes(nodes[msg.sender].password)) == keccak256(bytes(string(abi.encodePacked(msg.sender, _code)))),
            "No pancakes for you"
        );
        loggedIn = true;
        //emit logInStatus(loggedIn);
        return loggedIn;
    }

    function setChosenNode() internal {
        require(nodeList.length > 0, "No items available");
        index = ((index + 1) % nodeList.length) + 1;        
    }

    function getChosenNode() external view returns (uint256) {
        return index;
    }
}