pragma solidity ^0.8.9;

contract Storage {
    string public message;

    constructor(string _message) public {
        message = _message;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }

    function getMessage() public view returns (string) {
        return message;
    }
}