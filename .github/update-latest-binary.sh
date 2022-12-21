#!/bin/bash

git fetch
git checkout main


ARM_CPU=""
IS_M1=$(sysctl -a | grep "Apple M1")
IS_M2=$(sysctl -a | grep "Apple M2")

if [ -z "$IS_M1" ]
then
  if [ -z "$IS_M2" ]
  then
    echo "not valid"
  else
    ARM_CPU="m2"
  fi
else
  ARM_CPU="m1"
fi

if ["$ARM_CPU" == ""]
then
  echo "nothing to build"
else
  tag=$(git tag -l --sort=-creatordate | head -n 1)
  pnpm build:gui -b dmg

  echo "uploading to s3"
  build_path="$PWD/modules/gui/src-tauri/target/release/bundle/dmg/gui_0.1.0_aarch64.dmg"
  tag_path="s3://preview.gui.tea.xyz/release/tea_gui_$tag.$ARM_CPU.dmg"
  latest_path="s3://preview.gui.tea.xyz/release/tea_gui_latest.$ARM_CPU.dmg"
  aws s3 cp $build_path $tag_path
  aws s3 cp $tag_path $latest_path
fi