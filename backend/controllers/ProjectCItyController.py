from config.projectDatabase import city_collection, state_collection
from models.ProjectCityModel import City,CityOut
from bson import ObjectId
from fastapi.responses import JSONResponse

async def addCity(city: City):
    city.state_id = ObjectId(city.state_id)  
    result = await city_collection.insert_one(city.dict())
    return JSONResponse(status_code=201, content={"message": "City added successfully"})

async def getAllCities():
    cities = await city_collection.find().to_list(length=None)
    for city in cities:
        if "state_id" in city and isinstance(city["state_id"],ObjectId):
            city["state_id"] = str(city["state_id"])
        state = await state_collection.find_one({"_id": ObjectId(city["state_id"])})

        if state:
            state["_id"] = str(state["_id"])
            city["state"] = state

    return [CityOut(**city) for city in cities]

async def getCityById(cityId:str):
    city = await city_collection.find_one({"_id":ObjectId(cityId)})

    if "state_id" in city and isinstance(city["state_id"],ObjectId):
         city["state_id"] = str(city["state_id"])
         state = await state_collection.find_one({"_id": ObjectId(city["state_id"])})

         if state:
             state["_id"] = str(state["_id"])
             city["state"] = state
    
    return CityOut(**city)

async def deleteCity(cityId: str):
    result = await city_collection.delete_one({"_id": ObjectId(cityId)})
    return JSONResponse(status_code=200, content={"message": "City deleted successfully"})
        
