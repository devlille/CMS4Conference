FROM node:20

COPY . .

RUN <<EOF
    apt update
    apt upgrade -y
    npm install
    (cd public && npm install)
EOF

WORKDIR /workspace

CMD ["npm", "start"]
