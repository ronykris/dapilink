// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Apilink {
    
    address private user;
    bool private toInvoke;
    uint256 private callid;
    string private cid;
    
    bool private isPasscodeSet;
    bool private loggedIn;
    
    uint256 private index;
    uint256 private nodeCount;
    
    struct Apicalldetails {        
        string endpoint;
        string method;
        string body;  
        string headers;
    }

    struct NodeDetails {        
        string nodeName;
        string password;
    }

    mapping(uint256 => Apicalldetails) private apicalls;   
    mapping(address => NodeDetails) private nodes;
    mapping(address => uint256) private nodeIndexes;
    address[] private nodeList;    
    mapping(uint256 => uint256) private nodeMapper;
    mapping(uint256 => string) private results;

    constructor() {                
        toInvoke = false; 
        callid = 0;  
        loggedIn = false;
        index = 0;            
        nodeCount = 0;           
    }    

    event invoked(bool invoke, uint256 id);
    event logInSuccess(bool passwordset);
    event logInStatus(bool loginStatus);
    event resultsRcvd(bool);
    //event log(Apicalldetails api);
    //event logNode(string text, NodeDetails node);

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
        nodeMapper[callid] = setChosenNode();
        
        emit invoked(toInvoke, _callid);

        toInvoke = false; //Reset        
        apicalls[_callid] = Apicalldetails(_endpoint, _method, _body, _headers);
    }

    function getApiSpec(uint256 _id) external view returns (Apicalldetails memory){        
        return apicalls[_id];
    }

    function login(string calldata _passcode, string calldata _nodeName) external {
        require(bytes(_passcode).length > 0, "Passcode cannot be empty");
        require(bytes(_nodeName).length > 0, "Nodename cannot be empty");

        nodes[msg.sender].nodeName = _nodeName;
        nodes[msg.sender].password = string(abi.encodePacked(msg.sender, _passcode));   
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

    function isLoggedIn(string calldata _code) external {
        require(
            keccak256(bytes(nodes[msg.sender].password)) == keccak256(bytes(string(abi.encodePacked(msg.sender, _code)))),
            "No pancakes for you"
        );
        loggedIn = true;
        //emit logNode('success', nodes[msg.sender]);
        emit logInStatus(loggedIn);                
    }

    function setChosenNode() internal returns (uint256) {
        require(nodeList.length > 0, "No items available");
        index = ((index + 1) % nodeList.length) + 1;  
        return index;      
    }

    function getChosenNode(uint256 _callid) external view returns (uint256) {
        return nodeMapper[_callid];
    }

    function setResult(uint256 _callid, string calldata _cid) external {
        require(_callid > 0, "Call id cannot be null");
        require(bytes(_cid).length > 0, "CID cannot be null");

        results[_callid] = _cid;
        emit resultsRcvd(true);
    }

    function getResults(uint256 _callid) external view returns (string memory) {
        require(_callid > 0, "Call id cannot be null");
        return results[_callid];
    }
}