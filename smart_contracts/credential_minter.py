#pragma version 8
txn ApplicationID
int 0
==
bnz main_l14
txn OnCompletion
int DeleteApplication
==
bnz main_l13
txn OnCompletion
int UpdateApplication
==
bnz main_l12
txn OnCompletion
int OptIn
==
bnz main_l11
txn OnCompletion
int CloseOut
==
bnz main_l10
txna ApplicationArgs 0
byte "set_registry"
==
bnz main_l9
txna ApplicationArgs 0
byte "mint"
==
bnz main_l8
err
main_l8:
txn Sender
callsub checkisverified_0
assert
txn NumAccounts
int 0
>
assert
itxn_begin
int acfg
itxn_field TypeEnum
int 1
itxn_field ConfigAssetTotal
int 0
itxn_field ConfigAssetDecimals
int 1
itxn_field ConfigAssetDefaultFrozen
global CurrentApplicationAddress
itxn_field ConfigAssetManager
global CurrentApplicationAddress
itxn_field ConfigAssetReserve
global CurrentApplicationAddress
itxn_field ConfigAssetFreeze
global CurrentApplicationAddress
itxn_field ConfigAssetClawback
byte "ipfs://"
txna ApplicationArgs 2
concat
itxn_field ConfigAssetURL
txna ApplicationArgs 1
itxn_field ConfigAssetMetadataHash
byte "CredX Credential"
itxn_field ConfigAssetName
byte "CREDX"
itxn_field ConfigAssetUnitName
itxn_submit
itxn_begin
int axfer
itxn_field TypeEnum
itxn CreatedAssetID
itxn_field XferAsset
txna Accounts 1
itxn_field AssetReceiver
int 1
itxn_field AssetAmount
itxn_submit
itxn_begin
int afrz
itxn_field TypeEnum
itxn CreatedAssetID
itxn_field FreezeAsset
txna Accounts 1
itxn_field FreezeAssetAccount
int 1
itxn_field FreezeAssetFrozen
itxn_submit
byte "Minted Credential Asset ID: "
itxn CreatedAssetID
itob
concat
log
int 1
return
main_l9:
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
main_l10:
int 1
return
main_l11:
int 1
return
main_l12:
txn Sender
byte "admin"
app_global_get
==
return
main_l13:
txn Sender
byte "admin"
app_global_get
==
return
main_l14:
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