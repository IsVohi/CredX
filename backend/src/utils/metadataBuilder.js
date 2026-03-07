// Metadata Builder
// Helper to construct exact ARC-3 JSON for Algorand ASAs according to CredX spec

exports.buildARC3Metadata = ({
    name,
    description,
    imageCid,
    issuer_wallet,
    student_wallet,
    credential_id,
    program_name,
    issued_timestamp,
    expiry_timestamp,
    credential_status = 'ACTIVE',
    ipfs_document_cid
}) => {
    return {
        name,
        description,
        image: `ipfs://${imageCid}`,
        properties: {
            issuer_wallet,
            student_wallet,
            credential_id,
            program_name,
            issued_timestamp,
            expiry_timestamp,
            credential_status,
            ipfs_document: `ipfs://${ipfs_document_cid}`
        }
    };
};
