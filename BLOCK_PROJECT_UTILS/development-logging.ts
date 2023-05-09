export const checkNFTaccountDetailsFrom = (result: any) => {
  const {
    userAddress,
    tokenCollection
  } = result;

  console.log('>> USER ACCOUNT: ', userAddress);
  const tokenCount = tokenCollection.length;
  const plural = (tokenCount === 0 || tokenCount > 1);
  console.log(`>> HAS A COLLECTION OF: ${tokenCount} TOKEN${(plural)? 's':''}.`);
  tokenCollection.forEach((t: any) => {
    console.log('>> VERIFIED HAS TOKEN:', t.toString());
  });
}