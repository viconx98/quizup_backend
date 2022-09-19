# Quizup backend

### Instructions on how to run
1. Clone this project
2. Run `npm install`
3. Create a file named `.env` which follows the same structure as `.env_dummy` but has the actual secrets and the MongoDB url
4. Run `npm start`


## Endpoints
[Postman Collection](https://github.com/viconx98/quizup_backend/blob/master/quizup_postman_collection.json)

Note: All endpoints except `/auth/*` require the header `Authorization: Bearer <access_token>` to be present
