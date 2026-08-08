# This is multi-stage dockerfile 

FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Creates /app/dist folder
RUN npm run build 

FROM nginx:alpine
# Copy Nginx configuration relative to build context (frontend/)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# need to copy static files from the build stage from /app/dist path to nginx default folder for static files
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
# need to run as foreground
CMD [ "nginx", "-g", "daemon off;" ]