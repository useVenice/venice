```dataview
TABLE WITHOUT ID
	link(file.path, replace(replace(file.path, "/README.md", ""), "integrations/integration-", "")
	) as integration, 
	status as Status
FROM "integrations"
WHERE file.path != "integrations/README.md"
```



