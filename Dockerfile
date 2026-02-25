FROM node:20

WORKDIR /app
COPY ./ /app

ENV NEXT_PUBLIC_BASE_URL="https://resources.themif.org/api"

RUN npm i
RUN npm run build

CMD npm run start
