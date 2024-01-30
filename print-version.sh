#! /bin/bash

cd topobank
echo "topobank"
git describe --tags
echo "ce-ui"
cd ../ce-ui
git describe --tags
echo "topobank-statistics"
cd ../topobank-statistics
git describe --tags
echo "topobank-contact"
cd ../topobank-contact
git describe --tags
echo "topobank-publication"
cd ../topobank-publication
git describe --tags