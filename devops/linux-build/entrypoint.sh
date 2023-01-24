#!/bin/sh -l


ls ~/node_modules || true
ls ~/.pnpm-store || true
ls ~/.cargo || true
ls ~/modules/gui/src-tauri/target || true

tea -SE xc build

ls ~/node_modules || true
ls ~/.pnpm-store || true
ls ~/.cargo || true
ls ~/modules/gui/src-tauri/target || true