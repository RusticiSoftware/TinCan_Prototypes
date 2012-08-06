#!/bin/sh

git submodule init
git submodule update
cd StatementViewer/resources
git submodule init
git submodule update
cd ..
