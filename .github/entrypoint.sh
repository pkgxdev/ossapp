#!/bin/bash
mkdir -p $HOME
cp -r /root/.tea $HOME
ln -sf $HOME/.tea/tea.xyz/v0.18.1/bin/tea /usr/local/bin/tea
bash