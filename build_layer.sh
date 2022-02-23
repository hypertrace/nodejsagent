#!/bin/sh
REGION=$1    # required # ex: us-east-2

if [ -z ${REGION} ]; then
  echo "must pass 1st argument to indicate the region to deploy the layer into"
  echo "ex: us-east-2"
  echo "The region should be the same region as the lambda you want to instrument"
  exit 1
fi


LAYER_NAME="hypertrace-dev-nodejs"
LAYER_DESCRIPTION="Hypertrace layer for Nodejs"
rm -rf lambda_layer/build
mkdir -p lambda_layer/build

cp ./hypertrace-nodejsagent-*.tgz ./lambda_layer
cp ./package.json ./lambda_layer
docker build -t aws-hypertrace-lambda-node-layer -f lambda_layer/local.Dockerfile lambda_layer

docker run --rm -v "$(pwd)/lambda_layer/build:/out" aws-hypertrace-lambda-node-layer
cd lambda_layer && unzip build/layer.zip -d ./build/layer
sam deploy build -t ./template.yaml --stack-name hypertrace-node --resolve-s3 --region $REGION \
--parameter-overrides LayerName=$LAYER_NAME

arn=$(aws lambda list-layer-versions --layer-name $LAYER_NAME --region $REGION --query 'max_by(LayerVersions, &Version).LayerVersionArn')
		echo $arn | sed 's/\"//g'
echo $arn