---
title: Deploying n8n with Docker
category: concepts
tags: [docker, self-hosting, deployment, docker-compose]
summary: How to self-host n8n for production using Docker and docker-compose instead of the cloud version.
---

Self-hosting means running n8n on your own server instead of using n8n's cloud service. Docker packages n8n and everything it needs into a container that runs the same way on any machine, and docker-compose lets you define that setup (plus a database) in one file.

## Basic setup steps

1. Install Docker and Docker Compose on your server.
2. Create a project folder and inside it a `docker-compose.yml` file describing the n8n service and a database.
3. Create a `.env` file next to it holding secrets like your database password and encryption key.
4. Run `docker compose up -d` to start everything in the background.
5. Visit `http://your-server-ip:5678` to open n8n and complete the first-time setup (create an owner account).
6. For production, put n8n behind a reverse proxy (like Nginx or Traefik) with HTTPS/SSL so traffic is encrypted, and set `WEBHOOK_URL` to your public HTTPS domain so webhooks work correctly.

## Example docker-compose.yml

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data

  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY}
      WEBHOOK_URL: https://n8n.yourdomain.com/
      GENERIC_TIMEZONE: America/New_York
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

volumes:
  postgres_data:
  n8n_data:
```

Corresponding `.env` file:

```
POSTGRES_PASSWORD=change_this_password
N8N_ENCRYPTION_KEY=a-long-random-string-keep-this-safe
```

## Common mistake

Not backing up (or losing) the `N8N_ENCRYPTION_KEY`. This key is what n8n uses to encrypt all saved credentials. If you lose it or change it without migrating properly, every saved credential becomes unreadable and you'll need to re-enter all of them. Always store this key safely and keep it identical across restarts and upgrades.
