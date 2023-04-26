// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// TODO [!] - review and import Open Zepplin libs
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// OK [x] - start deployment args
struct DeploymentArgs {
  string _name;
  string _symbol;
  uint256 _baseCost;
  // uint256 _maxSupply; // N/A
  // string _baseTokenStagedURI;
  // string _baseTokenPendingURI;
  string _baseTokenURI;
  //
  string _groupId;
  string _groupMintingDate;
}

contract NFT_POC is ERC721Enumerable, Ownable {
  // DEPLOYMENT & INIT
  // OK [x] - General contract state
  string public xName;
  string public xSymbol;
  uint256 public xBaseCost;
  string public xBaseURI;

  // TODO [-] - Minting season state
  string public xGroupId;
  string public xGroupMintingDate;

  // OK [x] - initialize
  // OK [x] - smoke test
  constructor(DeploymentArgs memory args) 
  ERC721(
    args._name,
    args._symbol
  ) {
    xName = args._name;
    xSymbol = args._symbol;
    xBaseCost = args._baseCost;
    //
    xBaseURI = args._baseTokenURI;
    //
    xGroupId = args._groupId;
    xGroupMintingDate = args._groupMintingDate;
  }

  // BASE FEATURES
  // TODO [] - MINTING

  // TODO [] - keep track of enumerable group URIs

  // TODO [] - getTokenGroupsOwnedBy(address _user)
  // TODO [] - getTokenURI
  // TODO [] - getTokenMeta
  // TODO [] - getTokenImage

  // MANAGEMENT - PUBLIC
  // TODO [] - getTimeUntilMinting
  // TODO [] - isGroupRevealed

  // MANAGEMENT - BY_OWNER
  // GROUP MINT
  // TODO [] - setGroupMintingDate
  // TODO [] - setGroupMintingStatus [PENDING, OPEN, PAUSED, CLOSED] (ENUM)
  // TODO [] - setGroupMintingCost
  // TODO [] - setGroupMaxMintAmount
  // GROUP META
  // TODO [] - setGroupAsRevealed
  // TODO [] - setGroupStagedURI
  // TODO [] - setGroupPendingURI
  // TODO [] - setGroupBaseURI
  // GENERAL
  // TODO [] - setBaseExtension
  // TODO [] - witdrawFundsRaised
  // TODO [] - ___

  // EXTRA
  // TODO [] - WHITE LIST PROCESS MANAGEMENT
  // TODO [] - ADDITIVE / AMENDMENT COLLECTIONS
  // TODO [] - CONSIDER PROXY UPGRADEABLE MODEL

}
