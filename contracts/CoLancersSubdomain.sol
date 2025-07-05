// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title CoLancersSubdomain
 * @dev Manages ENS subdomains for the Co-Lancers platform
 * Allows freelancers to register and manage their subdomains under co-lancers.eth
 */
// ENS Registry interface
interface ENSRegistry {
    function setSubnodeRecord(
        bytes32 parentNode,
        string calldata label,
        address owner,
        address resolver,
        uint64 ttl
    ) external;
    
    function setSubnodeOwner(
        bytes32 parentNode,
        string calldata label,
        address owner
    ) external returns (bytes32);
    
    function owner(bytes32 node) external view returns (address);
}

// ENS Resolver interface
interface ENSResolver {
    function setAddr(bytes32 node, address addr) external;
    function setText(bytes32 node, string calldata key, string calldata value) external;
    function addr(bytes32 node) external view returns (address);
    function text(bytes32 node, string calldata key) external view returns (string memory);
}

contract CoLancersSubdomain is Ownable, ReentrancyGuard {
    using Strings for string;

    ENSRegistry public ensRegistry;
    ENSResolver public ensResolver;
    bytes32 public parentNode; // co-lancers.eth node
    
    // Mapping from subdomain to owner
    mapping(string => address) public subdomainOwners;
    // Mapping from address to subdomain
    mapping(address => string) public userSubdomains;
    // Mapping from subdomain to registration data
    mapping(string => SubdomainData) public subdomainData;
    
    // Events
    event SubdomainRegistered(string subdomain, address owner, uint256 timestamp);
    event SubdomainTransferred(string subdomain, address from, address to, uint256 timestamp);
    event SubdomainUpdated(string subdomain, address owner, uint256 timestamp);
    
    struct SubdomainData {
        address owner;
        uint256 registrationTime;
        bool isActive;
        string metadata; // JSON string with additional data
    }
    
    constructor(
        address _ensRegistry,
        address _ensResolver,
        bytes32 _parentNode
    ) Ownable(msg.sender) {
        ensRegistry = ENSRegistry(_ensRegistry);
        ensResolver = ENSResolver(_ensResolver);
        parentNode = _parentNode;
    }
    
    /**
     * @dev Register a new subdomain for a freelancer
     * @param subdomain The subdomain to register (e.g., "john" for john.co-lancers.eth)
     * @param owner The address that will own the subdomain
     */
    function registerSubdomain(
        string calldata subdomain,
        address owner
    ) external onlyOwner nonReentrant {
        require(bytes(subdomain).length >= 3, "Subdomain too short");
        require(bytes(subdomain).length <= 63, "Subdomain too long");
        require(subdomainOwners[subdomain] == address(0), "Subdomain already taken");
        require(bytes(userSubdomains[owner]).length == 0, "User already has a subdomain");
        
        // Validate subdomain format (only lowercase letters, numbers, hyphens)
        require(isValidSubdomain(subdomain), "Invalid subdomain format");
        
        // Create the subdomain on ENS
        bytes32 labelHash = keccak256(abi.encodePacked(subdomain));
        bytes32 node = keccak256(abi.encodePacked(parentNode, labelHash));
        
        // Set the subdomain owner
        ensRegistry.setSubnodeOwner(parentNode, subdomain, address(this));
        
        // Set the resolver
        ensRegistry.setSubnodeRecord(
            parentNode,
            subdomain,
            address(this),
            address(ensResolver),
            0
        );
        
        // Set the address record
        ensResolver.setAddr(node, owner);
        
        // Store the data
        subdomainOwners[subdomain] = owner;
        userSubdomains[owner] = subdomain;
        subdomainData[subdomain] = SubdomainData({
            owner: owner,
            registrationTime: block.timestamp,
            isActive: true,
            metadata: ""
        });
        
        emit SubdomainRegistered(subdomain, owner, block.timestamp);
    }
    
    /**
     * @dev Transfer a subdomain to a new owner
     * @param subdomain The subdomain to transfer
     * @param newOwner The new owner address
     */
    function transferSubdomain(
        string calldata subdomain,
        address newOwner
    ) external {
        require(subdomainOwners[subdomain] == msg.sender, "Not the subdomain owner");
        require(newOwner != address(0), "Invalid new owner");
        require(bytes(userSubdomains[newOwner]).length == 0, "New owner already has a subdomain");
        
        address oldOwner = subdomainOwners[subdomain];
        
        // Update ENS records
        bytes32 labelHash = keccak256(abi.encodePacked(subdomain));
        bytes32 node = keccak256(abi.encodePacked(parentNode, labelHash));
        ensResolver.setAddr(node, newOwner);
        
        // Update mappings
        subdomainOwners[subdomain] = newOwner;
        userSubdomains[oldOwner] = "";
        userSubdomains[newOwner] = subdomain;
        subdomainData[subdomain].owner = newOwner;
        
        emit SubdomainTransferred(subdomain, oldOwner, newOwner, block.timestamp);
    }
    
    /**
     * @dev Update subdomain metadata
     * @param subdomain The subdomain to update
     * @param metadata JSON string with metadata
     */
    function updateSubdomainMetadata(
        string calldata subdomain,
        string calldata metadata
    ) external {
        require(subdomainOwners[subdomain] == msg.sender, "Not the subdomain owner");
        
        subdomainData[subdomain].metadata = metadata;
        
        // Update ENS text records
        bytes32 labelHash = keccak256(abi.encodePacked(subdomain));
        bytes32 node = keccak256(abi.encodePacked(parentNode, labelHash));
        
        // Set various text records
        ensResolver.setText(node, "description", metadata);
        
        emit SubdomainUpdated(subdomain, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Deactivate a subdomain (only owner can do this)
     * @param subdomain The subdomain to deactivate
     */
    function deactivateSubdomain(string calldata subdomain) external onlyOwner {
        require(subdomainOwners[subdomain] != address(0), "Subdomain not found");
        
        address owner = subdomainOwners[subdomain];
        
        // Clear mappings
        subdomainOwners[subdomain] = address(0);
        userSubdomains[owner] = "";
        subdomainData[subdomain].isActive = false;
        
        emit SubdomainUpdated(subdomain, owner, block.timestamp);
    }
    
    /**
     * @dev Check if a subdomain is available
     * @param subdomain The subdomain to check
     * @return True if available, false otherwise
     */
    function isSubdomainAvailable(string calldata subdomain) external view returns (bool) {
        return subdomainOwners[subdomain] == address(0);
    }
    
    /**
     * @dev Get subdomain data
     * @param subdomain The subdomain to query
     * @return The subdomain data
     */
    function getSubdomainData(string calldata subdomain) external view returns (SubdomainData memory) {
        return subdomainData[subdomain];
    }
    
    /**
     * @dev Get user's subdomain
     * @param user The user address
     * @return The user's subdomain
     */
    function getUserSubdomain(address user) external view returns (string memory) {
        return userSubdomains[user];
    }
    
    /**
     * @dev Validate subdomain format
     * @param subdomain The subdomain to validate
     * @return True if valid, false otherwise
     */
    function isValidSubdomain(string calldata subdomain) public pure returns (bool) {
        bytes memory b = bytes(subdomain);
        
        if (b.length < 3 || b.length > 63) {
            return false;
        }
        
        for (uint i = 0; i < b.length; i++) {
            bytes1 char = b[i];
            
            // Check if character is lowercase letter, number, or hyphen
            if (!((char >= 0x61 && char <= 0x7A) || // a-z
                  (char >= 0x30 && char <= 0x39) || // 0-9
                  char == 0x2D)) { // hyphen
                return false;
            }
            
            // Check for consecutive hyphens
            if (i > 0 && char == 0x2D && b[i-1] == 0x2D) {
                return false;
            }
        }
        
        // Check for leading/trailing hyphens
        if (b[0] == 0x2D || b[b.length - 1] == 0x2D) {
            return false;
        }
        
        return true;
    }
    
    /**
     * @dev Update ENS registry address (only owner)
     */
    function updateENSRegistry(address _ensRegistry) external onlyOwner {
        ensRegistry = ENSRegistry(_ensRegistry);
    }
    
    /**
     * @dev Update ENS resolver address (only owner)
     */
    function updateENSResolver(address _ensResolver) external onlyOwner {
        ensResolver = ENSResolver(_ensResolver);
    }
} 