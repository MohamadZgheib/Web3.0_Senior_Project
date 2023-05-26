// https://eth-sepolia.g.alchemy.com/v2/5XQ2aYIKRozfYVK0zMos12qT0CKlfNEA

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity:'0.8.0', 
  networks: {
    sepolia:{
      url: 'https://eth-sepolia.g.alchemy.com/v2/5XQ2aYIKRozfYVK0zMos12qT0CKlfNEA',
      accounts: ['83fc531fcb4ff91d0e9a7dfdbe308710e649720c59333a3fe265b2a52d420ac0']
    }
  }
}