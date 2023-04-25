#!/bin/bash

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}

  # Replace %REACT_APP_BASENAME_URL% variable in index.html file with value from .env.template
  if [ "$varname" = "REACT_APP_BASENAME_URL" ]; then
    sed -i "s/%REACT_APP_BASENAME_URL%/$value/g" /usr/share/nginx/html/index.html
  fi
  
  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >> /usr/share/nginx/html/env-config.js
done < /usr/share/nginx/html/.env.template

echo "window._env_ = {" >> /usr/share/nginx/html/env-config.js
echo "}" >> /usr/share/nginx/html/env-config.js