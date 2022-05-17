from django.urls import path
from .apiviews import UserCreate

urlpatterns = [
    path("users/", UserCreate.as_view(), name="user_create")
]
