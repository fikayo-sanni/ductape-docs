---
sidebar_position: 3
---

# Apps

You can manage your ductape apps using the ductape cli `app` commands

## Creating Apps

To create a new app in your workspace run the command

``` bash
ductape app --new
```

or

``` bash
ductape app -n
```

You will the be required to provide the following fields

- **Name of App or Service:** name of the app or service being created
- **Description:** description of what the app does **optional field

## Import App Actions

On creating an app, you can import your app actions by importing a **postman collection**, only **postman v2.1** exported json files can currently be imported with support for **Open API 3.0** and **Postman v2.0** formats in the pipeline


To import the json file, you need run the following command

``` bash
ductape app --upload
```

or

``` bash
ductape app -u
```

This command would give you a prompt to select or create the app you want to import the actions into, after selecting/creating the app, you will be shown a prompt to select the file you want to import the actions from

**NOTE:** the file has to be **postman v2.1 json format**


## Fetch Apps

To fetch the apps in your current workspace. run the following command

``` bash
ductape app --list
```

or

``` bash
ductape app --li
```