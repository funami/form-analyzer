# form-analyzer

fetch form actions and analytics

## deploy cloud functions

```.env
API_KEY='[Api Key]'
```

npx dotenv-to-yaml .env # conv to .env.yaml

gcloud beta functions deploy form-measure-event \
--gen2 \
--region=asia-northeast1 \
--runtime=nodejs16 \
--entry-point=formMeasureEvent \
--trigger-http \
--allow-unauthenticated \
--env-vars-file .env.yaml
