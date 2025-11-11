# Docker Setup Troubleshooting

## Issue: Docker Desktop Not Running

If you get this error:
```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.47/containers/json": 
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

**Solution:** Docker Desktop needs to be started.

## Steps to Fix:

1. **Start Docker Desktop:**
   - Open Docker Desktop from the Start menu
   - Wait for it to fully start (whale icon in system tray should be steady)
   - You'll see "Docker Desktop is running" when ready

2. **Verify Docker is Running:**
   ```bash
   docker ps
   ```
   Should show an empty list (no error)

3. **Start PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

4. **Verify Container is Running:**
   ```bash
   docker ps
   ```
   Should show the `resume-postgres` container

5. **Check Logs (if needed):**
   ```bash
   docker-compose logs postgres
   ```

## Alternative: Use Docker Compose V2 Syntax

If you have Docker Compose V2, you can also use:
```bash
docker compose up -d
```
(Note: `compose` instead of `compose` - no hyphen)

## Common Issues:

### Port 5432 Already in Use
If you get an error about port 5432 being in use:
- You might have PostgreSQL already running locally
- Change the port in `docker-compose.yml`:
  ```yaml
  ports:
    - "5433:5432"  # Use 5433 instead
  ```
- Then update DATABASE_URL to use port 5433

### Container Name Already Exists
If the container name is taken:
```bash
docker rm resume-postgres
docker-compose up -d
```

