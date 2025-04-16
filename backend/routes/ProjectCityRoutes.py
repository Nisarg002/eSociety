from fastapi import APIRouter
from models.ProjectCityModel import City,CityOut
from controllers.ProjectCItyController import addCity,getAllCities,getCityById,deleteCity

router = APIRouter()

@router.post("/city/")
async def post_city(city:City):
    return await addCity(city)

@router.get("/city/")
async def get_cities():
    
    return await getAllCities()

@router.get("/city/{cityId}")
async def get_city_by_id(cityId: str):
    return await getCityById(cityId)

@router.delete("/city/{cityId}")
async def delete_city(cityId: str):
    return await deleteCity(cityId)