.PHONY: all check clean

outputs := development.txt
setup_files := ../topobank/setup.cfg ../topobank/setup.py ../topobank-statistics/setup.cfg ../topobank-statistics/setup.py ../topobank-contact/setup.cfg ../topobank-contact/setup.py

all: $(outputs)

development.txt: $(setup_files)
	pip-compile --extra dev -v --output-file $@ ../topobank/setup.py ../topobank-statistics/setup.py ../topobank-contact/setup.py

check:
	@which pip-compile > /dev/null

clean: check
	- rm *.txt
