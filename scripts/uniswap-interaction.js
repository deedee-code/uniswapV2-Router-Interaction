const { ethers } = require("hardhat");

// UniswapV2 Router address on Ethereum mainnet
const UNISWAP_V2_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const UNISWAP_V2_ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
];

async function main() {
  const [signer] = await ethers.getSigners();

  const uniswapRouter = new ethers.Contract(UNISWAP_V2_ROUTER_ADDRESS, UNISWAP_V2_ROUTER_ABI, signer);

  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

  const amountIn = ethers.utils.parseEther('100'); // 100 DAI
  const path = [DAI, WETH];

  console.log('Fetching amounts out...');
  const amounts = await uniswapRouter.getAmountsOut(amountIn, path);
  console.log(`For 100 DAI, you can get approximately ${ethers.utils.formatEther(amounts[1])} WETH`);

  const amountOutMin = amounts[1].mul(95).div(100); // 5% slippage tolerance
  const to = await signer.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  console.log('Simulating token swap...');
  const tx = await uniswapRouter.populateTransaction.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline
  );
  console.log('Swap transaction data:', tx.data);

  console.log('Script execution completed.');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });