```sh
MMP_CANCER_WEB_SERVICE                                                             

```                                                             

## 1. Project Overview

The Mmpc full-stack initiative is engineered to streamline the collection and analysis of genomic data from significant pathogens. Leveraging Docker's capabilities, the project is composed of five distinct container services:

1. A front-end built with React, accessible via port 3000.
2. A back-end powered by Django, available through port 8000.
3. A real-time debugger for the back-end through port 3001.
4. A PostgreSQL database service, configured on port 5433, which is a departure from the default PostgreSQL port.
5. An Nginx web server, presenting the React-built front-end on port 80.
6. WebSocket communications facilitated through Redis.

![Docker build](/schema_bd/docker.jpg)


## 2. Environment Configuration

Prior to the project deployment, it is essential to duplicate the `.env.example` files located in the `/app` directory for the front-end and the `/api` directory for the back-end. These duplicates should be placed in their respective directories. Subsequently, customize the parameters within these new files as required. Upon completion of these modifications, rename each file to `.env`.

## 4. Deployment
After configuring the `.env` files, execute the command below to establish the Docker environment:

```sh
docker-compose up -d
```

To view the updates applied in React's development mode (port 3000) within a production environment, it's essential to rebuild the application:

```sh
npm run build
```

### Running the services for development
.vscode/tasks.json file contains a set of predefined task to run some essential commands easily:
* run-build-docker-backend                  // Rebuild and run docker services
* run-docker-backend                        // Run docker services without rebuilding
* reload-docker-backend                     // Reload api docker processes to apply modifications without restarting the container
* delete-docker-backend                     // Delete current docker containers
* run-frontend-app                          // Run front-end application (locally, not over docker)
* build-frontend-app                        // Build front-end app for production and pre-production environments over a docker container
* START_ALL_DEVELOPMENT_SERVICES            // Run 'run-docker-backend' & 'run-frontend-app' tasks
* START_REBUILD_ALL_DEVELOPMENT_SERVICES    // Run 'run-build-docker-backend' & 'run-frontend-app' tasks

Check out .vscode/tasks.json for further description about what each task works for 

These tasks can be applied easily by navigating through Terminal->Run Task..-> 

### Debugging with vscode

In order to use breakpoints inside front-end and back-end source code, .vscode/laungh.json defines three configurations:
* debug-api-docker                          //Attach vscode debugger to api docker container
* debug-app-chrome                          //Attach vscode debugger to a chrome browser instance running the application front-end
* START_DEBUGGING_ALL_SERVICES              //Attach both debugging processes as one

Check out .vscode/launch.json for further description about what each configuration is designed for 

When using the debugger, project tasks defined in the previous section can be applied without breaking the debugger connection.


## 5. Important Django Security Configuration

Currently, Django is configured with DEBUG mode enabled. For deployment in a real production environment, it's crucial to modify this setting. Key .env settings to check are:

1. **DJANGO_DEBUG**: Set this to False in production (`DEBUG = False`). It prevents displaying sensitive/debug information.
2. **DJANGO_SECRET_KEY**: A critical, large random value used for CSRF protection and more. It's vital to change this for production and ensure it remains confidential and secure.
3. **ALLOWED_HOST**: Specifies host/domain names that the Django site can serve, a crucial measure against HTTP Host header attacks. This list can include fully qualified names (like 'www.example.com') and subdomain wildcards (like '.example.com'). A '*' value matches any host; ensure proper validation of the Host header in this case.
4. **DJANGO_CORS_ORIGIN_ALLOW_ALL**: When True, allows CORS requests from any domain. If False, only domains in DJANGO_CORS_ORIGIN_WHITELIST are permitted.
5. **DJANGO_CORS_ORIGIN_WHITELIST**: A list of domains allowed to make CORS requests when DJANGO_CORS_ORIGIN_ALLOW_ALL is False.
6. **DJANGO_CSRF_TRUSTED_ORIGINS**: Defines trusted origins for CSRF protection, ensuring requests originate from the same domain as the application.
7. **DJANGO_ALLOWED_DOMAINS_REFERER and DJANGO_ALLOWED_HOSTS_REFERER**: An additional security layer for production. If a user’s origin isn’t from specified domains or IPs (frontend), Django will reject the connection outright.


At present, several additional configurations have been implemented to bolster security:

```sh
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_CONTENT_TYPE_OPTIONS = 'nosniff'
X_FRAME_OPTIONS = 'DENY'
X_XSS_PROTECTION = '1; mode=block'
```

This project incorporates 12 security middleware addressing issues like clickjacking, CORS, session management, CSRF protection, IP banning, GeoIP, and more. It's crucial to properly configure and maintain these in a production environment.

It is strongly advised against using the development environment for production purposes. For optimal performance and security in production, the following setup is recommended:

- **Frontend**: Utilize Nginx for serving the front-end content.
- **Backend**: Employ Gunicorn in conjunction with Uvicorn (for handling WebSockets) behind an Nginx reverse proxy.


Read carefully: https://docs.djangoproject.com/en/4.1/howto/deployment/
More info: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/Deployment



## 6. Technologies used.

1. React: https://reactjs.org/
2. Redux: https://redux.js.org/
3. Django: https://docs.djangoproject.com/
4. Redis: https://redis.io/
5. JWT: https://jwt.io/
6. PostgreSQL: https://www.postgresql.org/docs/
7. GeoLite2: https://dev.maxmind.com/geoip/geolite2-free-geolocation-data


