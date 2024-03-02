import { ethers } from "hardhat";

async function main() {
  const lock = await ethers.deployContract("Roughnel", ["0x4FB53cd833388c30251F564A9A1359936862BaAA"]);

  await lock.waitForDeployment();

  console.log(
    `Token deployed to ${lock.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});