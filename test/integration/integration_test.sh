lsof -i tcp:8087 | awk 'NR!=1 {print $2}' | xargs kill
cd ../../ && npm link && cd test/integration && tsc && npm link @hypertrace/nodejsagent
npm install
node app.js &
sleep 2
RESULT=$(curl -s -o /dev/null -w "%{http_code}" 'http://localhost:8087/test' \
         --header 'x-filter-test: true')
if [[ -z $RESULT || $RESULT != 403 ]]; then
    echo "Integration test failed - filtering headers didnt return 403"
    exit 1
fi

RESULT_BODY=$(curl -w "%{http_code}" 'http://localhost:8087/test' \
              --header 'Content-Type: application/json' \
              --data-raw '{"test":"block-this-body"}')
if [[ -z $RESULT_BODY || $RESULT_BODY != 403 ]]; then
   echo "Integration test failed - filtering body didnt return 403"
   echo $RESULT_BODY
   exit 1
fi
lsof -i tcp:8087 | awk 'NR!=1 {print $2}' | xargs kill