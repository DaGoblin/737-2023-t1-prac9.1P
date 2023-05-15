set -ex
# SET THE FOLLOWING VARIABLES
# docker hub username
USERNAME=s222574652
# image name
IMAGE=auth_ms_mongo_db
docker build -t $USERNAME/$IMAGE:latest .

