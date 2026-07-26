#/usr/bin/bash
# active python env
source .venv/bin/activate

# launch the app
uvicorn main:app --reload
