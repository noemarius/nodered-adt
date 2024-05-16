FROM nodered/node-red:latest-18

COPY ./nodes /data/nodes
COPY ./misc /data
WORKDIR /data
RUN npm install /data/nodes --unsafe-perm --no-update-notifier --no-fund 
WORKDIR /usr/src/node-red