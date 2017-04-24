# --------------------

read -p "Enter your vendor name (Eg. magento, bitbull.. ): " vendor
read -p "Theme or module to compile (Eg. luma ): " module
read -p "Theme or module folder name (Eg. theme-frontend-luma): " folder
read -p "Language to compile (Eg. it_IT): " lang

context=`echo ${vendor:0:1} | tr  '[a-z]' '[A-Z]'`${vendor:1}

settings="module.exports = {
      $module: {
        'src': [
           'vendor/$vendor/$folder'
        ],
        'dest': 'pub/static/frontend/$context/$module',
        'locale': '['$lang']',
        'area': 'frontend',
        'vendor': '$vendor',
        'name': '$module',
        'files': [
           'css/styles-m',
           'css/styles-l'
        ]
      }
  };"

echo $settings >> assets/themes.js
