#!/bin/sh -l

pwd
ls
tea -SE pnpm store path
tea -SE xc setup

env | grep GITHUB