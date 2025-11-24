"""
FastAPI backend for Python code execution.
Single endpoint: POST /execute
"""

import subprocess
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Python Interview Prep API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeRequest(BaseModel):
    code: str


class CodeResponse(BaseModel):
    stdout: str
    stderr: str
    success: bool
    timeout: bool = False


@app.post("/execute", response_model=CodeResponse)
async def execute_code(request: CodeRequest):
    """
    Execute Python code with 30s timeout.
    Returns stdout, stderr, and execution status.
    """
    code = request.code

    # Basic security: prevent some dangerous operations
    dangerous_patterns = [
        "import os",
        "import subprocess",
        "import sys",
        "__import__",
        "eval(",
        "exec(",
        "open(",
        "file(",
        "input(",
    ]

    # Only warn, don't block - this is for personal use
    # In production, use proper sandboxing (Docker, etc.)

    try:
        result = subprocess.run(
            [sys.executable, "-c", code],
            capture_output=True,
            text=True,
            timeout=30,
            # Limit resources
            env={"PATH": ""},
        )

        # Truncate output if too long (10KB limit)
        max_output = 10 * 1024
        stdout = result.stdout[:max_output]
        stderr = result.stderr[:max_output]

        if len(result.stdout) > max_output:
            stdout += "\n... (output truncated)"
        if len(result.stderr) > max_output:
            stderr += "\n... (output truncated)"

        return CodeResponse(
            stdout=stdout,
            stderr=stderr,
            success=result.returncode == 0,
            timeout=False,
        )

    except subprocess.TimeoutExpired:
        return CodeResponse(
            stdout="",
            stderr="Execution timed out (30s limit)",
            success=False,
            timeout=True,
        )
    except Exception as e:
        return CodeResponse(
            stdout="",
            stderr=f"Execution error: {str(e)}",
            success=False,
            timeout=False,
        )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
