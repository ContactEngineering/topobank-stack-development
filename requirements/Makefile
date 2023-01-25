.PHONY: all check clean

outputs := development.txt
setup_files := ../topobank/setup.cfg ../topobank-statistics/setup.cfg ../topobank-contact/setup.cfg ../topobank-ml/setup.cfg

all: $(outputs)

development.txt: $(setup_files)
	pip-compile --extra dev -v --resolver=backtracking --output-file $@ $(setup_files)

check:
	@which pip-compile > /dev/null

clean: check
	- rm *.txt
