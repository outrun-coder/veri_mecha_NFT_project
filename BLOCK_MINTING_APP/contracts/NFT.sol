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
  // string _groupId;
  uint256 _groupMintingDate;
  uint256 _groupTotalMintsLeft;
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
  uint256 public xGroupMintOpenDate;
  uint256 public xGroupTotalMintsLeft;

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
    // xGroupId = args._groupId; // RESEARCH - IF COMPOUND ID IS POSSIBLE OR IF HAS BENEFITS
    xGroupMintOpenDate = args._groupMintingDate;
    xGroupTotalMintsLeft = args._groupTotalMintsLeft;
  }


  event MintCompleted(uint256 quantity, address minter);

  // BASE FEATURES
  // OK [x] - MINTING
  function andMintFor(uint256 _mintQuantity) public payable {
    // - Require that publicMintOpenOn date has passed
    require(block.timestamp >= xGroupMintOpenDate, "Minting cannot happen before the GROUP_MINT_OPEN_DATE");
    
    // - 1 mint minimum requirement
    require(_mintQuantity > 0);

    // TODO [] - ADD A MAX MINT REQUIREMENT BY MSG.SENDER MAPPING CHECK FOR GROUP or MINT SESSION
    
    // - Require enough payment for mint
    require(msg.value >= xBaseCost * _mintQuantity, 'Not enough payment to fulfill the requested mint quantity!');

    // Cap mint to GROUP_TOTAL_MINTS_LEFT
    int256 leftToMint = int256(xGroupTotalMintsLeft);
    int256 requesting = int256(_mintQuantity);
    int256 remaining = leftToMint - requesting;
    
    // Fix - figure out string interpolation
    // string memory tooManyFailMessage = string(abi.encodePacked("Requested mint quantity would leave: ", remaining, "remaing. The total left is: ", totalLeft));
    // require(remaining >= 0, tooManyFailMessage);

    require(remaining >= 0, 'Requested mint quantity is more than the remaining group supply. sorry!');

    // mint x qty
    for (uint256 i = 1; i <= _mintQuantity; i++) {
      uint256 tokenCount = totalSupply();
      uint256 newTokenId = tokenCount + 1;

      // RESEARCH [] - verify if group id amendment will work
      // ! till then tokenCount model will work
      // string memory compundTokenId = string(abi.encodePacked(xGroupId, '_', newTokenId));

      _safeMint(msg.sender,  newTokenId); 
    }

    // subtract from TOTAL_MINTS_LEFT
    xGroupTotalMintsLeft = xGroupTotalMintsLeft - _mintQuantity;

    // log
    emit MintCompleted(_mintQuantity, msg.sender);
  }

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
