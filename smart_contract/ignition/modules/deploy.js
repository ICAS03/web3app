const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('TransactionsDeployment',  (m) => {
  // Deploy the Transactions contract using Ignition's contract deployment method
  const transactionsContract =  m.contract('Transactions');

  // Log the deployed contract's address
  console.log("Transactions contract deployed at:", transactionsContract.address);

  // Return the contract for further use if necessary
  return { transactionsContract };
});