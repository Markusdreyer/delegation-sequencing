FROM node:14.15.1

LABEL version="1.0"
LABEL description="Backend image"

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN ls
RUN npm install --production
RUN npm run tsc
COPY . .

EXPOSE 8000

CMD ["npm", "start"]