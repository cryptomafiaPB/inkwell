# Inkwell – Blog Publishing API with Admin Approval Flow

## Description

### 🔍 Description

Inkwell is a REST API for a blogging platform where users can write blog posts, but the posts must be approved by an admin before being published.

This project aims to content moderation, approval workflows, and user roles (admin vs regular user).

## 🎯 End Goal

- Fully working Express.js API to create, review, approve, and publish blog posts

- Role-based auth (user vs admin)
- JWT authentication + API Key system
- Proper CRUD for blog posts and categories
- Modular production-ready code

## 📊 Tables

- users
- api_keys
- posts
- categories
- post_reviews ( audit trail)
- comments ( comments system)

## 🧾 API Routes to Build

### 🔐 Auth & API Key:

- POST /auth/register → Register as regular user
- POST /auth/login → Login with credentials
- POST /auth/api-key → Generate API key
- GET /auth/me → Get current user details

manual DB update for admin role.

## 📝 Post Routes:

- POST /posts → Create a blog post (default status: “pending”)
- GET /posts → List published posts (public)
- GET /posts/:id → View published post
- PUT /posts/:id → Edit a post (only by author, if not approved)
- DELETE /posts/:id → Delete a post (only by author, if not approved)

### 🔎 Admin Post Review Routes:

- GET /admin/posts → List all pending posts
- PUT /admin/posts/:id/approve → Approve a post
- PUT /admin/posts/:id/reject → Reject with optional comment
- Admin routes are protected by both JWT + Role check middleware

### 🏷️ Category Routes:

- POST /categories → Add a new category (admin)
- GET /categories → List all categories

### 🛡️ Security

- JWT auth for all private routes
- Role-based authorization for admin-only actions
- API key required for all routes except login/register

### 🔄 Status Flow

Blog post has a status field:

- `pending (default)`
- `approved`
- `rejected`

  `Only approved posts are public. Rejected posts can be edited and resubmitted`

### 🧠 Additional Features

- Add post_reviews table to log admin actions with timestamps
- Comments system (comments table with user + post)
- Slug-based URLs (/posts/my-first-post)
- Public endpoint for featured posts
- Rate limiting or spam protection

## ✅ Deliverables Checklist

- JWT auth + API Key system
- Role-based access (admin vs user)
- Blog post workflow (create → approve/reject)
- CRUD for posts & categories
- Middleware (JWT, role check, API key)
- DB structure + relationships
- Bonus (comments, slugs, reviews, rate limit)
