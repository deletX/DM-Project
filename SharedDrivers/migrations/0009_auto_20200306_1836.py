# Generated by Django 3.0.3 on 2020-03-06 18:36

import django.contrib.gis.db.models.fields
import django.contrib.gis.geos.point
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SharedDrivers', '0008_event_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='address',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='event',
            name='destination',
            field=django.contrib.gis.db.models.fields.PointField(default=django.contrib.gis.geos.point.Point(44.629418, 10.948245), srid=4326),
        ),
    ]