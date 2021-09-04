FROM nginx:latest

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime



WORKDIR /home/application/

COPY . /home/application/

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \
    npm

RUN apt-get instlal git
RUN apt-get install libseccomp-dev

RUN ls ./

RUN npm rebuild node-sass
RUN npm install
RUN npm run build
