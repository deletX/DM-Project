# Generated by Django 3.0.5 on 2020-09-06 15:08

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_notification_related_event'),
    ]

    operations = [
        migrations.AlterField(
            model_name='car',
            name='consumption',
            field=models.FloatField(default=10.0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(30)]),
        ),
    ]