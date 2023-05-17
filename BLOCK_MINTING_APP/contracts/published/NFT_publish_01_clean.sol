// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct ContractConfig {
  string _name;
  string _symbol;
  uint256 _baseCost;
  string _baseTokenURI;
  uint256 _groupMintingDate;
  uint256 _groupTotalMintsLeft;
}

contract NFT_POC is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string public xName;
  string public xSymbol;
  uint256 public xBaseCost;
  string public xBaseURI;

  uint256 public xGroupMintOpenDate;
  uint256 public xGroupTotalMintsLeft;

  constructor(ContractConfig memory args) 
  ERC721(
    args._name,
    args._symbol
  ) {
    xName = args._name;
    xSymbol = args._symbol;
    xBaseCost = args._baseCost;
    xBaseURI = args._baseTokenURI;
    xGroupMintOpenDate = args._groupMintingDate;
    xGroupTotalMintsLeft = args._groupTotalMintsLeft;
  }

  event MintCompleted(uint256 quantity, address minter);

  function andMintFor(uint256 _mintQuantity) public payable {
    require(block.timestamp >= xGroupMintOpenDate, "Minting cannot happen before the GROUP_MINT_OPEN_DATE");
    require(_mintQuantity > 0);
    require(msg.value >= xBaseCost * _mintQuantity, 'Not enough payment to fulfill the requested mint quantity!');

    int256 leftToMint = int256(xGroupTotalMintsLeft);
    int256 requesting = int256(_mintQuantity);
    int256 remaining = leftToMint - requesting;

    require(remaining >= 0, 'Requested mint quantity is more than the remaining group supply. sorry!');

    for (uint256 i = 1; i <= _mintQuantity; i++) {
      uint256 tokenCount = totalSupply();
      uint256 newTokenId = tokenCount + 1;
      _safeMint(msg.sender,  newTokenId); 
    }

    xGroupTotalMintsLeft = xGroupTotalMintsLeft - _mintQuantity;

    emit MintCompleted(_mintQuantity, msg.sender);
  }

  function getTokenMetaURI(uint256 _tokenId)
    public
    view
    virtual
    returns(string memory)
  {
    require(_exists(_tokenId), 'Token ID is not supported or minted.');

    return (string (abi.encodePacked(xBaseURI, '/', _tokenId.toString(), '.json')));
  }

  function getTokenCollectionWith(address _owner) public view returns(uint256[] memory) {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);

    for(uint256 i; i < ownerTokenCount; i++) {
        tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }

    return tokenIds;
  }
}
