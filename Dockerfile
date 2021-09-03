FROM node:14.15.1

LABEL version="1.0"
LABEL description="Frontend image"

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]