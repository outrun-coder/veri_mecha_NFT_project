// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// TODO [!] - review and import Open Zepplin libs
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
}

contract NFT_POC is Ownable {
  // DEPLOYMENT & INIT
  // OK [x] - contract scope state
  string public xName;
  string public xSymbol;
  uint256 public xBaseCost;
  string public xBaseURI;

  // OK [x] - initialize
  // OK [x] - smoke test
  constructor(DeploymentArgs memory args) {
    xName = args._name;
    xSymbol = args._symbol;
    xBaseCost = args._baseCost;
    //
    xBaseURI = args._baseTokenURI;
  }

  // BASE FEATURES
  // TODO [] - MINTING
  // TODO [] - getTokenGroupsOwnedBy(address _user)
  // TODO [] - getTokenURI
  // TODO [] - getTokenMeta
  // TODO [] - getTokenImage

  // MANAGEMENT - PUBLIC
  // TODO [] - getTimeUntilMinting
  // TODO [] - isGroupRevealed

  // MANAGEMENT - BY_OWNER
  // GROUP MINT
  // TODO [] - setGroupMintDate
  // TODO [] - setGroupMintStatus [PENDING, OPEN, PAUSED, CLOSED]
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
