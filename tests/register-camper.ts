import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { RegisterCamper } from "../target/types/register_camper";
import * as assert from "assert";
import { use } from "chai";

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

      assert.equal(camperAccount.owner.toBase58(),  anchor.AnchorProvider.env().wallet.publicKey);
      assert.equal(camperAccount.handle, 'hathor');
      assert.ok(camperAccount.timestamp);
  });

  it('can edit the handle of a camper', async () => {
    const user = anchor.web3.Keypair.generate();
    const camper = anchor.web3.Keypair.generate();
    await program.provider.connection.requestAirdrop(user.publicKey, 1000000000);

    await program.methods
        .createCamper('suko')  
        .accounts({
            camper: camper.publicKey,
            owner: user.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user, camper])
        .rpc({
          skipPreflight:true
        })
      await program.methods
        .editHandle('s')  
        .accounts({
            camper: camper.publicKey,
            owner: user.publicKey,
        })
        .signers([user])
        .rpc({
          skipPreflight:true
        })  
      const camperAccount = await program.account.camper.fetch(camper.publicKey);
      assert.equal(camperAccount.handle, 's');
      });
});
