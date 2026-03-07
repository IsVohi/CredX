#pragma version 8
txn ApplicationID
int 0
==
bnz main_l26
txn OnCompletion
int DeleteApplication
==
bnz main_l25
txn OnCompletion
int UpdateApplication
==
bnz main_l24
txn OnCompletion
int OptIn
==
bnz main_l23
txn OnCompletion
int CloseOut
==
bnz main_l22
txna ApplicationArgs 0
byte "set_registry"
==
bnz main_l21
txna ApplicationArgs 0
byte "update_status"
==
bnz main_l20
txna ApplicationArgs 0
byte "revoke"
==
bnz main_l19
txna ApplicationArgs 0
byte "get_status"
==
bnz main_l15
txna ApplicationArgs 0
byte "verify"
==
bnz main_l11
err
main_l11:
txna Assets 0
asset_params_get AssetCreator
store 1
store 0
load 1
assert
load 0
callsub checkisverified_0
assert
txna Assets 0
asset_params_get AssetMetadataHash
store 5
store 4
load 5
assert
load 4
txna ApplicationArgs 1
==
assert
txna Assets 0
itob
box_get
store 3
store 2
load 3
bnz main_l14
int 1
int 1
==
assert
main_l13:
byte "CredentialVerified: "
txna Assets 0
itob
concat
log
int 1
return
main_l14:
load 2
btoi
int 0
==
assert
b main_l13
main_l15:
txna Assets 0
itob
box_get
store 3
store 2
load 3
bnz main_l18
byte "Status: "
int 0
itob
concat
log
main_l17:
int 1
return
main_l18:
byte "Status: "
load 2
btoi
itob
concat
log
b main_l17
main_l19:
txna Assets 0
asset_params_get AssetCreator
store 1
store 0
load 1
assert
txn Sender
load 0
==
assert
txna Assets 0
itob
int 1
itob
box_put
byte "Revoked: "
txna Assets 0
itob
concat
log
int 1
return
main_l20:
txna Assets 0
asset_params_get AssetCreator
store 1
store 0
load 1
assert
txn Sender
load 0
==
assert
txna ApplicationArgs 1
btoi
int 3
<=
assert
txna Assets 0
itob
txna ApplicationArgs 1
btoi
itob
box_put
byte "StatusUpdated: "
txna Assets 0
itob
concat
byte " -> "
concat
txna ApplicationArgs 1
btoi
itob
concat
log
int 1
return
main_l21:
txn Sender
byte "admin"
app_global_get
==
assert
byte "registry_app_id"
txna ApplicationArgs 1
btoi
app_global_put
int 1
return
main_l22:
int 1
return
main_l23:
int 1
return
main_l24:
txn Sender
byte "admin"
app_global_get
==
return
main_l25:
txn Sender
byte "admin"
app_global_get
==
return
main_l26:
byte "admin"
txn Sender
app_global_put
int 1
return

// check_is_verified
checkisverified_0:
proto 1 1
itxn_begin
int appl
itxn_field TypeEnum
byte "registry_app_id"
app_global_get
itxn_field ApplicationID
byte "is_verified"
itxn_field ApplicationArgs
frame_dig -1
itxn_field ApplicationArgs
itxn_submit
int 1
retsub