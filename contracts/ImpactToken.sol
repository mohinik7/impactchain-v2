// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ImpactToken is ERC721, Ownable, ReentrancyGuard {
    // Token counter for unique token IDs
    uint256 private _tokenIdCounter;
    
    // Mapping to store token metadata
    mapping(uint256 => TokenMetadata) public tokenMetadata;
    
    // Struct to hold token metadata
    struct TokenMetadata {
        uint256 projectId;
        string projectName;
        string description;
        uint256 impactValue;
        string imageUri;
        uint256 timestamp;
        address recipient;
    }
    
    // Events
    event ImpactTokenMinted(
        uint256 indexed tokenId,
        uint256 indexed projectId,
        address indexed recipient,
        uint256 impactValue
    );
    
    constructor() ERC721("ImpactToken", "IMPACT") Ownable(msg.sender) {}
    
    /**
     * @dev Mints a new ImpactToken NFT
     * @param to The address to mint the token to
     * @param projectId The ID of the project this token represents
     * @param projectName The name of the project
     * @param description Description of the impact achieved
     * @param impactValue The quantified impact value
     * @param imageUri URI to the token image/metadata
     */
    function mintImpactToken(
        address to,
        uint256 projectId,
        string memory projectName,
        string memory description,
        uint256 impactValue,
        string memory imageUri
    ) external onlyOwner nonReentrant returns (uint256) {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        // Store metadata
        tokenMetadata[tokenId] = TokenMetadata({
            projectId: projectId,
            projectName: projectName,
            description: description,
            impactValue: impactValue,
            imageUri: imageUri,
            timestamp: block.timestamp,
            recipient: to
        });
        
        // Mint the token
        _safeMint(to, tokenId);
        
        emit ImpactTokenMinted(tokenId, projectId, to, impactValue);
        
        return tokenId;
    }
    
    /**
     * @dev Returns the metadata URI for a given token
     * @param tokenId The token ID to get metadata for
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        TokenMetadata memory metadata = tokenMetadata[tokenId];
        
        // Return the image URI as the token URI for now
        // In a production environment, you'd return a JSON metadata URI
        return metadata.imageUri;
    }
    
    /**
     * @dev Returns the total number of tokens minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Returns metadata for a specific token
     * @param tokenId The token ID to get metadata for
     */
    function getTokenMetadata(uint256 tokenId) external view returns (TokenMetadata memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenMetadata[tokenId];
    }
    
    /**
     * @dev Returns all tokens owned by an address
     * @param owner The address to query
     */
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        
        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    tokens[index] = i;
                    index++;
                }
            } catch {
                // Token doesn't exist, continue
            }
        }
        
        return tokens;
    }
}
