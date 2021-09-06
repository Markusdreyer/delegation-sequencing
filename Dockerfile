FROM node:14


ENV REACT_APP_BACKEND_URL="http://delegation-sequencing.azurewebsites.net/asp-parser"

LABEL version="1.0"
LABEL description="Frontend image"

WORKDIR /frontend

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .


EXPOSE 3000

CMD ["npm", "start"]
