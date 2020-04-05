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
resource "google_storage_bucket" "missioncontrolbucket_default"{
    name="missioncontrolbucket_default"
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
                block +=
                    `
data "archive_file" "${func.name}-zip" {
    type        = "zip"
    source_dir  = "\${path.module}/${func.name}"
    output_path = "\${path.module}/zips/${func.name}.zip"
  }
  
  resource "google_storage_bucket_object" "${func.name}-zip" {
    name   = "api-\${data.archive_file.${func.name}-zip.output_md5}.zip"
    bucket = google_storage_bucket.missioncontrolbucket_default.name
    source = "\${path.module}/zips/${func.name}.zip"
  }
  
  resource "google_cloudfunctions_function" "${func.name}" {
    name                  = "${func.name}"
    description           = "${func.name}-function"
    runtime               = "nodejs8"
    available_memory_mb   = 128
    source_archive_bucket = google_storage_bucket.missioncontrolbucket_default.name
    source_archive_object = google_storage_bucket_object.${func.name}-zip.name
    trigger_http          = true
    entry_point           = "handler"
  }
  
  resource "google_cloudfunctions_function_iam_binding" "${func.name}-invoke" {
    project        = google_cloudfunctions_function.${func.name}.project
    region         = google_cloudfunctions_function.${func.name}.region
    cloud_function = google_cloudfunctions_function.${func.name}.name
  
    role    = "roles/cloudfunctions.invoker"
    members = ["allUsers"]
  }
  
  output "Function_URL_API" {
    value = google_cloudfunctions_function.${func.name}.https_trigger_url
  }
                 

`;
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
