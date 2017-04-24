root="../../.."

chmod u+x scripts/settings.sh
chmod u+x scripts/uninstall.sh

# --------------------
echo 'Downloading dependencies..'

npm install

# --------------------
echo 'Settings..'

settings_dir=$root/dev/tools/gulp/
if [ -d $settings_dir ]
then
    echo "Settings directory already exists"
else
    mkdir $settings_dir
fi

scripts/settings.sh

# --------------------
echo 'copying assets..'

cp assets/gulpfile.js  $root/gulpfile.js
cp assets/themes.js    $settings_dir/themes.js
cp -R node_modules     $root/node_modules/

exit
