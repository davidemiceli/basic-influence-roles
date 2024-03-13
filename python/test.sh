#!/bin/bash

PYTHONPATH=src python -m coverage run --source=src -m unittest discover test -v