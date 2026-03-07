                         ┌────────────────────────────┐
                         │        End Users           │
                         │                            │
                         │  Institutions  Students    │
                         │  Employers / Verifiers     │
                         └─────────────┬──────────────┘
                                       │
                                       │ HTTPS
                                       ▼
                        ┌────────────────────────────────┐
                        │        Frontend (Next.js)       │
                        │---------------------------------│
                        │ Landing Page                    │
                        │ Dashboard (Institution)         │
                        │ Dashboard (Student)             │
                        │ Credential Issue Page           │
                        │ Credential Viewer               │
                        │ Public Verification Page        │
                        │---------------------------------│
                        │ Auth0 SDK Integration           │
                        │ API Client (Axios / Fetch)      │
                        └──────────────┬───────────────────┘
                                       │
                                       │ REST API
                                       ▼
                       ┌──────────────────────────────────┐
                       │        Backend (Node.js)          │
                       │-----------------------------------│
                       │ Express API Server                │
                       │ Authentication Middleware         │
                       │ Credential Controller             │
                       │ Issuer Controller                 │
                       │ Blockchain Service                │
                       │ IPFS Service                      │
                       │ Metadata Builder (ARC-3)          │
                       └───────┬──────────┬───────────────┘
                               │          │
                               │          │
                               ▼          ▼
                    ┌───────────────┐    ┌──────────────────┐
                    │    Auth0       │    │      IPFS        │
                    │--------------- │    │------------------│
                    │ Identity       │    │ Credential Files │
                    │ User Auth      │    │ Metadata JSON    │
                    │ JWT Tokens     │    │ PDF Documents    │
                    └───────┬────────┘    └─────────┬────────┘
                            │                       │
                            │                       │
                            ▼                       ▼
                     ┌─────────────────────────────────────┐
                     │        Algorand Blockchain            │
                     │--------------------------------------│
                     │ Credential NFTs (ARC-3 ASA)          │
                     │ Credential Manager Smart Contract    │
                     │ Issuer Registry Smart Contract       │
                     │ On-chain Credential Status           │
                     │--------------------------------------│
                     │ Data Stored On-Chain:                │
                     │ assetID                              │
                     │ issuer address                       │
                     │ student wallet                       │
                     │ credential status                    │
                     │ metadata hash                        │
                     │ IPFS CID                             │
                     └──────────────┬───────────────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────────┐
                       │    Algorand Indexer API      │
                       │------------------------------│
                       │ Query Assets                 │
                       │ Query Transactions           │
                       │ Query Credential Ownership   │
                       └─────────────────────────────┘