FROM node:12.6.0

ENV SERVER_PORT=3000

# Set the working directory
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /app
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
