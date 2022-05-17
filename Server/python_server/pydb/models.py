from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Gameusers(models.Model):
    userid = models.AutoField(primary_key=True)
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=10)

    def __str__(self):
        return self.question
