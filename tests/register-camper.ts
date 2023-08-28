import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { RegisterCamper } from "../target/types/register_camper";
import * as assert from "assert";

describe("register-camper", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  
  const program = anchor.workspace.RegisterCamper as Program<RegisterCamper>;

  it('can create a new camper', async () => {
    // Call the "CreateCamper" instruction.
    const camper = anchor.web3.Keypair.generate();
    await program.methods
        .createCamper('hathor')  
        .accounts({
            camper: camper.publicKey,
            owner: anchor.AnchorProvider.env().wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([camper])
        .rpc({
          skipPreflight:true
        })  

      // Fetch the account details of the created camper.
      const camperAccount = await program.account.camper.fetch(camper.publicKey);

      // Ensure it has the right data.
      assert.equal(camperAccount.owner.toBase58(),  anchor.AnchorProvider.env().wallet.publicKey);
      assert.equal(camperAccount.handle, 'hathor');
      assert.ok(camperAccount.timestamp);
  });
  it('can edit the handle of a camper', async () => {
    const camper = anchor.web3.Keypair.generate();
    await program.methods
        .createCamper('suko')  
        .accounts({
            camper: camper.publicKey,
            owner: anchor.AnchorProvider.env().wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([camper])
        .rpc({
          skipPreflight:true
        })    
      const camperAccount = await program.account.camper.fetch(camper.publicKey);
      console.log(camperAccount.owner.toBase58());
      console.log(anchor.AnchorProvider.env().wallet.publicKey.toBase58());
      console.log(camper.publicKey);
      await program.methods
        .editHandle('s')  
        .accounts({
            camper: camper.publicKey,
            owner: anchor.AnchorProvider.env().wallet.publicKey,
        })
        .signers([camper])
        .rpc({
          skipPreflight:true
        })    
      });
});
