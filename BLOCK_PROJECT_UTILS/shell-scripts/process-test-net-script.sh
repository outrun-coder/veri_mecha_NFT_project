echo ">> Running $0 with ./scripts/$1 \n"
echo ">> ON GOERLI TEST NETWORK \n\n"
npx hardhat run ./scripts/$1 --network goerli
