from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any

from ..database import get_db
from .auth import get_current_active_user

router = APIRouter(
    prefix="/monitor",
    tags=["monitor"]
)

@router.get("/invest", response_model=List[Dict[str, Any]])
async def get_monitor_invest_data(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Fetch aggregated investment data from view_monitor_invest.
    Requires authentication.
    """
    try:
        # Query the view directly using raw SQL or map it to a model
        # using raw SQL for simplicity with Views
        result = db.execute(text("SELECT * FROM view_monitor_invest ORDER BY id_virtual"))
        
        # Convert result to list of dicts
        columns = result.keys()
        data = [dict(zip(columns, row)) for row in result]
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
