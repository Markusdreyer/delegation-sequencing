FROM node:14.15.1

LABEL version="1.0"
LABEL description="Backend image"

WORKDIR /backend

COPY ["package.json", "package-lock.json", "./"]
RUN npm install 
COPY . .

EXPOSE 8000 80

CMD ["npm", "start"]