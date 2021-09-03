FROM nginx:latest

WORKDIR /home/application/

COPY . /home/application/

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \
    npm

RUN ls ./

#RUN npm update
RUN npm rebuild node-sass
#RUN npm i npm@latest -g
RUN npm install
RUN npm run build
