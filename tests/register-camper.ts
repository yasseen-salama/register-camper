import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { RegisterCamper } from "../target/types/register_camper";

describe("register-camper", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.RegisterCamper as Program<RegisterCamper>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
