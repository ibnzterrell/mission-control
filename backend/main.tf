provider "google" {
  credentials = "gcp-credentials.json"
  project     = "mission-control-273222"
  region      = "us-central1"
  zone        = "us-central1-a"
}

resource "google_storage_bucket" "missioncontrolapi" {
  name = "missioncontrolapi"
}

data "archive_file" "api-zip" {
  type        = "zip"
  source_dir  = "${path.module}/api"
  output_path = "${path.module}/zips/api.zip"
}

resource "google_storage_bucket_object" "api-zip" {
  name   = "api-${data.archive_file.api-zip.output_md5}.zip"
  bucket = google_storage_bucket.missioncontrolapi.name
  source = "${path.module}/zips/api.zip"
}

resource "google_cloudfunctions_function" "api" {
  name                  = "api"
  description           = "api-function"
  runtime               = "nodejs8"
  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.missioncontrolapi.name
  source_archive_object = google_storage_bucket_object.api-zip.name
  trigger_http          = true
  entry_point           = "handler"
}

resource "google_cloudfunctions_function_iam_binding" "api-invoke" {
  project        = google_cloudfunctions_function.api.project
  region         = google_cloudfunctions_function.api.region
  cloud_function = google_cloudfunctions_function.api.name

  role    = "roles/cloudfunctions.invoker"
  members = ["allUsers"]
}

output "Function_URL_API" {
  value = google_cloudfunctions_function.api.https_trigger_url
}
