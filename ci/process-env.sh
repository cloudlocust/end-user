#!/bin/bash

# Recreate config file
rm -rf /usr/share/nginx/html/env-config.js
touch /usr/share/nginx/html/env-config.js

# Store value of REACT_APP_BASENAME_URL in a separate variable
basename_url=""

# Add assignment
echo "window._env_ = {" >> /usr/share/nginx/html/env-config.js
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

  # Store value of REACT_APP_BASENAME_URL
  if [ "$varname" = "REACT_APP_BASENAME_URL" ]; then
    basename_url="$value"
  fi

  # Append configuration property to JS file
  echo "  $varname: \"$value\"," >> /usr/share/nginx/html/env-config.js
done < /usr/share/nginx/html/.env.template

echo "}" >> /usr/share/nginx/html/env-config.js

# Check if the basename_url variable is non-empty
if [[ -n "${basename_url}" ]]; then
  # Check if basename_url does not end with a slash. In the case of "/app"
  if [[ ! "${basename_url}" = */ ]]; then
    # If it doesn't, append a slash to the end of basename_url. It will be like "/app/"
    basename_url="${basename_url}/"
  fi
  # Replace all occurrences of %REACT_APP_BASENAME_URL% with basename_url in /usr/share/nginx/html/index.html
  sed -i "s|%REACT_APP_BASENAME_URL%|${basename_url}|g" /usr/share/nginx/html/index.html
else
  # In this case, it's empty, then the default value is an "/"
  basename_url="/"
  sed -i "s|%REACT_APP_BASENAME_URL%|${basename_url}|g" /usr/share/nginx/html/index.html
fi