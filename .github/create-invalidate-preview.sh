#!/bin/bash

# 0. check if cloudfront exists with this prefix folder
# if exists
#   invalidate
# else
#   create cloudfront distribution
# echo cloudfront_domain=domain >> $GITHUB_OUTPUT
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

# echo $distribution_id

domain=""

if [[ $distribution_id = NONE ]]
then
    # config vars: TargetOriginId, Origin.Items.Id, Origin.Items.OriginPath, CallerReference, Comment 
    config=$(cat .github/template.json)
    config=$(echo $config | sed  -e "s/{{prefix}}/$prefix/g" | sed  -e "s/{{caller_reference}}/$prefix/g")

    new_config=$(aws cloudfront create-distribution --distribution-config "$config")

    distribution_id=$(echo $new_config | jq '.Distribution.Id' | tr -d '"')
    domain=$(echo $new_config | jq '.Distribution.DomainName' | tr -d '"')
    aws cloudfront wait distribution-deployed --id $distribution_id
else
    invalidation_id=$(aws cloudfront create-invalidation --distribution-id $distribution_id --paths /* | jq '.Invalidation.Id' | tr -d '"') 
    aws cloudfront wait invalidation-completed --distribution-id $distribution_id --id $invalidation_id
fi

echo "domain=$domain" >> $GITHUB_OUTPUT