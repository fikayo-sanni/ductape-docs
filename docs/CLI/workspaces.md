---
sidebar_position: 2
---

# Workspaces

You can manage your ductape workspaces using the ductape cli `workspace` commands

## Creating Workspaces

To create a new workspace run the command

``` bash
ductape workspace --new
```

or

``` bash
ductape workspace -n
```

You will the be required to provide the following fields

- **Workspace Name:** name of workspace, with no spaces or special characters


## Change Workspace

To fetch list of workspaces, and switch to a new workspace, use the command 

``` bash
ductape workspace --select
```

or

``` bash
ductape workspace -s
```

You would receive a prompt with which you can either pick a workspace or create a new workspace. On selecting a workspace, your local workspace would be defaulted to the workspace selected

## Fetch Current Workspace

To fetch the current workspace information. run

``` bash
ductape workspace --info
```

or 

``` bash
ductape workspace -i
```

You will receive the workspace name and workspace id of the current workspace