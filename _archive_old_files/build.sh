#!/bin/bash
# Build script for Lutheran Church Management System
# Robust to being called from any location

set -e
cd "$(dirname "$0")"
npm run build
echo "Build complete. Files are in the 'build' directory."
