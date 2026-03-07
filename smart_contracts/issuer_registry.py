from pyteal import *

def approval_program():
    """
    Issuer Registry Smart Contract (CredX)
    Maintains a registry of verified institutions authorized to issue credentials.
    """
    
    # Constants
    admin_addr = Bytes("admin")
    
    # State keys
    # For a given institution address (using their account as the key namespace in local state
    # or a concatenated global state key). Here we use global state for simplicity, where
    # the key is the institution address, and the value is a concatenated byte string of:
    # [1 byte status (0=pending, 1=verified, 2=revoked)] + [8 bytes timestamp] + [variable length name]
    # For a production app, it is common to use local state on the institution's account (they opt-in),
    # but global state with Box storage or concatenated keys also works. 
    # To strictly meet the requirement without Box storage (for compatibility), we'll define helper functions.

    # 1. Initialization (Deploy)
    on_creation = Seq([
        App.globalPut(admin_addr, Txn.sender()),
        Return(Int(1))
    ])

    # 2. Register Institution (Institution calls this to register themselves)
    # Args: [ "register", institution_name ]
    register_institution = Seq([
        # Key: Txn.sender()
        # Value: Int(0) [Pending status] | Int(0) [Approval Timestamp] | name
        # Since we can't easily pack complex types into a single global uint/bytes without helper libs,
        # we will use three separate global keys prefixed by the address for simplicity in this example.
        App.globalPut(Concat(Txn.sender(), Bytes("_name")), Txn.application_args[1]),
        App.globalPut(Concat(Txn.sender(), Bytes("_status")), Int(0)), # 0 = Pending
        App.globalPut(Concat(Txn.sender(), Bytes("_timestamp")), Int(0)),
        Return(Int(1))
    ])

    # 3. Approve Institution (Admin only)
    # Args: [ "approve", institution_address ]
    inst_addr = Txn.application_args[1]
    approve_institution = Seq([
        # Check admin
        Assert(Txn.sender() == App.globalGet(admin_addr)),
        
        # Ensure the institution has registered (name exists)
        Assert(Len(App.globalGet(Concat(inst_addr, Bytes("_name")))) > Int(0)),
        
        # Set status to 1 (Verified)
        App.globalPut(Concat(inst_addr, Bytes("_status")), Int(1)),
        # Set timestamp
        App.globalPut(Concat(inst_addr, Bytes("_timestamp")), Global.latest_timestamp()),
        Return(Int(1))
    ])

    # 4. Revoke Institution (Admin only)
    # Args: [ "revoke", institution_address ]
    revoke_institution = Seq([
        # Check admin
        Assert(Txn.sender() == App.globalGet(admin_addr)),
        
        # Set status to 2 (Revoked)
        App.globalPut(Concat(inst_addr, Bytes("_status")), Int(2)),
        # Update timestamp to revocation time
        App.globalPut(Concat(inst_addr, Bytes("_timestamp")), Global.latest_timestamp()),
        Return(Int(1))
    ])

    # 5. Check Verification (Callable by anyone, specifically the Credential Manager)
    # Args: [ "is_verified", institution_address ]
    is_verified_issuer = Seq([
        # Assert the status is 1 (Verified)
        Assert(App.globalGet(Concat(inst_addr, Bytes("_status"))) == Int(1)),
        # If true, execution continues and we return 1 (success)
        Return(Int(1))
    ])

    # Main Router
    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(Txn.sender() == App.globalGet(admin_addr))],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(Txn.sender() == App.globalGet(admin_addr))],
        [Txn.on_completion() == OnComplete.OptIn, Return(Int(1))],
        [Txn.on_completion() == OnComplete.CloseOut, Return(Int(1))],
        # Application calls
        [Txn.application_args[0] == Bytes("register"), register_institution],
        [Txn.application_args[0] == Bytes("approve"), approve_institution],
        [Txn.application_args[0] == Bytes("revoke"), revoke_institution],
        [Txn.application_args[0] == Bytes("is_verified"), is_verified_issuer],
    )

    return program

def clear_state_program():
    return Return(Int(1))

if __name__ == "__main__":
    import os
    
    # Ensure the smart_contracts directory exists
    os.makedirs(os.path.dirname(__file__), exist_ok=True)
    
    with open(os.path.join(os.path.dirname(__file__), "issuer_registry.teal"), "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=8)
        f.write(compiled)
