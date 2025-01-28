---
sidebar_position: 1
---

# Getting Started with Apps

Apps are services and products that can be integrated into your platform to provide additional functionality. Each app is expected to contain a **collection of actions** that offer specific units of functionality for your product.  

Apps are broadly categorized into two types:  

- **Private Apps**  
- **Public Apps**  

### **Private Apps**  
Private apps are services used internally within your workspace. These apps are developed by your team to provide services within your platforms or products. They can range from microservices that communicate with each other using Ductape to standalone services that share data and provide functionality within your workspace.  

### **Public Apps**  
Public apps are services made available to third parties for their products, allowing them to build their own layers of logic on top of these services. Public apps are published by workspaces to share their functionalities with others and enable external developers to enhance their own products.  


## App Resources  

An application consists of the following main **resources**:  

- **Actions:** Specific tasks or operations the app performs, such as sending an email or creating a payment.  
- **Authentication:** Mechanisms for securely accessing the app, such as API keys or OAuth.  
- **Events:** Triggers that notify your platform of changes or updates, such as "New User Signed Up" or "Order Completed."  

## App Values  

In addition to resources, apps require the following **values** for setup and configuration:  

- **Environments:** Define the context in which the app operates, such as staging, production, or testing.  
- **Variables:** Dynamic inputs that are passed during runtime to customize the app’s behavior.  
- **Constants:** Static values that remain consistent across different environments or use cases.  
- **Retry Policy:** Rules for handling failed actions, including retry attempts and delays between retries.  
