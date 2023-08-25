use anchor_lang::prelude::*;

declare_id!("4K4jS5PjPP2EPRrFF4EwxzZLNK3t7JVjSXqTG2d6Nn12");

#[program]
pub mod register_camper {
    use super::*;
    pub fn create_camper(ctx: Context<CreateCamper>, handle: String) -> Result<()> {
        let camper: &mut Account<Camper> = &mut ctx.accounts.camper; 
        let owner: &Signer = &ctx.accounts.owner;
        let clock: Clock = Clock::get().unwrap(); 

        require!(handle.chars().count() < 30, CamperErrors::HandleTooLong);

        camper.owner = *owner.key; 
        camper.timestamp = clock.unix_timestamp; 
        camper.handle = handle;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCamper<'info> {
    #[account(init, payer = owner, space = Camper::LEN)]
    pub camper: Account<'info, Camper>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>
}

#[account]
pub struct Camper {
    pub owner: Pubkey,
    pub timestamp: i64,
    pub handle: String
}
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string.
const MAX_HANDLE_LENGTH: usize = 30 * 4; // 30 chars max

impl Camper {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author
        + TIMESTAMP_LENGTH // Timestamp
        + STRING_LENGTH_PREFIX + MAX_HANDLE_LENGTH; // Handle aka. username
}

#[error_code]
pub enum CamperErrors   {
    #[msg("The handle should be 30 characters long maximum.")]
    HandleTooLong
}
