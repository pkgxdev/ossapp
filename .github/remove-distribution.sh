#!/bin/bash

prefix=$1

echo $(aws cloudfront list-distributions --output json) >> ./test.json

data=$(cat ./test.json)
distribution_id="NONE"
for row in $(jq '.DistributionList.Items[] | @base64' < './test.json'); do
    _jq() {
        echo $row | tr -d '"' | base64 --decode | jq -r "${1}" | tr -d '"'
    }
    comment=$(_jq '.Comment')
    if [[ $comment = $prefix ]]
    then
        distribution_id=$(_jq '.Id')
    fi
done


if [[ $distribution_id = NONE ]]
then
    echo "distribution does not exist"
else
    echo $distribution_id
    config=$(aws cloudfront get-distribution-config --id $distribution_id)
    echo $config | jq '.DistributionConfig' | jq '.Enabled = false' >> final.json
    etag_get=$(aws cloudfront get-distribution --id $distribution_id | jq '.ETag' | tr -d '"')
    do_nothing=$(aws cloudfront update-distribution --id $distribution_id --if-match $etag_get --distribution-config file://final.json)
    echo "disabling distribution"
    aws cloudfront wait distribution-deployed --id $distribution_id
    echo "distribution disabled"
    etag_delete=$(aws cloudfront get-distribution --id $distribution_id | jq '.ETag' | tr -d '"')
    aws cloudfront delete-distribution --id $distribution_id --if-match $etag_delete
    echo "done"
fi