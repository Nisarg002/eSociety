from config.projectDatabase import state_collection 
from models.ProjectStateModel import State,StateOut
from bson import ObjectId

async def getAllStates():
    states = await state_collection.find().to_list()
    return [StateOut(**state) for state in states]

async def addState(state:State):
    result = await state_collection.insert_one(state.dict())
    return {"message":"Data added successfully"}

async def deleteState(stateId:str):
    result = await state_collection.delete_one({"_id":ObjectId(stateId)})
    return {"message":"Data is deleted"}

async def getStateById(stateId:str):
    state = await state_collection.find_one({"_id":ObjectId(stateId)})
    return StateOut(**state)