build:
	docker build -t audit-app .

run:
	docker run -p 3000:3000 audit-app

start: build run

.PHONY: build run start