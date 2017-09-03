!#/bin/bash

npm run build
tar -cvzf build.tar.gz build/client/
sudo rm -rf ./codenames
sudo cp build.tar.gz /var/www/html/labs
sudo rm build.tar.gz
sudo rm -rf /var/www/html/labs/codenames
pushd /var/www/html/labs
sudo tar -xvzf build.tar.gz
sudo mv build/client codenames

# many links need to be server-absolute at development time, but relative
# in prod. This regex takes href and src attributes that begin with a single
# slash and removes the slash.
sed -i -E "s/([href|src])=\"\/([a-z])/\1=\"\2/" codenames/index.html
sudo rm -rf build
popd
