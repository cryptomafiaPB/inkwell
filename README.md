# Inkwell – Blog Publishing API with Admin Approval Flow 🚀

[![Node.js CI](https://img.shields.io/github/actions/workflow/status/cryptomafiaPB/inkwell/ci.yml)](https://github.com/cryptomafiaPB/inkwell/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

**This is submition for [Masterji](https://www.masterji.co/) project [challenge](https://www.masterji.co/project/31243610-f388-4693-a7e6-56f4226935c9).**

## 📚 Overview

**Inkwell** is your go-to, production-ready REST API for a modern blogging platform. Built with Express.js and MongoDB, it packs:

- ✨ Robust admin-approval moderation
- 🔒 JWT + API-Key security
- 👥 Role-based access (Admin vs User)
- 🧩 Modular, maintainable architecture
- 🐱‍🏍 Rate limiting & error handling

---

## ✨ Features

- 🔐 **User Registration & Login** (JWT)
- 🛡️ **API Key System** for every protected route
- 👮‍♀️ **Role-Based Access Control** (admin / user)
- 📝 **Blog Post Workflow**: pending → approved/rejected
- 📋 **Admin Approval Flow**: only approved posts go live
- 🗂️ **Categories**: CRUD with admin-only creation
- 💬 **Comments**: nested comments on posts
- 📜 **Audit Trail** in `post_reviews` for all admin actions
- 🌐 **Slug-based URLs** for SEO
- 🛑 **Rate Limiting** to prevent abuse
- ✅ **Comprehensive Error Handling**
- 📬 **Postman Collection** for “one-click” testing
- 📊 **ER Diagram & Workflow** on Eraser.io

---

## 🗂️ Database Models

| Collection       | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| **users**        | Accounts, roles, API keys, password reset tokens                           |
| **api_keys**     | API key details per user                                                   |
| **posts**        | Blog posts with status (`pending`/`approved`/`rejected`), author, category |
| **categories**   | Post categories                                                            |
| **post_reviews** | Audit trail of approvals/rejections                                        |
| **comments**     | Comments and replies on posts                                              |

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/cryptomafiaPB/inkwell.git
cd inkwell
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` in the project root:

```ini
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d
NODE_ENV=development
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### 4. Run Locally

```bash
npm run dev
```

---

## 🧾 Postman Collection

I’ve built a comprehensive Postman collection to help you explore and test every endpoint with the correct workflow:

### Option 1: Import JSON File

1. Download the collection and environment files from the [`postman`](https://github.com/cryptomafiaPB/inkwell/tree/main/postman) folder:
   - [`InkWell.postman_collection.json`](https://github.com/cryptomafiaPB/inkwell/blob/main/postman/InkWell.postman_collection.json)
   - [`InkWell Dev Env.postman_environment.json`](https://github.com/cryptomafiaPB/inkwell/blob/main/postman/InkWell%20Dev%20Env.postman_environment.json)
2. Open Postman → **Import** → **File** → select the JSON files.
3. Select the imported environment (e.g., "InkWell Dev Env").
4. Start sending requests!

### Option 2: Join via Invite Link (RECOMMENDED)

1. Click the invite link below:
   👉 [Join Inkwell Collection in Postman Link 1](https://app.getpostman.com/join-team?invite_code=8e2f63c3fd8621ec84570382fdc4cb0c08aa9fc3996c287fef074dc1d9f6ea71&target_code=eaf35749c144020a2b65e669251a7f84)

   [or Link 2](https://www.postman.com/warped-capsule-349623/workspace/masterji/collection/23349780-f930f7d3-17a8-4619-9a69-1acdcb7f0214?action=share&creator=23349780&active-environment=23349780-34f50016-cac5-41c5-b5a9-f370c647bd49)

   [Environments Link](https://www.postman.com/warped-capsule-349623/workspace/masterji/environment/23349780-34f50016-cac5-41c5-b5a9-f370c647bd49?action=share&creator=23349780&active-environment=23349780-34f50016-cac5-41c5-b5a9-f370c647bd49)

2. Accept the invitation.
3. Pick your environment and you’re all set! ✅

> 📖 **Note:** Detailed documentation—including flow examples, schema diagrams, and request sequences—is embedded within the collection. Check out the “README” folder in Postman for step-by-step guides.

---

## 🧩 ER Diagram & Workflow

Visualize the data models, controllers, and middleware flow in detail on Eraser.io:

🔗 [View Schema & Workflow on Eraser.io](https://app.eraser.io/workspace/0Nt11I3QkeSAdT7expEw?origin=share)

---

## 🧑‍💻 Usage & Endpoints

> See the Postman collection for **full** examples and expected responses!

### Authentication & API Keys

| Method | Endpoint                | Description                          |
| ------ | ----------------------- | ------------------------------------ |
| POST   | `/api/v1/auth/register` | Register new user                    |
| POST   | `/api/v1/auth/login`    | Login and receive JWT                |
| GET    | `/api/v1/auth/api-key`  | Generate API Key (JWT required)      |
| GET    | `/api/v1/auth/me`       | Get profile (JWT + API-Key required) |

### User Posts

| Method | Endpoint               | Description                           |
| ------ | ---------------------- | ------------------------------------- |
| POST   | `/api/v1/me/posts`     | Create a new post                     |
| GET    | `/api/v1/me/posts`     | List your posts                       |
| PUT    | `/api/v1/me/posts/:id` | Edit own post (pending/rejected only) |
| DELETE | `/api/v1/me/posts/:id` | Delete own post (pending/rejected)    |

### Public Posts & Comments

| Method | Endpoint                        | Description                 |
| ------ | ------------------------------- | --------------------------- |
| GET    | `/api/v1/posts`                 | List all approved posts     |
| GET    | `/api/v1/posts/:id`             | Get one post by id          |
| POST   | `/api/v1/me/posts/:id/comments` | Comment on a published post |

### Admin Review

| Method | Endpoint                          | Description                  |
| ------ | --------------------------------- | ---------------------------- |
| GET    | `/api/v1/admin/posts/pending`     | List all pending posts       |
| POST   | `/api/v1/admin/posts/:id/approve` | Approve a post               |
| POST   | `/api/v1/admin/posts/:id/reject`  | Reject a post (with comment) |
| POST   | `/api/v1/categories`              | Create a new category        |
| GET    | `/api/v1/categories`              | List all categories (Public) |

### Utility

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | `/api/v1/health-check` | Check server status |

---

## 🤝 Contributing & Feedback

We ❤️ open source! Feel free to:

- 🐛 **Report Issues** on GitHub
- 💡 **Suggest Features** via issues or discussions
- 🚀 **Submit a PR**—we’ll review and merge promptly!

Your contributions make Inkwell better! 🙏

---

## 🧩 License

Distributed under the **ISC License**. See [LICENSE](LICENSE) for details.

---

## 🙋‍♂️ Need Help?

If anything’s unclear, or you hit a snag:

- Open an issue in this repo
- Ping me at [`pranavbagalofficial@gmail.com`](mailto:pranavbagalofficial@gmail.com)

W's in the chat! ✍️📢

Project from masterji.co

## 🙌 Acknowledgements

Special thanks to:

- [Chai code](https://www.chaicode.com/) hitesh chaudhary
- [web dev cohort](https://courses.chaicode.com/learn/batch/Web-Dev-Cohort) for support and resources
- [masterji](https://www.masterji.co/) for project inspiration.
