#!/bin/bash

cd StatementViewer/TinCanJS;
git fetch; git checkout origin/master;
cd ..;
git add TinCanJS;
cd ..;

cd StatementViewer/resources;
git fetch; git checkout origin/master;
cd ..;
git add resources;
cd ..;

cd GolfExample_TCAPI/scripts/TinCanJS;
git fetch; git checkout origin/master;
cd ..;
git add TinCanJS;
cd ../..;

cd JsTetris_TCAPI/TinCanJS;
git fetch; git checkout origin/master;
cd ..;
git add TinCanJS;
cd ..;

cd Locator_TCAPI/scripts/TinCanJS;
git fetch; git checkout origin/master;
cd ..;
git add TinCanJS;
cd ../..;

cd ReportSample/scripts/TinCanJS;
git fetch; git checkout origin/master;
cd ..;
git add TinCanJS;
cd ../..;
