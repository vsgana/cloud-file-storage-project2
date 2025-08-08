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
📂 Project Structure
'''
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
'''

