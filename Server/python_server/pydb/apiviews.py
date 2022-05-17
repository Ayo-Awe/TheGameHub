from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Gameusers
from .serializers import GameusersSerializer


class Game(APIView):
    def get(self, request):
        users = Gameusers.objects.all()[:20]
        user_serializer = GameusersSerializer(users, many=True).data
        return Response(user_serializer)


class UserCreate(generics.CreateAPIView):
    queryset = Gameusers.objects.all()
    serializer_class = GameusersSerializer
