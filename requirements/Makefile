.PHONY: all check clean

outputs := development.txt
setup_files := ../topobank/pyproject.toml ../topobank-statistics/pyproject.toml ../topobank-contact/pyproject.toml ../topobank-publication/pyproject.toml ../ce-ui/pyproject.toml

all: $(outputs)

development.txt: $(setup_files)
	uv pip compile --extra dev -v --resolver=backtracking --output-file $@ ../topobank/pyproject.toml ../topobank-statistics/pyproject.toml ../topobank-contact/pyproject.toml ../topobank-publication/pyproject.toml ../ce-ui/pyproject.toml

check:
	@which pip-compile > /dev/null

clean: check
	- rm *.txt
