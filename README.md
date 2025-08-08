# Cloud-Based File Storage System with Role-Based Access

📌 Overview

This project is a secure, scalable cloud-based file storage and sharing system built on AWS services.
It allows users to upload, download, move, share, and manage files with role-based access control.
The system is designed to ensure data security, versioning, and fine-grained permissions for different user roles.

---
🚀 Features

User Authentication – AWS Cognito handles sign-up, sign-in, and session management.

Role-Based Access Control – Permissions vary by role (Admin, Editor, Viewer, etc.).

File Upload & Download – Secure S3 storage with versioning enabled.

Move & Rename Files – Serverless Lambda function to relocate files in S3 and update metadata.

File Sharing – Share files with other users securely.

Metadata Storage – DynamoDB stores file details, permissions, and sharing info.

API-Driven Architecture – REST APIs for all operations.

Scalable & Serverless – Powered by AWS Lambda, S3, Cognito, DynamoDB, and API Gateway.

Logging & Monitoring – CloudWatch logs for debugging and performance monitoring.

---

## 🛠️ Tech Stack  

| Service / Tool         | Purpose                                  |
|------------------------|------------------------------------------|
| AWS S3                 | File storage (with versioning)           |
| AWS Lambda             | Backend logic for file operations        |
| AWS API Gateway        | Expose APIs to frontend                   |
| AWS Cognito            | Authentication & Authorization           |
| AWS DynamoDB           | Store metadata and permissions           |
| AWS IAM                | Role-based access policies               |
| CloudWatch             | Logging and monitoring                   |
| JavaScript / TypeScript| Backend & API integration                 |
| React (optional)       | Frontend file management UI               |

---

📂 Project Structure
```bash
cloud-file-storage/
│
├── lambda-functions/
│   ├── moveFile/
│   │   └── moveFile.js
│   └── ...
│
├── policies/
│   └── moveFilePolicy.json
│
├── frontend/
│   └── (React or JS frontend code)
│
├── README.md
└── package.json
```
---

⚙️ Deployment

1️⃣ Prerequisites
AWS account

Node.js installed

AWS CLI configured with credentials

GitHub repository for version control

2️⃣ Setup
1.Clone the repository
```bash
git clone https://github.com/yourusername/cloud-file-storage.git
cd cloud-file-storage
```
2.Deploy Lambda functions

Create a Lambda function in AWS

Upload the respective .js files from lambda-functions/

Attach IAM role with relevant policy (policies/moveFilePolicy.json)

3.Configure API Gateway

Create REST API

Connect endpoints to Lambda functions

4.Set Environment Variables

BUCKET_NAME
DYNAMO_TABLE

---
## 📌 API Endpoints

| **Category**                  | **Method** | **Endpoint**                    | **Description** |
|--------------------------------|------------|----------------------------------|-----------------|
| **Core User Authentication APIs** | POST       | `/signup`                        | Register a new user |
|                                | POST       | `/login`                         | Authenticate user & return tokens |
|                                | POST       | `/refresh-token`                 | Issue new access token using refresh token |
|                                | POST       | `/logout`                        | Invalidate token / sign out user |
|                                | GET        | `/me`                            | Get user profile info |
| **File Management APIs**       | GET        | `/files`                         | List all files and folders (optionally with folder path) |
|                                | POST       | `/upload`                        | Upload a file (multipart/form-data or presigned URL-based) |
|                                | DELETE     | `/files/{fileId}`                 | Delete a file |
|                                | PATCH      | `/files/{fileId}/rename`          | Rename a file |
|                                | GET        | `/files/{fileId}/download`        | Download file (or redirect to presigned URL) |
|                                | POST       | `/files/{fileId}/share`           | Generate pre-signed URL |
|                                | POST       | `/folders`                        | Create a folder |
|                                | PATCH      | `/files/{fileId}/move`            | Move file to another folder |





