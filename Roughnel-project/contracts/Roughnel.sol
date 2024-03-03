// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Roughnel is ERC20, Ownable {
    using SafeMath for uint256;

    mapping(address => uint256) private _stakes;
    mapping(address => uint256) private _lastStakeTimestamp;
    uint256 private _rewardRate = 1;
    uint256 private lockInPeriod = 60; // 1 min

    constructor(address initialOwner)
        ERC20("Roughnel", "RAJ")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) external onlyOwner {
        uint256 adjustedAmount = amount.mul(1e18);
        _mint(to, adjustedAmount);
    }

    function stake(uint256 amount) external {
        uint256 adjustedAmount = amount.mul(1e18);

        require(adjustedAmount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= adjustedAmount, "Insufficient balance");

        _stakes[msg.sender] = _stakes[msg.sender].add(adjustedAmount);
        _lastStakeTimestamp[msg.sender] = block.timestamp;
        _transfer(msg.sender, address(this), adjustedAmount);
    }

    function getStake(address account) external view returns (uint256) {
        uint256 stakedInWei = _stakes[account];
        return stakedInWei.div(1e18);
    }

    function withdraw() external {
        require(
            block.timestamp > (_lastStakeTimestamp[msg.sender] + lockInPeriod),
            "Cannot withdraw, still in the lock-in period"
        );
        require(_stakes[msg.sender] > 0, "No staked tokens");

        uint256 stakedAmount = _stakes[msg.sender];
        uint256 reward = (block.timestamp.sub(_lastStakeTimestamp[msg.sender])).mul(_rewardRate).mul(1e18);

        _stakes[msg.sender] = 0;
        _transfer(address(this), msg.sender, stakedAmount);
        _mint(msg.sender, reward);
    }

    function getWithdraw(address account) external view returns (uint256) {
        uint256 stakedAmount = _stakes[account].div(1e18);
        uint256 reward = (block.timestamp.sub(_lastStakeTimestamp[account])).mul(_rewardRate);

        return stakedAmount.add(reward);
    }

    function getElapsedStakeTime(address account) external view returns (uint256) {
        return block.timestamp.sub(_lastStakeTimestamp[account]);
    }

    function getLastStakeTimestamp(address account) external view returns (uint256) {
        return _lastStakeTimestamp[account];
    }
}
