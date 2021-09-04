FROM nginx:latest

WORKDIR /home/application/

COPY . /home/application/

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \
    npm

RUN ls ./

RUN npm rebuild node-sass
RUN npm install
RUN npm run build
