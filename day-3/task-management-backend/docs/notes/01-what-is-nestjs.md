# 1. What is NestJS, and why use it?

## What it is
NestJS is a **server-side TypeScript framework** for building scalable Node.js applications. Under the hood it runs on **Express** by default (you can swap to Fastify), so it's not a competitor to Express — it's a layer on top that adds **structure, conventions, and tooling**.

Think of it as: *Express handles HTTP; Nest handles how your app is organized.*

## What it borrows from
Nest's design is heavily inspired by **Angular** on the frontend:
- Modules
- Decorators
- Dependency injection
- A CLI that scaffolds files for you

If you've seen Angular, NestJS will feel familiar. If you've only used Express, the biggest mental shift is *less wiring, more declaring*.

## Why use it over plain Express?

| Concern | Plain Express | NestJS |
|---|---|---|
| Project structure | You invent it | Enforced conventions (modules/controllers/services) |
| Wiring dependencies | Manual `require`/`new` | Dependency injection container |
| Validation | Bring your own | First-class `class-validator` integration |
| Testing | Manual mocking | DI makes mocks trivial |
| Boilerplate | High | CLI generates it (`nest g …`) |
| TypeScript support | Add it yourself | First-class, out of the box |

## When NestJS is the right call
- Medium-to-large APIs where structure matters more than minimalism
- Teams that benefit from one obvious way of doing things
- Projects that need DI, validation, guards, interceptors, and pipes as first-class building blocks

## When it might be overkill
- A 3-route microservice
- A throwaway script or prototype
- When you don't want the abstraction tax

## Key insight
Nest doesn't replace Express — it **opinionates** Express. You give up some flexibility in exchange for a framework that scales as a codebase grows past one or two developers.
