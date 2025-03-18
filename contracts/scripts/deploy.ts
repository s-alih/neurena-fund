import {
  Network,
  getNetworkInfo,
  createTransaction,
  broadcastTransaction,
} from "@injectivelabs/networks";
import {
  PrivateKey,
  ChainRestAuthApi,
  MsgStoreCode,
  MsgInstantiateContract,
  TxClient,
  WasmClient,
} from "@injectivelabs/sdk-ts";
import { readFileSync } from "fs";
import path from "path";

const network = Network.TestnetK8s;
const networkInfo = getNetworkInfo(network);
const endpoints = networkInfo.endpoints;

// Replace with your private key
const privateKey = PrivateKey.fromMnemonic(process.env.MNEMONIC!);
const injectiveAddress = privateKey.toBech32();

async function deployContract(wasmFilePath: string) {
  const chainRestAuthApi = new ChainRestAuthApi(endpoints.rest);
  const txClient = new TxClient(networkInfo, privateKey);
  const wasmClient = new WasmClient(endpoints.rest);

  // Read contract bytecode
  const wasmCode = readFileSync(path.resolve(__dirname, wasmFilePath));

  // Store code
  const storeCodeMsg = MsgStoreCode.fromJSON({
    sender: injectiveAddress,
    wasmBytes: wasmCode,
  });

  const { txHash: storeCodeTxHash } = await txClient.broadcast([storeCodeMsg]);
  console.log(`Contract stored with tx hash: ${storeCodeTxHash}`);

  // Wait for code to be stored
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Get code ID
  const txResponse = await chainRestAuthApi.fetchTx(storeCodeTxHash);
  const codeId = txResponse.data.logs[0].events
    .find((event: any) => event.type === "store_code")
    ?.attributes.find((attr: any) => attr.key === "code_id")?.value;

  console.log(`Contract code ID: ${codeId}`);

  // Instantiate contract
  const instantiateMsg = MsgInstantiateContract.fromJSON({
    sender: injectiveAddress,
    codeId: Number(codeId),
    label: `Neurena Contract ${Date.now()}`,
    msg: {},
  });

  const { txHash: instantiateTxHash } = await txClient.broadcast([
    instantiateMsg,
  ]);
  console.log(`Contract instantiated with tx hash: ${instantiateTxHash}`);

  // Get contract address
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const instantiateTxResponse = await chainRestAuthApi.fetchTx(
    instantiateTxHash
  );
  const contractAddress = instantiateTxResponse.data.logs[0].events
    .find((event: any) => event.type === "instantiate")
    ?.attributes.find((attr: any) => attr.key === "_contract_address")?.value;

  console.log(`Contract address: ${contractAddress}`);
  return { codeId, contractAddress };
}

async function main() {
  try {
    console.log("Deploying Vault contract...");
    const vaultContract = await deployContract(
      "../target/wasm32-unknown-unknown/release/vault.wasm"
    );

    console.log("Deploying Tournament contract...");
    const tournamentContract = await deployContract(
      "../target/wasm32-unknown-unknown/release/tournament.wasm"
    );

    console.log("\nDeployment Summary:");
    console.log("Vault Contract:");
    console.log(`- Code ID: ${vaultContract.codeId}`);
    console.log(`- Address: ${vaultContract.contractAddress}`);
    console.log("\nTournament Contract:");
    console.log(`- Code ID: ${tournamentContract.codeId}`);
    console.log(`- Address: ${tournamentContract.contractAddress}`);
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main();
