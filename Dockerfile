FROM node:14.15.1

ARG NODE_ENV

ENV REACT_APP_BACKEND_URL="http://34.141.107.82/asp-parser"

LABEL version="1.0"
LABEL description="Frontend image"

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production
RUN npm run tsc

COPY . .

EXPOSE 3000

CMD ["npm", "start"]