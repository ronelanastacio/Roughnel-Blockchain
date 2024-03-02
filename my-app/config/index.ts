import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0x2850B5283a6505b02d0446115Ff4f66A3663F7ac",
        abi as any,
        signer
    );
}