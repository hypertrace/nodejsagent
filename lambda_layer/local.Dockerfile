FROM amazon/aws-sam-cli-build-image-nodejs10.x

ADD . /workspace

WORKDIR /workspace

RUN mkdir -p /build
# need to ignore package.json temporarily otherwise it will act like we are
# installing hypertrace/nodejsagent within hypertrace/nodejsagent
RUN mv package.json package-temp-ignore.json
RUN npm install ./hypertrace-nodejsagent-*.tgz
RUN mv hypertrace_sdk/hypertrace-instrument /build
RUN chmod 777 /build/hypertrace-instrument
RUN mkdir -p /build/nodejs/node_modules
RUN cp -r ./node_modules /build/nodejs/
RUN cp package-temp-ignore.json /build/nodejs/package.json
RUN ls /build
RUN cd /build && ls && zip -r layer.zip hypertrace-instrument nodejs

CMD cp /build/layer.zip /out/layer.zip
