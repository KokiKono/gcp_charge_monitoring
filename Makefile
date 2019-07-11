deploy:
	npm run deploy_function
setup:
	npm run create_topic & $(MAKE) deploy