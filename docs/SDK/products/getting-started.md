---
sidebar_position: 1
---

# Getting Started with Products

Products in Ductape combine app actions and reusable components to deliver advanced functionality within your applications. By leveraging products, you can create custom logic using reusable components, while incorporating actions from multiple sources. This allows you to build sophisticated features and workflows without developing everything from scratch.

With Ductape, products provide a seamless way to extend your platform’s capabilities, offering greater flexibility and control over your development process. Whether you’re combining data from different APIs, orchestrating complex business processes, or enhancing your microservices architecture, products help you efficiently build and maintain robust solutions.

## Product Resources

### Apps
Products in Ductape provide an interface for adding apps to your processes. These apps can be either:
- **Private Apps**: Internal services within your workspace.
- **Public Apps**: External apps available on the Ductape marketplace.

To use these apps, you need to set up and configure them for your product.

### Databases
Ductape allows you to create direct interfaces with databases, enabling you to perform atomic **database actions**. This feature facilitates the creation of reusable functionalities that streamline development.

### Notifications
Ductape makes it easy to handle notifications to your clients, supporting multiple formats:
- **Push Notifications**
- **Emails**
- **Callbacks**

This enables a flexible approach to keep your users informed with the right messages at the right time.

### Jobs
Ductape helps you define long-running jobs, automate their execution, and scale them as needed. Features like retry mechanisms and the ability to stop and start jobs provide control and reliability for your workflows.

### Cloud Functions
Ductape supports reusable functions written in Node.js, with plans to expand language support. Functions streamline processes by encapsulating logic that can be executed within the platform, promoting code reuse across workflows.

### Caches
Ductape offers tools to build and manage data caches, optimizing performance by reducing the need for repeated data retrieval. Caching ensures faster execution of tasks, minimizing redundant operations and conserving resources.

### Features
Features in Ductape are collections of sequences that can be executed either in a defined order or concurrently, depending on your configuration. By combining various components like functions, products, and jobs, you can create scalable workflows that enhance your platform’s functionality.

### Message Brokers
Ductape integrates with all the popular message brokers, enabling you to process and handle messages asynchronously. This is useful for event-driven architectures and allows for better scalability by decoupling processes and also helps with switching between multiple brokers seamlessly

### Storage
Ductape provides storage resources that enable you to upload, store, and manage files within your product. This makes it easy to handle files, such as images, documents, or any other type of data, as part of your workflows and also helps with switching between storage providers seamlessly