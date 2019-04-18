FROM node

COPY ./package.json /src/package.json
WORKDIR /src

RUN yarn 

ENV PATH ./node_modules/.bin:$PATH
CMD ["yarn","start"]
