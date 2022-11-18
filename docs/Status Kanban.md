---

kanban-plugin: basic

---

## Development

- [ ] ```dataview
	LIST WITHOUT ID
		link(file.path, replace(replace(file.path, "/README.md", ""), "integrations/integration-", "")
		)
	FROM "integrations"
	WHERE file.path != "integrations/README.md" AND status = "development"
	```

## Production

- [ ] ```dataview
LIST WITHOUT ID
	link(file.path, replace(replace(file.path, "/README.md", ""), "integrations/integration-", "")
	)
FROM "integrations"
WHERE file.path != "integrations/README.md" AND status = "production"
```



%% kanban:settings
{"kanban-plugin":"basic"}
%%