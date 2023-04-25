// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// TODO [] - start deployment args

contract NFT_POC {
// DEPLOYMENT & INIT
// OK [x] - contract scope state
string public xName;
string public xSymbol;

// OK [x] - initialize
// OK [x] - smoke test
constructor(
  string memory _name,
  string memory _symbol
) {
  xName = _name;
  xSymbol = _symbol;
}

// TODO [] - review and import Open Zepplin libs

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
// TODO [] - setGroupMintingCostTo
// TODO [] - setGroupMaxMintAmount
// GROUP META
// TODO [] - setGroupAsRevealed
// TODO [] - setGroupStagedURI
// TODO [] - setGroupTokenPendingURI
// TODO [] - setGroupBaseURI
// GENERAL
// TODO [] - setBaseExtension
// TODO [] - witdrawFundsRaised
// TODO [] - ___

// EXTRA
// TODO [] - ADDITIVE / AMENDMENT COLLECTIONS
// TODO [] - CONSIDER PROXY UPGRADEABLE MODEL

}
