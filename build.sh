#!/usr/bin/env bash

# Create version string.

DATE=`date +%s`
CERT='selfDB.p12'
KEY='Alias2Mocha7'
ORG="Atomic Lotus, LLC"
COUNTRY="US"
CITY="Richmond"
DOMAIN="atomiclotus.net"
VERS=`cat VERSION`
NAME=${PWD##*/}
BUNDLE_ID="com.atomic.$NAME"

# Execute Gulp build to concat assets.

# gulp build

# Wait for gulp build to complete.

# wait $!

# If the `build` directory exists, delete it.

if [ -d build ]; then
    rm -Rf build
fi

# If the `dist` directory exists, clear its contents.

if [ -d dist ]; then
    rm -Rf dist/*
fi

# If the `dist` directory does not exist, create it.

if [ ! -d dist ]; then
    mkdir dist
fi

# Create a clean build directory.

mkdir build

# Copy source code to build directory.

cp -R client build/client
cp -R csxs build/csxs
cp -R host build/host
cp -R custom build/custom

if [ -f icon.png ]; then
  cp icon.png build/icon.png
fi

# Build and sign the extension.

./bin/ZXPSignCmd -selfSignedCert $COUNTRY $CITY "$ORG" $DOMAIN $KEY ./bin/$CERT
./bin/ZXPSignCmd -sign build dist/$NAME-$VERS.zxp ./bin/$CERT $KEY -tsa https://www.safestamper.com/tsa

# Build custom installers

#cep-packager \
#	--name $NAME \
#	--bundle-id $BUNDLE_ID \
#	--version $VERS \
#	--macos-resources $PWD/resources/macos \
#	--windows-resources $PWD/resources/windows \
#	--macos-dest $PWD/dist/$NAME.$VERS.pkg \
#	--windows-dest $PWD/dist/$NAME.$VERS.exe \
#	./build

# Delete the build directory.

if [ -d build ]; then
   rm -Rf build
fi
