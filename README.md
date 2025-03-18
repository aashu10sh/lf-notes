# Engineering Descisions
> Aashutosh Pudasaini

## Tech Stack

For Frontend, I have used React as it's the standard for building frontend interfaces. It's rich library collection and great documentation make it a valid choice.

For Backend, I have used Hono JS, which is a express-like minimal backend framework designed for it's simplicity and effictiveness. It's also known for having many adaptors and being able to run almost everywhere. 

For ORM, I have used Drizzle ORM because of the fine grained control it gives us when we're building our data repositories in our applicaitons, I could have used prisma here too but prisma requires me to learn it's specific `.schema` file and it does not scale very well and it's way of interating with the database is not very "sql like".

For Database, I have used postgresql because it fits our needs perfectly, it is a relational database with great support for storing json data and it's very fast and known for being lightweight and scalable. Mysql and sqlite both would have been fine choices.


## Authentication
We're using JWT authentication with a single `access token` as our project is not of that scale that requires us to use access and refresh tokens. 

## Setup

1. We're using Turbo-Repo to manage both frontend and the backend here, although not it's original purpost it does excellently when running things in parallel.

2. At the base of the project, `napkin` folder. run `npm i` or `pnpm i` ( if you're cool:P ). This should install all packages required for all workspaces.

3. Inside the `apps/api` folder, create a `.env` file and set `DATABASE_URL=...` to your Postgresql database url and set `JWT_SECRET=.. `. I rented my postgres db from neon.tech for convinience, I suggest you do the same.

4. Finally Run `npm run dev` or `pnpm dev` to run the application in dev mode. The web app should work on port 5173.

5. visit localhost:5173

## Interesting Fact.

You'll see that I have not set the CORS header handeling in my backend side, that's because I am using vite's development reverse proxy to handle that. It's very convinient and not many people know about it. The config can be found at `apps/web/vite.config.ts`















