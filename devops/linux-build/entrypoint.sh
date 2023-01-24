#!/bin/sh -l

xxx=$(tea -SE pnpm store path)
echo $xxx
ls $xxx
pwd