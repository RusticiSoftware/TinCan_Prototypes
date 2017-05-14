#!/bin/sh
#
# This script will create zips of each prototype that exclude any file not
# necessary for the operation of the prototype (e.g., licenses, gruntfiles,
# test scripts, .git directories, and so forth.)
#

echo $0;
echo "Removing existing packages";
mkdir -p pkgs
rm -rf pkgs/*;

ROOT="$(pwd)"

function make_zip() {
     cd "$1"
     zip -rq --exclude="@${ROOT}/package_excludes.txt" "$2" .
}

echo "Zipping all prototypes"
make_zip "${ROOT}" "${ROOT}/pkgs/tincan_prototypes_allinone.zip" .

echo "Zipping Golf Example"
make_zip "${ROOT}/GolfExample_TCAPI" "${ROOT}/pkgs/GolfExample_TCAPI.zip" .

echo "Zipping Tetris"
make_zip "${ROOT}/JsTetris_TCAPI" "${ROOT}/pkgs/JsTetris_TCAPI.zip" .

echo "Zipping Locator"
make_zip "${ROOT}/Locator_TCAPI" "${ROOT}/pkgs/Locator_TCAPI.zip" .

echo "Zipping all packages"
cd "${ROOT}/pkgs"
zip -q "${ROOT}/pkgs/tincan_prototypes_packages.zip" *_TCAPI.zip
cd -

echo "Done";
