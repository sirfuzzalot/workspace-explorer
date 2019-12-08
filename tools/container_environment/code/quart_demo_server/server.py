"""
Quart Demo Server
"""
###############################################################################
# Imports
###############################################################################

import sys
import os
import quart
import logging

###############################################################################
# Setup
###############################################################################

loggingLevel = logging.INFO
if os.environ.get("DEBUG"):
    if os.environ.get("DEBUG").lower() in ("true", "1"):
        loggingLevel = logging.DEBUG
logger = logging.getLogger(__file__)
logger.setLevel(loggingLevel)
handler = logging.StreamHandler(stream=sys.stdout)
logger.addHandler(handler)

###############################################################################
# Main
###############################################################################

app = quart.Quart(__name__)

@app.route("/", methods=["GET"])
async def hello():
    logger.debug("/hello")
    return "Hello World"
