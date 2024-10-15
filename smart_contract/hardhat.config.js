require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
    url: 'https://eth-sepolia.g.alchemy.com/v2/OnckoAwtRDPCoK2xP6sCkOG5ECp95RWG',
    accounts: ['4389afab3dd95be6d04d5b1f592217468fb1e90a14af4ad5b37c869d7679da7f']
  }
}
};
