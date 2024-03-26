#!/bin/sh

echo "🏠 Installing root packages"
(npm ci && chmod ug+x .husky/*)
