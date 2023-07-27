# Project Tech Stack Overview

This document outlines the various technologies used in our project. Our tech stack includes Next.js, PostgreSQL with GraphQL and PostGraphile, and rjsf (react-jsonschema-form) for form handling.

---

## [Next.js](https://nextjs.org/)

Next.js is a React-based open-source framework for building server-side rendered (SSR) and statically generated web applications. It provides capabilities such as hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and many more.

Using Next.js in our project simplifies the development process and enhances the performance of our app. It allows us to use both server-side rendering and static site generation, meaning our app can cater to various needs and traffic patterns. The pre-fetching feature ensures smoother navigation experience for our users, providing them with instant feedback as they interact with the app.

---

## [PostgreSQL](https://www.postgresql.org/)

PostgreSQL is a powerful, open-source object-relational database system. It has more than 15 years of active development and a proven architecture that has earned it a strong reputation for reliability, data integrity, and correctness.

We chose PostgreSQL for our project because of its performance, extensibility, and stringent standards compliance. It supports both SQL (relational) and JSON (non-relational) querying, making it a versatile choice for a variety of applications.

---

## [GraphQL](https://graphql.org/)

GraphQL is a data query and manipulation language for APIs, and a runtime for executing those queries with your existing data. It's known for enabling declarative data fetching where a client can specify exactly what data it needs from an API.

Our project leverages GraphQL for its flexibility and efficiency. GraphQL's declarative nature simplifies the process of requesting data from our server, allowing front-end developers to get the exact data they need without relying on backend developers to write the API endpoints.

---

## [PostGraphile](https://www.graphile.org/postgraphile/)

PostGraphile is a tool to rapidly create a GraphQL API for your PostgreSQL database. It's well-suited for apps that need high-performance real-time updates and a powerful, extensible GraphQL API.

In our project, PostGraphile is used to auto-generate a secure and performant GraphQL schema from our PostgreSQL database. This significantly speeds up our development process by eliminating the need to manually write a lot of back-end code.

---

## [rjsf (react-jsonschema-form)](https://github.com/rjsf-team/react-jsonschema-form)

rjsf, or React JSON Schema Form, is a simple React component capable of building HTML forms out of a JSON schema. It's a powerful tool that can handle complex form structures and validation.

We are using rjsf in our project for handling forms. Its ability to generate forms from a JSON schema allows us to keep our form structures flexible and easy to change as our project's needs evolve.

---

## [Relay](https://relay.dev/)

Relay is a robust, efficient GraphQL client, developed and used extensively by Facebook. It enables colocation of data dependencies with the components that use them, leading to more maintainable code and efficient network operations.

In our project, we are using Relay as our GraphQL client. Relay's design, which allows us to colocate our GraphQL queries with our React components, leads to less prop-drilling, better performance, and increased developer productivity. The framework's built-in tools for pagination, mutation, and subscription management save us time and ensure that our data operations are robust and efficient.

---
