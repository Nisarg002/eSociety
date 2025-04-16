from fastapi import APIRouter
from models.ProjectStateModel import State,StateOut
from controllers.ProjectStateController import addState,getAllStates,deleteState,getStateById

router = APIRouter()

@router.post("/state/")
async def post_state(state: State):
    return await addState(state)

@router.get("/state/")
async def get_states():
    return await getAllStates()

@router.get("/state/{stateId}")
async def get_state_by_id(stateId: str):
    return await getStateById(stateId)

@router.delete("/state/{stateId}")
async def delete_state(stateId: str):
    return await deleteState(stateId)