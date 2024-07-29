// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleNFT {
    string public name = "SimpleNFT";
    string public symbol = "SNFT";
    
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => string) private _tokenURIs;
    
    uint256 private _totalSupply;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event URI(string value, uint256 indexed tokenId);

    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _totalSupply;
        _totalSupply += 1;
        _balances[to] += 1;
        _owners[tokenId] = to;
        _tokenURIs[tokenId] = uri;
        
        emit Transfer(address(0), to, tokenId);
        emit URI(uri, tokenId);
        
        return tokenId;
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return _owners[tokenId];
    }

    function balanceOf(address owner) public view returns (uint256) {
        return _balances[owner];
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
