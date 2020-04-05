const providerGCP = 'Google Cloud Platform';

function generateProviderBlock(provider, region, projectID) {
    let block = '';
    if (provider === providerGCP) {
        block +=
            `
provider "google" {
    credentials = "gcp-credentials.json"
    project = "${projectID}"
    region = "${region}"
    zone = "${region}-a"
}
    `;
    }
    return block;
}
function generateDefaultStorageBlock(provider) {
    let block = '';
    if (provider === providerGCP) {
        block +=
            `
resource "google_storage_bucket" "mc_DefaultBucket"{
    name="mc_DefaultBucket"
}
    `;
    }
    return block;
}
function generateDefaultDatabaseBlock(provider) {
    let block = '';
    if (provider === providerGCP) {
        block +=
            `
resource "google_bigquery_dataset" "mc_DefaultDB"{
    dataset_id="mc_DefaultDB"
    location="US"
}
    `;
    }
    return block;
}

function generateFunctionBlocks(provider, functions) {
    let block = '';
    if (functions.length > 0) {
        if (provider === providerGCP) {
            block += generateDefaultStorageBlock(provider);
            functions.forEach(func => {
                block += '';
            });
        }
    }
    return block;
}
function generateDatabaseTableBlocks(provider, databaseTables) {
    let block = '';
    if (provider === providerGCP) {
        block += generateDefaultDatabaseBlock(provider);
        databaseTables.forEach(table => {
            block +=
                `
resource "google_bigquery_table" "${table.name}" {
    dataset_id = google_bigquery_dataset.mc_DefaultDB.dataset_id
    table_id = "${table.name}"
}
`;
        });
    }
    return block;
}
function generateStorageBucketBlocks(provider, storageBuckets) {
    let block = '';

    if (provider === providerGCP) {
        storageBuckets.forEach(bucket => {
            block +=
                `
resource "google_storage_bucket" "${bucket.name}" {
    name="${bucket.name}"
}
`;
        });
    }
    return block;
}
function generateTerraform(state) {
    let tfConfig = '';
    tfConfig += generateProviderBlock(state.provider, state.region, state.projectID);
    tfConfig += generateFunctionBlocks(state.provider, state.functions);
    tfConfig += generateDatabaseTableBlocks(state.provider, state.databaseTables);
    tfConfig += generateStorageBucketBlocks(state.provider, state.storageBuckets);
    return tfConfig;
}

export { generateTerraform };
