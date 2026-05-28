echo $GOOGLE_API_KEY | \
  gcloud secrets create GOOGLE_API_KEY \
  --project=PROJECT_ID \
  --data-file=-

gcloud secrets add-iam-policy-binding GOOGLE_API_KEY \
  --member="COMPUTE_SERVICE_ACCOUNT" \
  --role="roles secretmanager.secretAccessor" \
  --project="PROJECT_ID"

export GOOGLE_CLOUD_PROJECT="PROJECT_ID"
export GOOGLE_CLOUD_LOCATION="us-central1"
export AGENT_PATH="./weather_time"
export SERVICE_NAME="weather-time"
export APP_NAME="weather_time_app"

adk deploy cloud_run \
--project=$GOOGLE_CLOUD_PROJECT \
--region=$GOOGLE_CLOUD_LOCATION \
--service_name=$SERVICE_NAME \
--app_name=$APP_NAME \
--with_ui \
$AGENT_PATH
