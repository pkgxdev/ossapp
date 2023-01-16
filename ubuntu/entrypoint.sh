#!/bin/sh -l

tea +nodejs.org +pnpm.io +rust-lang.org
tea pnpm install
tea pnpm build:gui