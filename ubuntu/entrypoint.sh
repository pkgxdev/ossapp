#!/bin/sh -l

tea .
tea pnpm install
tea pnpm build:gui
# tea pnpm build:gui