FROM node:20-alpine 

WORKDIR /app
RUN apk add --no-cache git
RUN git clone https://github.com/Matokuun/UxDebt-front .

RUN npm install serve -g
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]