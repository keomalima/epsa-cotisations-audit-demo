dev: install
	npm --prefix backend run dev & \
	npm --prefix frontend run dev

install:
	npm --prefix backend install
	npm --prefix frontend install

.PHONY: dev install