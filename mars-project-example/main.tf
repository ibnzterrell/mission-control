
provider "google" {
    credentials = "gcp-credentials.json"
    project = "mars-project-273221"
    region = "us-central1"
    zone = "us-central1-a"
}
    
resource "google_storage_bucket" "missioncontrolbucket_default"{
    name="missioncontrolbucket_default"
}
    
data "archive_file" "hello-zip" {
    type        = "zip"
    source_dir  = "${path.module}/hello"
    output_path = "${path.module}/zips/hello.zip"
  }
  
  resource "google_storage_bucket_object" "hello-zip" {
    name   = "api-${data.archive_file.hello-zip.output_md5}.zip"
    bucket = google_storage_bucket.missioncontrolbucket_default.name
    source = "${path.module}/zips/hello.zip"
  }
  
  resource "google_cloudfunctions_function" "hello" {
    name                  = "hello"
    description           = "hello-function"
    runtime               = "nodejs8"
    available_memory_mb   = 128
    source_archive_bucket = google_storage_bucket.missioncontrolbucket_default.name
    source_archive_object = google_storage_bucket_object.hello-zip.name
    trigger_http          = true
    entry_point           = "handler"
  }
  
  resource "google_cloudfunctions_function_iam_binding" "hello-invoke" {
    project        = google_cloudfunctions_function.hello.project
    region         = google_cloudfunctions_function.hello.region
    cloud_function = google_cloudfunctions_function.hello.name
  
    role    = "roles/cloudfunctions.invoker"
    members = ["allUsers"]
  }
  
  output "Function_URL_API" {
    value = google_cloudfunctions_function.hello.https_trigger_url
  }
                 


resource "google_bigquery_dataset" "mc_DefaultDB"{
    dataset_id="mc_DefaultDB"
    location="US"
}
    
resource "google_bigquery_table" "climate_readings" {
    dataset_id = google_bigquery_dataset.mc_DefaultDB.dataset_id
    table_id = "climate_readings"
}

resource "google_storage_bucket" "soil-images" {
    name="soil-images"
}
