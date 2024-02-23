from core.settings import DEBUG
import sys

if len(sys.argv) > 1 and not (sys.argv[1] in ['migrate', "makemigrations", "clear_all_sessions"]):
    print("[Worker] Starting Thread...")
    from backend.invoke_worker import (
        session,
        join_library,
        borrow_book,
        statistic
    )
    print("[Worker] Thread Started!")

