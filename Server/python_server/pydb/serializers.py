from rest_framework import serializers
from .models import Gameusers
from django.contrib.auth.models import User


class GameusersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gameusers
        fields = ('userid', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

        def create(self, validated_data):
            user = Gameusers(
                userid=validated_data['userid'],
                username=validated_data['username']
            )
            user.set_password(validated_data['password'])
            user.save()
            return user
