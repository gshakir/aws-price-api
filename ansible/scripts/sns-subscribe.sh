#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

account_id=$1
lambda_function=$2


aws lambda add-permission --function-name ${lambda_function} \
    --statement-id ${lambda_function} \
    --action lambda:InvokeFunction \
    --principal sns.amazonaws.com \
    --source-arn arn:aws:sns:us-east-1:278350005181:price-list-api

aws sns subscribe --topic-arn arn:aws:sns:us-east-1:278350005181:price-list-api \
    --protocol lambda \
    --notification-endpoint arn:aws:lambda:us-east-1:${account_id}:function:${lambda_function}
