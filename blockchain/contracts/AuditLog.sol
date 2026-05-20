// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AuditLog {

    string[] public logs;

    function addLog(string memory hash) public {
        logs.push(hash);
    }

    function getLogs() public view returns (string[] memory) {
        return logs;
    }
}