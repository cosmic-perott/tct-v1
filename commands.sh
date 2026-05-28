#the code here has nothing to do with the program im just writing them here so i dont need to go to the documentation website every single time i need another bash command
main() {
    gcloud projects delete PROJECT_ID
    gcloud config set project PROJECT_ID
    gcloud services enable run.googleapis.com aiplatform.googleapis.com cloudbuild.googleapis.com
    gcloud projects add-iam-policy-binding PROJECT_ID \
    --member=serviceAccount:SERVICE_ACCOUNT_EMAIL_ADDRESS \
    --role=roles/run.builder
    PROJECT_NUMBER-compute@developer.gserviceaccount.com
}

agent() {
    mkdir parent_folder
    cd parent_folder
    mkdir multi_tool_agent
    cd multi_tool_agent
    from . import agent
    GOOGLE_GENAI_USE_VERTEXAI=TRUE
    GOOGLE_CLOUD_PROJECT=PROJECT_ID
    GOOGLE_CLOUD_LOCATION=REGION
    google-adk
    gcloud run deploy --source .
}

run() {
curl -X GET SERVICE_URL/list-apps
curl -X POST SERVICE_URL/apps/multi_tool_agent/users/u_123/sessions/s_123 -H "Content-Type: application/json" -d '{"key1": "value1", "key2": "value2"}'
curl -X POST SERVICE_URL/run \
-H "Content-Type: application/json" \
-d "{\"appName\": \"multi_tool_agent\",\"userId\": \"u_123\",\"sessionId\": \"s_123\",\"newMessage\": { \"role\": \"user\", \"parts\": [{ \"text\": \"What's the weather in New York today?\" }]}}"
}

run

main
