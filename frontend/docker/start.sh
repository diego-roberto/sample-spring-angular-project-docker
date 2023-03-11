#!/bin/bash
echo "Configuring environment variables..."
cp src/environments/environment.example.ts src/environments/environment.ts 
sed -i ""s,_PROFILE,dev,g"" src/environments/environment.ts
sed -i ""s,_BACKEND_URL,http://localhost:8082,g"" src/environments/environment.ts

cat src/environments/environment.ts

echo "Running NODE RUN PROD..."
node --max_old_space_size=3000 node_modules/@angular/cli/bin/ng build --aot --prod